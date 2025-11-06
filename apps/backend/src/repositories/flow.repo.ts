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

      // 2. Criar o fluxo
      const flow = await tx.contractFlow.create({
        data: {
          nome: nome ?? null,
          empresaId: finalEmpresaId ?? null,
          iniciadorId,
          status: 'ATIVO',
          steps: {
            create: [{ type: 'REUNIAO', status: 'PENDENTE', scheduledAt: scheduledAt ?? null } as any],
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
        if (participants?.length) {
          await tx.participanteReuniao.createMany({
            data: participants.map((usuarioId) => ({
              reuniaoId: reuniao.id,
              usuarioId,
              status: 'CONFIRMADO',
            })),
          });
        }
      }

      return flow;
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
    const flow = await prisma.contractFlow.findUnique({ where: { id: flowId }, include: { steps: true } });
    if (!flow) throw new Error('Fluxo não encontrado');

    const ordered: any[] = ['REUNIAO', 'PROPOSTA', 'CONTRATO', 'CRIACAO_EMPRESA'];
    const steps = flow.steps.sort((a: any, b: any) => ordered.indexOf(a.type) - ordered.indexOf(b.type));
    const current = steps.find((s: any) => s.status !== 'CONCLUIDO' && s.status !== 'CANCELADO');

    return prisma.$transaction(async (tx: any) => {
      let nextType: any | null = null;
      if (current) {
        await tx.contractFlowStep.update({ where: { id: current.id }, data: { status: 'CONCLUIDO', completedAt: new Date() } });
        const curIdx = ordered.indexOf(current.type as any);
        if (curIdx >= 0 && curIdx < ordered.length - 1) {
          nextType = ordered[curIdx + 1];
        }
      } else {
        nextType = 'REUNIAO';
      }

      if (!nextType) {
        await tx.contractFlow.update({ where: { id: flowId }, data: { status: 'CONCLUIDO' } });
        return { done: true };
      }

      const created = await tx.contractFlowStep.create({
        data: { flowId, type: nextType, status: 'PENDENTE', scheduledAt: nextScheduledAt ?? null } as any,
      });
      return created;
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
};
