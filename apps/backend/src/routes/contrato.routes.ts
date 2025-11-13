import { Router } from 'express';
import { contratoController } from '../controllers/contrato.controller';
import { validate } from '../middlewares/validate';
import { contratoSchema } from '../dtos/contrato.dto';
import { requireAuth } from '../middlewares/auth';
import { requirePermission } from '../middlewares/permission';
import { registrarAuditoria, capturarDadosOriginais } from '../middlewares/auditoria';
import { contratoService } from '../services/contrato.service';

export const contratoRouter = Router();

// Protegido por auth e permissões
contratoRouter.get('/', requireAuth, requirePermission('Contratos — Visualizar'), contratoController.list);

contratoRouter.post(
  '/register',
  requireAuth,
  validate({ body: contratoSchema }),
  requirePermission('Contratos — Criar'),
  registrarAuditoria('Contrato', 'Criar'),
  contratoController.register
);

contratoRouter.get('/:id', requireAuth, requirePermission('Contratos — Visualizar'), contratoController.getById);

contratoRouter.put(
  '/:id',
  requireAuth,
  validate({ body: contratoSchema.partial() }),
  requirePermission('Contratos — Atualizar'),
  capturarDadosOriginais(async (req) => {
    return await contratoService.findById(req.params.id);
  }),
  registrarAuditoria('Contrato', 'Atualizar'),
  contratoController.update
);

contratoRouter.delete(
  '/:id',
  requireAuth,
  requirePermission('Contratos — Deletar'),
  capturarDadosOriginais(async (req) => {
    return await contratoService.findById(req.params.id);
  }),
  registrarAuditoria('Contrato', 'Deletar'),
  contratoController.remove
);
