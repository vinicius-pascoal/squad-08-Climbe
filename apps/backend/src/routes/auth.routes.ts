import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { tokenSchema, googleSchema } from '../dtos/auth.dto';
import { registrarAuditoria } from '../middlewares/auditoria';

export const authRouter = Router();

authRouter.post(
  '/token',
  validate({ body: tokenSchema }),
  registrarAuditoria('Usuario', 'Login'),
  authController.token
);

authRouter.post(
  '/google',
  validate({ body: googleSchema }),
  registrarAuditoria('Usuario', 'Login Google'),
  authController.google
);
