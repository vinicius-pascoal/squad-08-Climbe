import { prisma } from '../utils/prisma';

export const flowRepo = {
  async createFlow(
    empresaId: number | null | undefined,
    iniciadorId: number,
    nome?: string,
    scheduledAt?: Date,
    participants?: number[],
    reuniaoData?: { titulo?: string; presencial?: boolean; local?: string; pauta?: string }
  ) {
    return prisma.$transaction(async (tx: any) => {
      // 1. Criar ou obter empresa temporária se não existir
      let finalEmpresaId = empresaId;
      if (!finalEmpresaId && reuniaoData) {
        // Se não tiver empresa, criar uma temporária para a reunião
        const tempEmpresa = await tx.empresa.create({
          data: {
            razaoSocial: 'Empresa Temporária - ' + (nome || 'Fluxo'),
            cnpj: '00000000000000', // CNPJ temporário
            nomeFantasia: nome || 'Empresa em Cadastro',
          },
        });
        finalEmpresaId = tempEmpresa.id;
      }

      // 2. Criar o fluxo com TODAS as etapas
      const flow = await tx.contractFlow.create({
        data: {
          nome: nome ?? null,
          empresaId: finalEmpresaId ?? null,
          iniciadorId,
          status: 'ATIVO',
          steps: {
            create: [
              { type: 'REUNIAO', status: 'PENDENTE', scheduledAt: scheduledAt ?? null } as any,
              { type: 'PROPOSTA', status: 'NAO_INICIADO', scheduledAt: null } as any,
              { type: 'CONTRATO', status: 'NAO_INICIADO', scheduledAt: null } as any,
              { type: 'CRIACAO_EMPRESA', status: 'NAO_INICIADO', scheduledAt: null } as any,
            ],
          },
          participantes: participants?.length
            ? { createMany: { data: participants.map((usuarioId) => ({ usuarioId })) } }
            : undefined,
        },
        include: { steps: true, participantes: true, empresa: true },
      });

      // 3. Criar a reunião se houver dados e empresaId
      if (finalEmpresaId && scheduledAt && reuniaoData) {
        const dataReuniao = new Date(scheduledAt);
        const horaReuniao = new Date(scheduledAt);

        const reuniao = await tx.reuniao.create({
          data: {
            titulo: reuniaoData.titulo || nome || 'Reunião inicial',
            empresaId: finalEmpresaId,
            data: dataReuniao,
            hora: horaReuniao,
            presencial: reuniaoData.presencial ?? true,
            local: reuniaoData.local ?? null,
            pauta: reuniaoData.pauta ?? null,
            status: 'AGENDADA',
          },
        });

        // 4. Adicionar participantes à reunião
        // O modelo `ParticipanteReuniao` possui apenas `reuniaoId` e `usuarioId`.
        // Não existe campo `status` na tabela, então apenas inserimos os pares.
        if (participants?.length) {
          await tx.participanteReuniao.createMany({
            data: participants.map((usuarioId) => ({
              reuniaoId: reuniao.id,
              usuarioId,
            })),
            skipDuplicates: true,
          });
        }
      }

      return flow;
    }, {
      maxWait: 10000, // Espera até 10s para iniciar a transação
      timeout: 15000, // Timeout de 15s para completar a transação
    });
  },

  async findById(id: number) {
    return prisma.contractFlow.findUnique({
      where: { id },
      include: { steps: true, participantes: { include: { usuario: true } }, empresa: true, Contrato: true, Proposta: true },
    });
  },

  async listByUser(userId: number) {
    return prisma.contractFlow.findMany({
      where: { participantes: { some: { usuarioId: userId } } },
      include: { steps: true, empresa: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  async addParticipant(flowId: number, userId: number, role?: string) {
    return prisma.flowParticipant.create({ data: { flowId, usuarioId: userId, role: role || null } });
  },

  async scheduleStep(stepId: number, scheduledAt: Date) {
    return prisma.contractFlowStep.update({ where: { id: stepId }, data: { scheduledAt } });
  },

  async currentStep(flowId: number) {
    const steps = await prisma.contractFlowStep.findMany({ where: { flowId }, orderBy: { id: 'asc' } });
    return steps.find((s: any) => s.status !== 'CONCLUIDO' && s.status !== 'CANCELADO') || steps[steps.length - 1];
  },

  async advance(flowId: number, nextScheduledAt?: Date) {
    console.log(`🔄 [flowRepo.advance] Iniciando avanço do flow ${flowId}`);
    const flow = await prisma.contractFlow.findUnique({ where: { id: flowId }, include: { steps: true } });
    if (!flow) {
      console.error(`❌ [flowRepo.advance] Fluxo ${flowId} não encontrado`);
      throw new Error('Fluxo não encontrado');
    }

    console.log(`📋 [flowRepo.advance] Flow ${flowId} encontrado, status: ${flow.status}`);
    const ordered: any[] = ['REUNIAO', 'PROPOSTA', 'CONTRATO', 'CRIACAO_EMPRESA'];
    const steps = flow.steps.sort((a: any, b: any) => ordered.indexOf(a.type) - ordered.indexOf(b.type));
    console.log(`📋 [flowRepo.advance] Steps ordenadas:`, steps.map(s => ({ type: s.type, status: s.status })));

    const current = steps.find((s: any) => s.status === 'PENDENTE');
    console.log(`📋 [flowRepo.advance] Etapa PENDENTE atual:`, current ? { type: current.type, id: current.id } : 'Nenhuma');

    return prisma.$transaction(async (tx: any) => {
      if (!current) {
        console.error(`❌ [flowRepo.advance] Nenhuma etapa pendente encontrada no flow ${flowId}`);
        throw new Error('Nenhuma etapa pendente encontrada');
      }

      console.log(`✅ [flowRepo.advance] Marcando etapa ${current.type} como CONCLUIDO`);
      // Marcar etapa atual como concluída
      await tx.contractFlowStep.update({
        where: { id: current.id },
        data: { status: 'CONCLUIDO', completedAt: new Date() }
      });

      // Encontrar próxima etapa
      const curIdx = ordered.indexOf(current.type as any);
      console.log(`📋 [flowRepo.advance] Índice da etapa atual (${current.type}): ${curIdx}`);

      if (curIdx >= 0 && curIdx < ordered.length - 1) {
        const nextType = ordered[curIdx + 1];
        console.log(`📋 [flowRepo.advance] Próxima etapa será: ${nextType}`);

        // Encontrar a etapa NAO_INICIADO e ativar
        const nextStep = steps.find((s: any) => s.type === nextType);
        if (nextStep) {
          console.log(`✅ [flowRepo.advance] Ativando etapa ${nextType} (id: ${nextStep.id})`);
          const updated = await tx.contractFlowStep.update({
            where: { id: nextStep.id },
            data: { status: 'PENDENTE', scheduledAt: nextScheduledAt ?? null },
          });
          console.log(`✅ [flowRepo.advance] Etapa ${nextType} ativada com sucesso`);
          return updated;
        } else {
          console.warn(`⚠️ [flowRepo.advance] Próxima etapa ${nextType} não encontrada`);
        }
      } else {
        console.log(`🏁 [flowRepo.advance] Última etapa concluída, marcando flow como CONCLUIDO`);
        // Última etapa concluída - marcar fluxo como concluído
        await tx.contractFlow.update({ where: { id: flowId }, data: { status: 'CONCLUIDO' } });
        return { done: true };
      }

      return { done: true };
    }, {
      maxWait: 10000,
      timeout: 15000,
    });
  },

  async linkProposta(flowId: number, propostaId: number) {
    return prisma.contractFlow.update({ where: { id: flowId }, data: { propostaId } });
  },

  async linkContrato(flowId: number, contratoId: string) {
    return prisma.contractFlow.update({ where: { id: flowId }, data: { contratoId } });
  },

  async updateEmpresa(flowId: number, empresaId: number) {
    return prisma.contractFlow.update({ where: { id: flowId }, data: { empresaId } });
  },

  async updateDriveFolderId(flowId: number, driveFolderId: string) {
    return prisma.contractFlow.update({ where: { id: flowId }, data: { driveFolderId } });
  },

  async cancelFlow(flowId: number) {
    try {
      return await prisma.$transaction(async (tx: any) => {
        // Verificar se o fluxo existe
        const existingFlow = await tx.contractFlow.findUnique({
          where: { id: flowId },
          include: { steps: true },
        });

        if (!existingFlow) {
          throw new Error(`Fluxo com ID ${flowId} não encontrado`);
        }

        // Atualizar o status do fluxo para CANCELADO
        const flow = await tx.contractFlow.update({
          where: { id: flowId },
          data: { status: 'CANCELADO' },
          include: { steps: true },
        });

        // Cancelar todas as etapas pendentes ou não iniciadas
        const pendingSteps = flow.steps.filter((s: any) => s.status === 'PENDENTE' || s.status === 'NAO_INICIADO');
        for (const step of pendingSteps) {
          await tx.contractFlowStep.update({
            where: { id: step.id },
            data: { status: 'CANCELADO' },
          });
        }

        return flow;
      }, {
        maxWait: 10000,
        timeout: 15000,
      });
    } catch (error: any) {
      console.error('[flowRepo.cancelFlow] Erro ao cancelar fluxo:', error);
      throw error;
    }
  },
};
