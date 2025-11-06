import { Request, Response } from 'express';
import { empresaService } from '../services/empresa.service';
import { enviarResposta } from '../middlewares/auditoria';

// Funções que lidam diretamente com as requisições e respostas HTTP.
export const empresaController = {
  async create(req: Request, res: Response) {
    try {
      const empresa = await empresaService.create(req.body);
      return enviarResposta(res, 201, empresa);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Erro ao criar empresa' });
    }
  },

  async findAll(_req: Request, res: Response) {
    const empresas = await empresaService.findAll();
    res.status(200).json(empresas);
  },

  async findById(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    const empresa = await empresaService.findById(id);
    if (!empresa) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }
    res.status(200).json(empresa);
  },

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    try {
      const exists = await empresaService.findById(id);
      if (!exists) {
        return res.status(404).json({ error: 'Empresa não encontrada para atualizar' });
      }
      const empresa = await empresaService.update(id, req.body);
      return enviarResposta(res, 200, empresa);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Erro ao atualizar empresa' });
    }
  },

  async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    try {
      const exists = await empresaService.findById(id);
      if (!exists) {
        return res.status(404).json({ error: 'Empresa não encontrada para remover' });
      }
      await empresaService.remove(id);
      res.locals.entidadeId = id;
      res.status(204).send(); // Sucesso sem conteúdo
    } catch (error: any) {
      // Captura erros de restrição de chave estrangeira, por exemplo
      console.error("Erro ao remover empresa:", error);
      res.status(500).json({ error: 'Erro interno ao remover empresa. Verifique dependências.' });
    }
  },
};
