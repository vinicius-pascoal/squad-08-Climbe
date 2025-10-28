import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { errorHandler } from './middlewares/error';
import { authRouter } from './routes/auth.routes';
import { usuarioRouter } from './routes/usuario.routes';
import { cargoRouter } from './routes/cargo.routes';
import { emailRouter } from './routes/email.routes';
import { tarefaRouter } from './routes/tarefa.routes';
import { contratoRouter } from './routes/contrato.routes';
import eventRouter from './routes/event.router';
import { empresaRouter } from './routes/empresa.routes';
import propostaRouter from './routes/proposta.routes';

export const app = express();
app.use(cors());
app.use(express.json());

import './middlewares/google';

app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Rotas da API
app.use('/api/auth', authRouter);
app.use('/api/usuarios', usuarioRouter);
app.use('/api/cargos', cargoRouter);
app.use('/api/emails', emailRouter);
app.use('/api/contratos', contratoRouter);
app.use('/api/tarefas', tarefaRouter);
app.use('/api/events', eventRouter);
app.use('/api/empresas', empresaRouter);
app.use('/api/propostas', propostaRouter);

// Servir frontend estático (vite build)
const distDir = path.resolve(__dirname, '../../frontend');
app.use(express.static(distDir));
app.get('*', (_req, res) => res.sendFile(path.join(distDir, 'index.html')));

app.use(errorHandler);
