import 'express-async-errors';
import express from 'express';
import cors from 'cors';
<<<<<<< Updated upstream
import { errorHandler } from './middlewares/error';
import { usuarioRouter } from './routes/usuario.routes';
import { authRouter } from './routes/auth.routes';
=======
import path from 'path';
import { errorHandler } from './middlewares/error';
import { authRouter } from './routes/auth.routes';
import { usuarioRouter } from './routes/usuario.routes';
>>>>>>> Stashed changes

export const app = express();
app.use(cors());
app.use(express.json());

<<<<<<< Updated upstream
app.use('/auth', authRouter);
app.use('/usuarios', usuarioRouter);
=======
app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRouter);
app.use('/api/usuarios', usuarioRouter);

// servir frontend estático (vite build)
const distDir = path.resolve(__dirname, '../../frontend/dist');
app.use(express.static(distDir));
app.get('*', (_req, res) => res.sendFile(path.join(distDir, 'index.html')));
>>>>>>> Stashed changes

app.use(errorHandler);
