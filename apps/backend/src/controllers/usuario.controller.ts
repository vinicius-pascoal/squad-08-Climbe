import { Request, Response } from 'express';
import { usuarioService } from '../services/usuario.service';
import { enviarResposta } from '../middlewares/auditoria';

export const usuarioController = {
  async adminCreate(req: Request, res: Response) {
    const created = await usuarioService.adminCreate(req.body);
    return enviarResposta(res, 201, { id: created.id, situacao: created.situacao, cargoId: created.cargoId });
  },
  async register(req: Request, res: Response) {
    const created = await usuarioService.register(req.body);
    return enviarResposta(res, 201, { id: created.id, situacao: created.situacao });
  },
  async aprovar(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { cargoId } = req.body as { cargoId: number };
    const updated = await usuarioService.aprovar({ id, cargoId });
    return enviarResposta(res, 200, { id: updated.id, situacao: updated.situacao, cargoId: updated.cargoId });
  },
  async list(_req: Request, res: Response) {
    const data = await usuarioService.list();
    res.json(data);
  },
  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const found = await usuarioService.findById(id);
    if (!found) return res.status(404).json({ error: 'Não encontrado' });
    res.json(found);
  },
  async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    await usuarioService.delete(id);
    res.locals.entidadeId = id;
    res.status(204).send();
  },
};
