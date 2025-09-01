import express from "express";
import cors from "cors";
import path from "path";
import { PrismaClient } from "@prisma/client";

import { setupOAuth } from "./modules/drive"

const app = express();
app.use(cors());
app.use(express.json());

setupOAuth(app);

const prisma = new PrismaClient();

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
