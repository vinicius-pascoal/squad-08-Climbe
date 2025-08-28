import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error';
import { usuarioRouter } from './routes/usuario.routes';
import { authRouter } from './routes/auth.routes';

export const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/usuarios', usuarioRouter);

app.use(errorHandler);
