
import { app } from "../app";
import { google, drive_v3 } from "googleapis";
import { Request, Response } from "express";
import { signAccessToken } from "../services/token.service";
import { usuarioRepo } from "../repositories/usuario.repo";
import { env } from "../config/env";

export const oauth2Client = new google.auth.OAuth2(
  process.env.OAUTH2_ID,
  process.env.OAUTH2_SECRET,
  `${process.env.VITE_BACKEND_URI}/oauth2callback`,
);

app.get("/login", (req:Request, res:Response) => {
	const url = oauth2Client.generateAuthUrl({
		access_type: "offline",
		scope: [
			"https://www.googleapis.com/auth/userinfo.email",		//Acesso ao endereço de email do usuário
			"https://www.googleapis.com/auth/userinfo.profile",		//Acesso ao nome completo do usuário
			"https://www.googleapis.com/auth/calendar",				//Acesso aos eventos do google calendar
			"https://www.googleapis.com/auth/tasks",				//Acesso as tarefas do google calendar
			/*, "https://www.googleapis.com/auth/drive.readonly"	//Acesso ao google drive*/
		],
	});
	res.redirect(url);


const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN || `http://localhost:${env.port}`;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || process.env.VITE_FRONTEND_URI || "http://localhost:5173";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.OAUTH2_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || process.env.OAUTH2_SECRET || "";

function buildRedirectUri() {
  // Must exactly match the redirect URI set in Google Cloud Console
  return `${BACKEND_ORIGIN.replace(/\/$/, "")}/oauth2callback`;
}

// Step 1: Redirect user to Google's consent screen
app.get("/login", (_req, res) => {
  if (!GOOGLE_CLIENT_ID) {
    return res.status(500).send("GOOGLE_CLIENT_ID not configured");
  }
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: buildRedirectUri(),
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    scope: [
      "openid",
      "email",
      "profile"
    ].join(" "),
  });
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  res.redirect(authUrl);
});

// Step 2: Google calls us back with ?code=...
// Exchange code for tokens, fetch userinfo, issue our JWT, and redirect to frontend /auth with query params
app.get("/oauth2callback", async (req, res) => {
  try {
    const code = String(req.query.code || "");
    if (!code) return res.status(400).send("Missing code");
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      return res.status(500).send("Google OAuth env not configured");
    }

    // Exchange authorization code for access_token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: buildRedirectUri(),
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      const t = await tokenRes.text();
      return res.status(502).send(`Failed to exchange code: ${t}`);
    }
    const tokenJson: any = await tokenRes.json();
    const googleAccessToken = tokenJson.access_token;
    if (!googleAccessToken) return res.status(502).send("No access_token from Google");

    // Fetch user info
    const userinfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${googleAccessToken}` },
    });
    if (!userinfoRes.ok) {
      const t = await userinfoRes.text();
      return res.status(502).send(`Failed to get userinfo: ${t}`);
    }
    const profile: any = await userinfoRes.json();
    const email = String(profile.email || "").toLowerCase();
    const name = profile.name || profile.given_name || "Usuário Google";

    if (!email) return res.status(400).send("Google user has no email");

    // Find or create user; default situacao aprovado to allow access
    let user = await usuarioRepo.findByEmail(email);
    if (!user) {
      user = await usuarioRepo.create({
        email,
        nomeCompleto: name,
        situacao: "aprovado",
        senhaHash: "", // login via google; no password
      } as any);
    }

import './drive';
    if ((String(user.situacao || "")).toLowerCase() !== "aprovado") {
      // Block login if not approved
      const url = new URL(FRONTEND_ORIGIN.replace(/\/$/, "") + "/");
      url.searchParams.set("login_error", "Pendente de aprovação");
      return res.redirect(url.toString());
    }

    const access_token = signAccessToken(user.id);

    const redirect = new URL(FRONTEND_ORIGIN.replace(/\/$/, "") + "/auth");
    redirect.searchParams.set("access_token", access_token);
    redirect.searchParams.set("user", JSON.stringify({
      id: user.id,
      nomeCompleto: user.nomeCompleto,
      email: user.email,
    }));

    res.redirect(redirect.toString());
  } catch (err: any) {
    console.error("OAuth callback error", err);
    res.status(500).send("OAuth error");
  }
});
