import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import { requirePermission } from '../middlewares/permission';
import { validate } from '../middlewares/validate';
import { registrarAuditoria } from '../middlewares/auditoria';
import { flowController } from '../controllers/flow.controller';
import { advanceFlowBodySchema, advanceFlowParamsSchema, linkContratoBodySchema, linkContratoParamsSchema, linkPropostaBodySchema, linkPropostaParamsSchema, scheduleStepBodySchema, scheduleStepParamsSchema, startFlowBodySchema } from '../dtos/flow.dto';

export const flowRouter = Router();

flowRouter.use(requireAuth);

// Iniciar fluxo
flowRouter.post(
  '/',
  validate({ body: startFlowBodySchema }),
  requirePermission('Fluxos — Iniciar'),
  registrarAuditoria('ContractFlow', 'Iniciar'),
  flowController.start
);

// Avançar etapa
flowRouter.patch(
  '/:id/advance',
  validate({ params: advanceFlowParamsSchema, body: advanceFlowBodySchema.partial() }),
  registrarAuditoria('ContractFlow', 'Avançar'),
  flowController.advance
);

// Agendar etapa específica
flowRouter.post(
  '/:id/steps/:stepId/schedule',
  validate({ params: scheduleStepParamsSchema, body: scheduleStepBodySchema }),
  registrarAuditoria('ContractFlow', 'Agendar Etapa'),
  flowController.scheduleStep
);

// Vincular proposta
flowRouter.post(
  '/:id/link-proposta',
  validate({ params: linkPropostaParamsSchema, body: linkPropostaBodySchema }),
  registrarAuditoria('ContractFlow', 'Vincular Proposta'),
  flowController.linkProposta
);

// Vincular contrato
flowRouter.post(
  '/:id/link-contrato',
  validate({ params: linkContratoParamsSchema, body: linkContratoBodySchema }),
  registrarAuditoria('ContractFlow', 'Vincular Contrato'),
  flowController.linkContrato
);

// Listar meus fluxos
flowRouter.get('/', flowController.list);

// Atualizar fluxo (ex: empresaId)
flowRouter.patch('/:id', registrarAuditoria('ContractFlow', 'Atualizar'), flowController.updateFlow);

// Detalhe
flowRouter.get('/:id', flowController.getById);

export default flowRouter;
