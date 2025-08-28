import { Request, Response } from 'express';
import { usuarioService } from '../services/usuario.service';

export const usuarioController = {
<<<<<<< Updated upstream
  async list(_req: Request, res: Response) {
    const data = await usuarioService.list();
    res.json(data);
  },

=======
>>>>>>> Stashed changes
  async register(req: Request, res: Response) {
    const created = await usuarioService.register(req.body);
    res.status(201).json({ id: created.id, situacao: created.situacao });
  },
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
  async aprovar(req: Request, res: Response) {
    const id = Number(req.params.id);
    const updated = await usuarioService.aprovar(id);
    res.json({ id: updated.id, situacao: updated.situacao });
  },
<<<<<<< Updated upstream

=======
  async list(_req: Request, res: Response) {
    const data = await usuarioService.list();
    res.json(data);
  },
>>>>>>> Stashed changes
  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const found = await usuarioService.findById(id);
    if (!found) return res.status(404).json({ error: 'Não encontrado' });
    res.json(found);
  },
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
  async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    await usuarioService.delete(id);
    res.status(204).send();
  },
};
