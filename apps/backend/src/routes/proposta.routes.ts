import { Router } from 'express';
import { propostaController } from '../controllers/proposta.controller';
import { validate } from '../middlewares/validate';
import { createPropostaSchema, updatePropostaSchema, propostaIdSchema } from '../dtos/proposta.dto';
import { requireAuth } from '../middlewares/auth';
import { requirePermission } from '../middlewares/permission';
import { registrarAuditoria, capturarDadosOriginais } from '../middlewares/auditoria';
import { propostaRepo } from '../repositories/proposta.repo';

const router = Router();

// Todas as rotas requerem autenticação
router.use(requireAuth);

// Criar nova proposta
router.post(
  '/',
  validate({ body: createPropostaSchema }),
  requirePermission('Propostas Comerciais — Criar'),
  registrarAuditoria('Proposta', 'Criar'),
  propostaController.create
);

// Listar todas as propostas
router.get('/', propostaController.getAll);

// Buscar propostas por empresa (deve vir antes de /:id)
router.get(
  '/empresa/:empresaId',
  propostaController.getByEmpresa
);

// Buscar propostas por usuário
router.get(
  '/usuario/:usuarioId',
  propostaController.getByUsuario
);

// Buscar histórico de uma proposta
router.get(
  '/:id/historico',
  validate({ params: propostaIdSchema }),
  propostaController.getHistorico
);

// Buscar proposta por ID
router.get(
  '/:id',
  validate({ params: propostaIdSchema }),
  propostaController.getById
);

// Atualizar proposta
router.put(
  '/:id',
  validate({ params: propostaIdSchema, body: updatePropostaSchema }),
  requirePermission('Propostas Comerciais — Validar'),
  capturarDadosOriginais(async (req) => {
    const id = parseInt(req.params.id);
    return await propostaRepo.findById(id);
  }),
  registrarAuditoria('Proposta', 'Atualizar'),
  propostaController.update
);

// Deletar proposta
router.delete(
  '/:id',
  validate({ params: propostaIdSchema }),
  requirePermission('Propostas Comerciais — Validar'),
  capturarDadosOriginais(async (req) => {
    const id = parseInt(req.params.id);
    return await propostaRepo.findById(id);
  }),
  registrarAuditoria('Proposta', 'Deletar'),
  propostaController.delete
);

export default router;
