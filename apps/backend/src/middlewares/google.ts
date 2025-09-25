import { app } from "../app";
import { google } from "googleapis";
import type { Request, Response } from "express";
import { signAccessToken } from "../services/token.service";
import { usuarioRepo } from "../repositories/usuario.repo";
import { env } from "../config/env";

// Origens e credenciais (com fallbacks úteis para dev)
const BACKEND_ORIGIN =
  process.env.BACKEND_ORIGIN || `http://localhost:${env.port}`;
const FRONTEND_ORIGIN =
  process.env.FRONTEND_ORIGIN ||
  process.env.VITE_FRONTEND_URI ||
  "http://localhost:5173";

const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID || process.env.OAUTH2_ID || "";
const GOOGLE_CLIENT_SECRET =
  process.env.GOOGLE_CLIENT_SECRET || process.env.OAUTH2_SECRET || "";

const REDIRECT_URI = `${BACKEND_ORIGIN.replace(/\/$/, "")}/oauth2callback`;

// Cliente OAuth2 do Google
export const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI
);

// Rota 1: enviar usuário para a tela de consentimento do Google
app.get("/login", (_req: Request, res: Response) => {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return res.status(500).send("Google OAuth não configurado");
  }

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "openid",
      "email",
      "profile",
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/tasks",
      // Se quiser adicionar Drive: "https://www.googleapis.com/auth/drive.readonly"
    ],
  });

  return res.redirect(url);
});

// Rota 2: callback do Google (troca code por token, pega userinfo, cria JWT e redireciona)
app.get("/oauth2callback", async (req: Request, res: Response) => {
  try {
    const code = String(req.query.code || "");
    if (!code) return res.status(400).send("Missing code");

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      return res.status(500).send("Google OAuth não configurado");
    }

    // Troca o code por tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Busca dados do usuário
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data: profile } = await oauth2.userinfo.get();

    const email = String(profile.email || "").toLowerCase();
    const name = profile.name || (profile as any).given_name || "Usuário Google";

    if (!email) return res.status(400).send("Google user has no email");

    // Localiza ou cria usuário (já marcando como aprovado por padrão)
    let user = await usuarioRepo.findByEmail(email);
    if (!user) {
      user = await usuarioRepo.create({
        email,
        nomeCompleto: name,
        situacao: "aprovado",
        senhaHash: "", // login via google; sem senha local
      } as any);
    }

    // Bloqueia login se ainda não aprovado
    if ((String(user.situacao || "")).toLowerCase() !== "aprovado") {
      const url = new URL(FRONTEND_ORIGIN.replace(/\/$/, "") + "/");
      url.searchParams.set("login_error", "Pendente de aprovação");
      return res.redirect(url.toString());
    }

    // Gera seu JWT da aplicação
    const access_token = signAccessToken(user.id);

    // Redireciona para o frontend com o token e o usuário (frontend salva no localStorage)
    const redirect = new URL(FRONTEND_ORIGIN.replace(/\/$/, "") + "/auth");
    redirect.searchParams.set("access_token", access_token);
    redirect.searchParams.set(
      "user",
      JSON.stringify({
        id: user.id,
        nomeCompleto: user.nomeCompleto,
        email: user.email,
      })
    );

    return res.redirect(redirect.toString());
  } catch (err: any) {
    console.error("OAuth callback error", err);
    return res.status(500).send("OAuth error");
  }
});
