import { Router } from 'express';
import { emailController } from '../controllers/email.controller';
import { validate } from '../middlewares/validate';
import { emailSendSchema } from '../dtos/email.dto';
import { requireAuth } from '../middlewares/auth';

export const emailRouter = Router();

// Protegido por auth; ajuste para checar perfil se necessário
emailRouter.post('/send', requireAuth, validate({ body: emailSendSchema }), emailController.send);
