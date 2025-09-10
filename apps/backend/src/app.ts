import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { errorHandler } from './middlewares/error';
import { authRouter } from './routes/auth.routes';
import { usuarioRouter } from './routes/usuario.routes';
import { cargoRouter } from './routes/cargo.routes';


export const app = express();
app.use(cors());
app.use(express.json());

import './middlewares/drive';

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRouter);
app.use('/api/usuarios', usuarioRouter);
app.use('/api/cargos', cargoRouter);
// servir frontend estático (vite build)
const distDir = path.resolve(__dirname, '../../frontend');
app.use(express.static(distDir));
app.get('*', (_req, res) => res.sendFile(path.join(distDir, 'index.html')));

app.use(errorHandler);
