import { Request, Response } from 'express';
import { propostaService } from '../services/proposta.service';
import { enviarResposta } from '../middlewares/auditoria';
import { flowService } from '../services/flow.service';
import { prisma } from '../utils/prisma';

export const propostaController = {
  async create(req: Request, res: Response) {
    try {
      const usuarioId = (req as any).userId;
      if (!usuarioId) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
      }

      const proposta = await propostaService.createProposta(req.body, usuarioId);
      return enviarResposta(res, 201, proposta);
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

      // Se a proposta foi aprovada, avançar o fluxo
      if (req.body.status === 'APROVADA') {
        try {
          console.log(`🔍 Proposta ${id} aprovada, buscando flow associado...`);
          const flow = await prisma.contractFlow.findFirst({
            where: { propostaId: id },
            include: { steps: { orderBy: { id: 'asc' } } }
          });

          if (flow) {
            console.log(`📋 Flow encontrado para proposta ${id}:`, flow.id);
            console.log(`📋 Status do flow:`, flow.status);
            console.log(`📋 Steps do flow:`, JSON.stringify(flow.steps.map(s => ({ id: s.id, type: s.type, status: s.status })), null, 2));

            // Verificar se há uma etapa PROPOSTA pendente
            const propostaStep = flow.steps.find(s => s.type === 'PROPOSTA' && s.status === 'PENDENTE');

            if (propostaStep) {
              console.log(`📋 Etapa PROPOSTA PENDENTE encontrada, avançando flow ${flow.id}...`);
              try {
                const result = await flowService.advance(flow.id);
                console.log(`✅ Etapa do flow ${flow.id} avançada com sucesso para CONTRATO:`, JSON.stringify(result, null, 2));
              } catch (advanceError: any) {
                console.error(`❌ Erro ao chamar flowService.advance:`, advanceError.message);
                console.error('Stack:', advanceError.stack);
              }
            } else {
              const allSteps = flow.steps.map(s => ({ type: s.type, status: s.status }));
              console.log(`⚠️ Etapa PROPOSTA não está PENDENTE no flow ${flow.id}`);
              console.log(`⚠️ Status de todas as etapas:`, JSON.stringify(allSteps, null, 2));
            }
          } else {
            console.log(`⚠️ Nenhum flow encontrado para proposta ${id}`);
          }
        } catch (flowError: any) {
          console.error('❌ Erro ao avançar flow após aprovação de proposta:', flowError.message);
          console.error('Stack:', flowError.stack);
          // Não falha a aprovação se houver erro no flow
        }
      }

      return enviarResposta(res, 200, proposta);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await propostaService.deleteProposta(id);
      res.locals.entidadeId = id;
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
