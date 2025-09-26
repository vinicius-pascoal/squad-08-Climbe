
import { app } from "../app";
import type { Request, Response } from "express";
import { signAccessToken } from "../services/token.service";
import { usuarioRepo } from "../repositories/usuario.repo";
import { env } from "../config/env";

const VERCEL_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '';
const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN || VERCEL_URL || `http://localhost:${env.port}`;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || VERCEL_URL || process.env.VITE_FRONTEND_URI || "http://localhost:5173";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.OAUTH2_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || process.env.OAUTH2_SECRET || "";

function buildRedirectUri() {
  return `${BACKEND_ORIGIN.replace(/\/$/, "")}/oauth2callback`;
}

app.get("/login", (_req, res) => {
  if (!GOOGLE_CLIENT_ID) return res.status(500).send("GOOGLE_CLIENT_ID not configured");
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: buildRedirectUri(),
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    scope: ["openid","email","profile"].join(" "),
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
});

app.get("/oauth2callback", async (req: Request, res: Response) => {
  try {
    const code = String(req.query.code || "");
    if (!code) return res.status(400).send("Missing code");
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      return res.status(500).send("Google OAuth env not configured");
    }

    // Exchange code for tokens
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

    // Get user info
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

    let user = await usuarioRepo.findByEmail(email);
    if (!user) {
      // Create PENDING user (require manual approval)
      user = await usuarioRepo.create({
        email,
        nomeCompleto: name,
        situacao: "pendente",
        senhaHash: "", // Google user: no local password
      } as any);

      // Redirect to login with confirmation message
      const to = new URL(FRONTEND_ORIGIN.replace(/\/$/, "") + "/");
      to.searchParams.set("created", "1");
      to.searchParams.set("msg", "solicitação de acesso criada");
      return res.redirect(to.toString());
    }

    // Existing user but not approved yet
    if ((String(user.situacao || "")).toLowerCase() !== "aprovado") {
      const to = new URL(FRONTEND_ORIGIN.replace(/\/$/, "") + "/");
      to.searchParams.set("pending", "1");
      to.searchParams.set("msg", "solicitação de acesso criada");
      return res.redirect(to.toString());
    }

    // Approved: issue our JWT and send to /auth
    const access_token = signAccessToken(user.id);
    const redirect = new URL(FRONTEND_ORIGIN.replace(/\/$/, "") + "/auth");
    redirect.searchParams.set("access_token", access_token);
    redirect.searchParams.set("user", JSON.stringify({
      id: user.id, nomeCompleto: user.nomeCompleto, email: user.email,
    }));
    return res.redirect(redirect.toString());
  } catch (err) {
    console.error("OAuth callback error", err);
    return res.status(500).send("OAuth error");
  }
});
