import { Request, Response } from 'express';
import { tarefaService } from '../services/tarefa.service';

export const tarefaController = {
  async create(req: Request, res: Response) {
    // allow propostaId in body (may come as string), coerce to number if present
    const input = { ...req.body } as any
    if (input.propostaId) input.propostaId = Number(input.propostaId)
    const tarefa = await tarefaService.create(input);
    res.status(201).json(tarefa);
  },

  async findAll(_req: Request, res: Response) {
    const propostaIdRaw = (_req.query && _req.query.propostaId) || undefined
    const propostaId = propostaIdRaw ? Number(propostaIdRaw) : undefined
    const tarefas = await tarefaService.findAll(propostaId);
    res.status(200).json(tarefas);
  },

  async findById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const tarefa = await tarefaService.findById(id);
    if (!tarefa) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    res.status(200).json(tarefa);
  },

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const exists = await tarefaService.findById(id);
    if (!exists) {
      return res.status(404).json({ error: 'Tarefa não encontrada para atualizar' });
    }
    const tarefa = await tarefaService.update(id, req.body);
    res.status(200).json(tarefa);
  },

  async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    const exists = await tarefaService.findById(id);
    if (!exists) {
      return res.status(404).json({ error: 'Tarefa não encontrada para remover' });
    }
    await tarefaService.remove(id);
    res.status(204).send();
  },
};
