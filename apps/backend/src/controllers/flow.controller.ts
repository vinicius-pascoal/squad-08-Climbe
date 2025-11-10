import { Request, Response } from 'express';
import { flowService } from '../services/flow.service';
import { extractGoogleAccessToken } from './../routes/event.router';
import { flowRepo } from '../repositories/flow.repo';
import { enviarResposta } from '../middlewares/auditoria';

export const flowController = {
  async start(req: Request, res: Response) {
    const userId = (req as any).userId as number | undefined;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { nome, empresaId, participantIds, scheduledAt, reuniao } = req.body || {};
    const when = scheduledAt ? new Date(scheduledAt) : undefined;
    const googleToken = extractGoogleAccessToken(req);
    const created = await flowService.start(
      typeof empresaId === 'number' ? empresaId : null,
      userId,
      nome,
      when,
      participantIds,
      reuniao,
      googleToken
    );
    return enviarResposta(res, 201, created);
  },

  async advance(req: Request, res: Response) {
    const id = Number(req.params.id);
    const when = req.body?.scheduledAt ? new Date(req.body.scheduledAt) : undefined;
    const result = await flowService.advance(id, when);
    return enviarResposta(res, 200, result);
  },

  async scheduleStep(req: Request, res: Response) {
    const stepId = Number(req.params.stepId);
    const when = new Date(req.body.scheduledAt);
    const upd = await flowService.scheduleStep(stepId, when);
    return enviarResposta(res, 200, upd);
  },

  async linkProposta(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { propostaId } = req.body || {};
    const upd = await flowService.linkProposta(id, Number(propostaId));
    return enviarResposta(res, 200, upd);
  },

  async linkContrato(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { contratoId } = req.body || {};
    const upd = await flowService.linkContrato(id, String(contratoId));
    return enviarResposta(res, 200, upd);
  },

  async updateFlow(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { empresaId } = req.body || {};
    if (empresaId) {
      const upd = await flowService.updateEmpresa(id, Number(empresaId));
      return enviarResposta(res, 200, upd);
    }
    return res.status(400).json({ error: 'empresaId é obrigatório' });
  },

  async list(req: Request, res: Response) {
    const mine = req.query.mine === 'true';
    if (mine) {
      const userId = (req as any).userId as number | undefined;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });
      const list = await flowRepo.listByUser(userId);
      return res.status(200).json(list);
    }
    // fallback simples: bloquear listagem geral por enquanto
    return res.status(403).json({ error: 'Operação não suportada' });
  },

  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const found = await flowRepo.findById(id);
    if (!found) return res.status(404).json({ error: 'Fluxo não encontrado' });
    return res.status(200).json(found);
  },
};
