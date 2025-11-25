import { Router } from 'express';
import { usuarioController } from '../controllers/usuario.controller';
import { validate } from '../middlewares/validate';
import { registerSchema, aprovarSchema, aprovarBodySchema, adminCreateSchema, updateUsuarioParamsSchema, updateUsuarioBodySchema } from '../dtos/usuario.dto';
import { requireAuth } from '../middlewares/auth';
import { requirePermission } from '../middlewares/permission';
import { registrarAuditoria, capturarDadosOriginais } from '../middlewares/auditoria';
import { usuarioRepo } from '../repositories/usuario.repo';

export const usuarioRouter = Router();

usuarioRouter.post(
  '/register',
  validate({ body: registerSchema }),
  registrarAuditoria('Usuario', 'Registro'),
  usuarioController.register
);

usuarioRouter.post(
  '/admin',
  requireAuth,
  validate({ body: adminCreateSchema }),
  requirePermission('Usuários — Criar'),
  registrarAuditoria('Usuario', 'Criar Admin'),
  usuarioController.adminCreate
);

usuarioRouter.patch(
  '/:id/aprovar',
  requireAuth,
  validate({ params: aprovarSchema, body: aprovarBodySchema }),
  requirePermission('Usuários — Aceitar/Aprovar'),
  capturarDadosOriginais(async (req) => {
    const id = parseInt(req.params.id);
    return await usuarioRepo.findById(id);
  }),
  registrarAuditoria('Usuario', 'Aprovar'),
  usuarioController.aprovar
);

usuarioRouter.get('/', requireAuth, usuarioController.list);
usuarioRouter.get('/:id', requireAuth, usuarioController.getById);

usuarioRouter.patch(
  '/:id',
  requireAuth,
  validate({ params: updateUsuarioParamsSchema, body: updateUsuarioBodySchema }),
  requirePermission('Usuários — Editar'),
  capturarDadosOriginais(async (req) => {
    const id = parseInt(req.params.id);
    return await usuarioRepo.findById(id);
  }),
  registrarAuditoria('Usuario', 'Editar'),
  usuarioController.update
);

usuarioRouter.delete(
  '/:id',
  requireAuth,
  requirePermission('Usuários — Excluir'),
  capturarDadosOriginais(async (req) => {
    const id = parseInt(req.params.id);
    return await usuarioRepo.findById(id);
  }),
  registrarAuditoria('Usuario', 'Deletar'),
  usuarioController.remove
);
