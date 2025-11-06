import { flowRepo } from '../repositories/flow.repo';
import { usuarioRepo } from '../repositories/usuario.repo';
import { sendTemplate } from './email.service';

const STEP_LABEL: Record<string, string> = {
  REUNIAO: 'Reunião',
  PROPOSTA: 'Proposta',
  CONTRATO: 'Contrato',
  CRIACAO_EMPRESA: 'Criação da Empresa',
};

export const flowService = {
  async start(empresaId: number | null | undefined, iniciadorId: number, nome?: string, scheduledAt?: Date, participantIds?: number[]) {
    const created = await flowRepo.createFlow(empresaId, iniciadorId, nome, scheduledAt, Array.from(new Set([iniciadorId, ...(participantIds || [])])));

    // Notificar participantes da reunião inicial
    try {
      const emails: string[] = (created.participantes || [])
        .map((p: any) => p.usuario?.email)
        .filter(Boolean);
      if (emails.length) {
        await sendTemplate(emails, 'fluxo-contrato-step', {
          etapa: STEP_LABEL['REUNIAO'],
          empresa: created.empresa?.nomeFantasia || created.empresa?.razaoSocial || undefined,
          quando: created.steps[0]?.scheduledAt || null,
        });
      }
    } catch (e) {
      // log silencioso
      console.warn('[flowService.start] Falha ao enviar e-mail', e);
    }

    return created;
  },

  async advance(flowId: number, nextScheduledAt?: Date) {
    const createdOrDone = await flowRepo.advance(flowId, nextScheduledAt);
    // Buscar participantes para notificar
    try {
      const flow = await flowRepo.findById(flowId);
      if (flow && (createdOrDone as any)?.id) {
        const step = createdOrDone as any;
        const emails: string[] = (flow.participantes || []).map((p: any) => p.usuario?.email).filter(Boolean);
        if (emails.length) {
          await sendTemplate(emails, 'fluxo-contrato-step', {
            etapa: STEP_LABEL[step.type] || step.type,
            empresa: flow.empresa?.nomeFantasia || flow.empresa?.razaoSocial,
            quando: step.scheduledAt || null,
          });
        }
      }
    } catch (e) {
      console.warn('[flowService.advance] Falha ao enviar e-mail', e);
    }
    return createdOrDone;
  },

  async scheduleStep(stepId: number, when: Date) {
    return flowRepo.scheduleStep(stepId, when);
  },

  async linkProposta(flowId: number, propostaId: number) {
    return flowRepo.linkProposta(flowId, propostaId);
  },

  async linkContrato(flowId: number, contratoId: string) {
    return flowRepo.linkContrato(flowId, contratoId);
  },

  async updateEmpresa(flowId: number, empresaId: number) {
    return flowRepo.updateEmpresa(flowId, empresaId);
  },
};
