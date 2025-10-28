import { Request, Response } from 'express';
import { propostaService } from '../services/proposta.service';

export const propostaController = {
  async create(req: Request, res: Response) {
    try {
      const usuarioId = (req as any).userId;
      if (!usuarioId) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
      }

      const proposta = await propostaService.createProposta(req.body, usuarioId);
      return res.status(201).json(proposta);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const propostas = await propostaService.getAllPropostas();
      return res.status(200).json(propostas);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const proposta = await propostaService.getPropostaById(id);
      return res.status(200).json(proposta);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const proposta = await propostaService.updateProposta(id, req.body);
      return res.status(200).json(proposta);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await propostaService.deleteProposta(id);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },

  async getByEmpresa(req: Request, res: Response) {
    try {
      const empresaId = parseInt(req.params.empresaId);
      const propostas = await propostaService.getPropostasByEmpresa(empresaId);
      return res.status(200).json(propostas);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  async getByUsuario(req: Request, res: Response) {
    try {
      const usuarioId = parseInt(req.params.usuarioId);
      const propostas = await propostaService.getPropostasByUsuario(usuarioId);
      return res.status(200).json(propostas);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  async getHistorico(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const historico = await propostaService.getHistorico(id);
      return res.status(200).json(historico);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  },
};
