import { flowRepo } from '../repositories/flow.repo';
import { usuarioRepo } from '../repositories/usuario.repo';
import { sendTemplate } from './email.service';
import { createGoogleEvent } from './google.service';
import { createFolder, addPermissionToFolder } from '../middlewares/drive';
import { OAuth2Client } from 'google-auth-library';

const STEP_LABEL: Record<string, string> = {
  REUNIAO: 'Reunião',
  PROPOSTA: 'Proposta',
  CONTRATO: 'Contrato',
  CRIACAO_EMPRESA: 'Criação da Empresa',
};

export const flowService = {
  async start(
    empresaId: number | null | undefined,
    iniciadorId: number,
    nome?: string,
    scheduledAt?: Date,
    participantIds?: number[],
    reuniaoData?: { titulo?: string; presencial?: boolean; local?: string; pauta?: string }
    ,
    googleAccessToken?: string | null
  ) {
    const created = await flowRepo.createFlow(
      empresaId,
      iniciadorId,
      nome,
      scheduledAt,
      Array.from(new Set([iniciadorId, ...(participantIds || [])])),
      reuniaoData
    );

    // Notificar participantes da reunião inicial (e criar evento no Google Calendar se houver token)
    try {
      // coletar emails dos participantes (busca por id)
      const participantUserIds: number[] = (created.participantes || []).map((p: any) => p.usuarioId).filter(Boolean);
      const users = await Promise.all(participantUserIds.map((id) => usuarioRepo.findById(id)));
      const emails: string[] = users.map((u: any) => u?.email).filter(Boolean as any) as string[];
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

    // Se o request forneceu um token Google e há uma reunião agendada, criar evento no Google Calendar
    try {
      if (googleAccessToken && created.steps && created.steps[0] && created.steps[0].scheduledAt) {
        // attendees: participant emails
        const participantUserIds: number[] = (created.participantes || []).map((p: any) => p.usuarioId).filter(Boolean);
        const users = await Promise.all(participantUserIds.map((id) => usuarioRepo.findById(id)));
        const emails: string[] = users.map((u: any) => u?.email).filter(Boolean as any) as string[];
        if (emails.length) {
          const startIso = new Date(created.steps[0].scheduledAt).toISOString();
          const endIso = new Date(new Date(startIso).getTime() + 60 * 60 * 1000).toISOString();
          const event = await createGoogleEvent(googleAccessToken, {
            summary: reuniaoData?.titulo || nome || 'Reunião - Fluxo',
            description: reuniaoData?.pauta || '',
            location: reuniaoData?.local || undefined,
            start: { dateTime: startIso },
            end: { dateTime: endIso },
            attendees: emails.map((e) => ({ email: e })),
            isRemote: !(reuniaoData?.presencial ?? true),
            sendUpdates: 'all',
          });
          // não armazenamos o id do evento por enquanto, apenas logamos
          console.log('[flowService.start] Google event created:', event?.id);
        }
      }
    } catch (err) {
      console.warn('[flowService.start] Falha ao criar evento no Google Calendar', err);
    }

    return created;
  },

  async advance(flowId: number, nextScheduledAt?: Date, googleAccessToken?: string | null) {
    const createdOrDone = await flowRepo.advance(flowId, nextScheduledAt);

    // Verificar se o fluxo foi concluído
    const isDone = (createdOrDone as any)?.done === true;

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

      // Se o fluxo foi concluído, criar pasta no Google Drive
      if (isDone && flow && googleAccessToken) {
        try {
          const auth = new OAuth2Client();
          auth.setCredentials({ access_token: googleAccessToken });

          // Nome da pasta baseado na empresa e ID do fluxo
          const empresaNome = flow.empresa?.nomeFantasia || flow.empresa?.razaoSocial || 'Empresa';
          const folderName = `${empresaNome} - Fluxo #${flowId}`;

          // Criar a pasta no Google Drive
          const folderId = await createFolder(auth, folderName);

          if (folderId) {
            // Adicionar permissões para todos os participantes
            const participantEmails: string[] = (flow.participantes || [])
              .map((p: any) => p.usuario?.email)
              .filter(Boolean);

            for (const email of participantEmails) {
              try {
                await addPermissionToFolder(auth, folderId, email, 'writer');
              } catch (err) {
                console.warn(`[flowService.advance] Erro ao adicionar permissão para ${email}:`, err);
              }
            }

            // Salvar o ID da pasta no fluxo
            await flowRepo.updateDriveFolderId(flowId, folderId);
            console.log(`[flowService.advance] Pasta do Drive criada com sucesso: ${folderId}`);
          }
        } catch (err) {
          console.error('[flowService.advance] Erro ao criar pasta no Drive:', err);
          // Não falhar o fluxo se a criação da pasta falhar
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

  async cancel(flowId: number) {
    try {
      console.log('[flowService.cancel] Iniciando cancelamento do fluxo:', flowId);

      const flow = await flowRepo.findById(flowId);
      if (!flow) {
        console.error('[flowService.cancel] Fluxo não encontrado:', flowId);
        throw new Error('Fluxo não encontrado');
      }

      console.log('[flowService.cancel] Fluxo encontrado, status atual:', flow.status);

      if (flow.status === 'CANCELADO') {
        throw new Error('Fluxo já está cancelado');
      }

      if (flow.status === 'CONCLUIDO') {
        throw new Error('Não é possível cancelar um fluxo concluído');
      }

      console.log('[flowService.cancel] Chamando flowRepo.cancelFlow...');
      const result = await flowRepo.cancelFlow(flowId);
      console.log('[flowService.cancel] Fluxo cancelado com sucesso');

      // Notificar participantes sobre o cancelamento
      try {
        const emails: string[] = (flow.participantes || []).map((p: any) => p.usuario?.email).filter(Boolean);
        if (emails.length) {
          await sendTemplate(emails, 'fluxo-contrato-step', {
            etapa: 'Cancelado',
            empresa: flow.empresa?.nomeFantasia || flow.empresa?.razaoSocial,
            quando: null,
          });
        }
      } catch (e) {
        console.warn('[flowService.cancel] Falha ao enviar e-mail', e);
      }

      return result;
    } catch (error: any) {
      console.error('[flowService.cancel] Erro ao cancelar fluxo:', error);
      throw error;
    }
  },
};
