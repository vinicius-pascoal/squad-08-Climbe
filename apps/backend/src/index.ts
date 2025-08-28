import express from "express";
import cors from "cors";
import path from "path";
import { PrismaClient } from "@prisma/client";

const app = express();
app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();

import 'express-async-errors';
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

type JwtPayload = { sub: string };

function signAccessToken(userId: number) {
  const secret = process.env.JWT_SECRET || "dev-secret";
  const expiresIn = process.env.JWT_EXPIRES_IN || "15m";
  return jwt.sign({}, secret, { subject: String(userId), expiresIn });
}

function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret") as JwtPayload;
    (req as any).userId = Number(payload.sub);
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}

// --- Auth (OAuth2 password-like) ---
app.post("/api/auth/token", async (req, res) => {
  const { grant_type, username, password } = req.body || {};
  if (grant_type !== "password") return res.status(400).json({ error: "grant_type inválido" });
  if (!username || !password) return res.status(400).json({ error: "username/password obrigatórios" });

  const user = await prisma.usuario.findFirst({
    where: { OR: [{ email: username }, { cpf: username }] }
  });
  if (!user) return res.status(400).json({ error: "Credenciais inválidas" });

  const ok = await bcrypt.compare(password, user.senhaHash);
  if (!ok) return res.status(400).json({ error: "Credenciais inválidas" });

  if ((user.situacao || "").toLowerCase() !== "aprovado") {
    return res.status(403).json({ error: "Usuário pendente de aprovação" });
  }

  const access_token = signAccessToken(user.id);
  return res.json({
    access_token,
    token_type: "Bearer",
    expires_in: 900,
    user: { id: user.id, nomeCompleto: user.nomeCompleto, email: user.email }
  });
});

// --- Registrar Usuário (pendente) ---
app.post("/api/usuarios/register", async (req, res) => {
  const { nomeCompleto, cargoId, cpf, email, contato, senha } = req.body || {};
  if (!nomeCompleto || !cpf || !email || !senha) {
    return res.status(400).json({ error: "nomeCompleto, cpf, email e senha são obrigatórios" });
  }

  // Checar duplicidade básica
  const dup = await prisma.usuario.findFirst({ where: { OR: [{ email }, { cpf }] } });
  if (dup) return res.status(409).json({ error: "CPF ou e-mail já cadastrado" });

  const senhaHash = await bcrypt.hash(String(senha), 10);
  const created = await prisma.usuario.create({
    data: {
      nomeCompleto,
      cargoId: cargoId ?? null,
      cpf,
      email: String(email).toLowerCase(),
      contato: contato ?? null,
      situacao: "pendente",
      senhaHash,
    }
  });
  return res.status(201).json({ id: created.id, situacao: created.situacao });
});

// --- Aprovar Usuário (admin) ---
app.patch("/api/usuarios/:id/aprovar", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.usuario.findUnique({ where: { id } });
  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
  const updated = await prisma.usuario.update({ where: { id }, data: { situacao: "aprovado" } });
  return res.json({ id: updated.id, situacao: updated.situacao });
});

// --- Usuários CRUD ---
app.get("/api/usuarios/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const usuario = await prisma.usuario.findUnique({ where: { id } });
  if (!usuario) return res.status(404).json({ error: "Não encontrado" });
  res.json(usuario);
});

app.get("/api/usuarios", requireAuth, async (_req, res) => {
  const usuarios = await prisma.usuario.findMany();
  res.json(usuarios);
});

app.delete("/api/usuarios/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  await prisma.usuario.delete({ where: { id } });
  res.status(204).send();
});


app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.get("/api/usuarios", async (req, res) => {
  const id = req.query.id ? Number(req.query.id) : undefined;
  if (id) {
    const usuario = await prisma.usuario.findUnique({ where: { id } });
    return res.json(usuario);
  }
  const usuarios = await prisma.usuario.findMany();
  res.json(usuarios);
});

const distDir = path.resolve(__dirname, "../../frontend/dist");
app.use(express.static(distDir));
app.get("*", (_req, res) => res.sendFile(path.join(distDir, "index.html")));

const port = Number(process.env.PORT ?? 3000);
app.listen(port, "0.0.0.0", () => console.log(`Backend on http://0.0.0.0:${port}`));
