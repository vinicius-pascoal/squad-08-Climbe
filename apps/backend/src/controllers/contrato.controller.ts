import { Request, Response } from "express";
import { contratoService } from "../services/contrato.service";
import { contratoSchema } from "../dtos/contrato.dto";
import { enviarResposta } from "../middlewares/auditoria";
import { flowService } from "../services/flow.service";
import { prisma } from "../utils/prisma";

export const contratoController = {
  // POST
  async register(req: Request, res: Response) {
    try {
      console.log('📝 Dados recebidos:', JSON.stringify(req.body, null, 2));

      const validatedData = contratoSchema.parse(req.body);
      console.log('✅ Dados validados:', JSON.stringify(validatedData, null, 2));

      let existing = null;
      try {
        existing = await contratoService.findById(validatedData.id);
      } catch (err: any) {
        if (err.message !== "Contrato não encontrado") throw err;
      }

      if (existing) {
        return res.status(400).json({
          message: `Contrato com ID ${validatedData.id} já existe`,
        });
      }

      // Buscar propostaId do flow se flowId fornecido
      let finalPropostaId = validatedData.propostaId;
      let flowId = req.body.flowId ? Number(req.body.flowId) : null;

      if (flowId) {
        try {
          const flow = await prisma.contractFlow.findUnique({
            where: { id: flowId },
            select: { propostaId: true }
          });

          if (flow?.propostaId) {
            finalPropostaId = flow.propostaId;
            console.log(`✅ PropostaId ${finalPropostaId} obtido do flow ${flowId}`);
          } else {
            console.warn(`⚠️ Flow ${flowId} não possui propostaId vinculado`);
          }
        } catch (err) {
          console.error('❌ Erro ao buscar propostaId do flow:', err);
          return res.status(500).json({
            message: "Erro ao buscar dados do fluxo",
            error: err instanceof Error ? err.message : 'Erro desconhecido'
          });
        }
      }

      const created = await contratoService.create({
        ...validatedData,
        propostaId: finalPropostaId
      });
      console.log('✅ Contrato criado:', created);

      // Se veio de um flow, vincular o contrato ao flow
      if (flowId) {
        try {
          await prisma.contractFlow.update({
            where: { id: flowId },
            data: { contratoId: created.id }
          });
          console.log(`✅ Contrato ${created.id} vinculado ao flow ${flowId}`);
        } catch (err) {
          console.error('❌ Erro ao vincular contrato ao flow:', err);
          // Não falhar a criação se o vínculo falhar
        }
      }

      return enviarResposta(res, 201, {
        success: true,
        data: created,
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        console.error('❌ Erro de validação Zod:', error.errors);
        return res.status(400).json({
          message: "Dados inválidos",
          errors: error.errors,
        });
      }

      console.error('❌ Erro ao registrar contrato:', error);
      console.error('Stack:', error.stack);
      return res.status(500).json({
        message: "Erro ao registrar contrato",
        error: error.message
      });
    }
  },

  // UPDATE
  async update(req: Request, res: Response) {
    try {
      const id: string = req.params.id;
      const validatedData = contratoSchema.partial().parse(req.body);
      const existing = await contratoService.findById(id);
      if (!existing) {
        return res.status(400).json({
          message: `Contrato com ID ${validatedData.id} não existe`,
        });
      }

      const updated = await contratoService.update(id, validatedData);
      return enviarResposta(res, 200, {
        success: true,
        data: updated,
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({
          message: "Dados inválidos",
          errors: error.errors,
        });
      }

      console.error(error);
      return res.status(500).json({ message: "Erro ao atualizar contrato" });
    }
  },

  // GET ALL
  async list(req: Request, res: Response) {
    try {
      const contratos = await contratoService.findAll();
      return res.status(200).json(contratos);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao listar contratos" });
    }
  },

  // GET
  async getById(req: Request, res: Response) {
    const id: string = req.params.id;
    const found = await contratoService.findById(id);
    if (!found) return res.status(404).json({ error: 'Não encontrado' });
    res.json(found);
  },

  // DELETE
  async remove(req: Request, res: Response) {
    const id: string = req.params.id;
    await contratoService.remove(id);
    res.locals.entidadeId = id;
    res.status(204).send();
  },

  // APROVAR
  async aprovar(req: Request, res: Response) {
    try {
      console.log('🔔 [contratoController.aprovar] Requisição recebida');
      const id: string = req.params.id;
      console.log('🔔 [contratoController.aprovar] ID do contrato:', id);
      const existing = await contratoService.findById(id);

      if (!existing) {
        return res.status(404).json({
          message: `Contrato com ID ${id} não encontrado`,
        });
      }

      const updated = await contratoService.update(id, { status: 'Aprovado' });

      // Buscar o flow associado ao contrato e avançar a etapa
      try {
        console.log(`🔍 Buscando flow para contrato ${id}...`);
        const flow = await prisma.contractFlow.findFirst({
          where: { contratoId: id },
          include: { steps: { orderBy: { id: 'asc' } } }
        });

        if (flow) {
          console.log(`📋 Flow encontrado:`, {
            flowId: flow.id,
            status: flow.status,
            steps: flow.steps.map(s => ({ id: s.id, type: s.type, status: s.status }))
          });

          // Verificar se há uma etapa CONTRATO pendente
          const contratoStep = flow.steps.find(s => s.type === 'CONTRATO' && s.status === 'PENDENTE');

          if (contratoStep) {
            console.log(`✅ Etapa CONTRATO PENDENTE encontrada (id: ${contratoStep.id}), avançando flow ${flow.id}...`);

            // Avançar a etapa do fluxo
            const result = await flowService.advance(flow.id);
            console.log(`✅ Flow ${flow.id} avançado com sucesso:`, result);
          } else {
            console.log(`⚠️ Etapa CONTRATO não está PENDENTE no flow ${flow.id}`);
            console.log(`⚠️ Status das etapas:`, flow.steps.map(s => `${s.type}: ${s.status}`).join(', '));
          }
        } else {
          console.log(`⚠️ Nenhum flow encontrado para contrato ${id}`);
        }
      } catch (flowError: any) {
        console.error('❌ Erro ao avançar flow:', flowError);
        // Não falha a aprovação se houver erro no flow
        // Mas loga o erro completo para debug
      }

      req.auditoriaData = {
        acao: 'Aprovar',
        entidade: 'Contrato',
        entidadeId: id,
        descricao: `Contrato ${id} aprovado`
      };

      return enviarResposta(res, 200, {
        success: true,
        message: 'Contrato aprovado com sucesso',
        data: updated,
      });
    } catch (error: any) {
      console.error('Erro ao aprovar contrato:', error);
      return res.status(500).json({
        message: "Erro ao aprovar contrato",
        error: error.message
      });
    }
  },

  // RECUSAR
  async recusar(req: Request, res: Response) {
    try {
      const id: string = req.params.id;
      const existing = await contratoService.findById(id);

      if (!existing) {
        return res.status(404).json({
          message: `Contrato com ID ${id} não encontrado`,
        });
      }

      const updated = await contratoService.update(id, { status: 'Rescindido' });

      req.auditoriaData = {
        acao: 'Recusar',
        entidade: 'Contrato',
        entidadeId: id,
        descricao: `Contrato ${id} recusado`
      };

      return enviarResposta(res, 200, {
        success: true,
        message: 'Contrato recusado com sucesso',
        data: updated,
      });
    } catch (error: any) {
      console.error('Erro ao recusar contrato:', error);
      return res.status(500).json({
        message: "Erro ao recusar contrato",
        error: error.message
      });
    }
  },
};
