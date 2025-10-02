import { Router } from 'express';
import { contratoController } from '../controllers/contrato.controller';
import { validate } from '../middlewares/validate';
import { contratoSchema } from '../dtos/contrato.dto';
import { requireAuth } from '../middlewares/auth';

export const contratoRouter = Router();

// Protegido por auth; ajuste para checar perfil se necessário
contratoRouter.post('/register', requireAuth, validate({ body: contratoSchema }), contratoController.register);
contratoRouter.get('/:id', requireAuth, contratoController.getById);