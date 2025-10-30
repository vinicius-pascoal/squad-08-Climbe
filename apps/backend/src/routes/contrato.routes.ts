import { Router } from 'express';
import { contratoController } from '../controllers/contrato.controller';
import { validate } from '../middlewares/validate';
import { contratoSchema } from '../dtos/contrato.dto';
import { requireAuth } from '../middlewares/auth';
import { requirePermission } from '../middlewares/permission';

export const contratoRouter = Router();

// Protegido por auth e permissões
contratoRouter.get('/', requireAuth, requirePermission('Contratos — Visualizar'), contratoController.list);
contratoRouter.post('/register', requireAuth, validate({ body: contratoSchema }), requirePermission('Contratos — Criar'), contratoController.register);
contratoRouter.get('/:id', requireAuth, requirePermission('Contratos — Visualizar'), contratoController.getById);
