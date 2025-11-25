import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { tokenSchema, googleSchema, changePasswordSchema } from '../dtos/auth.dto';
import { registrarAuditoria } from '../middlewares/auditoria';
import { requireAuth } from '../middlewares/auth';

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

authRouter.post(
  '/change-password',
  requireAuth,
  validate({ body: changePasswordSchema }),
  registrarAuditoria('Usuario', 'Alterar Senha'),
  authController.changePassword
);
