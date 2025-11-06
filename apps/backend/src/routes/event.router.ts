import { Router } from 'express';
import { createGoogleEvent, getGoogleEvents } from '../services/google.service';
import { requireAuth } from '../middlewares/auth';
import { prisma } from '../utils/prisma';
import { usuarioRepo } from '../repositories/usuario.repo';

const eventRouter = Router();

// All routes require auth (supports our JWT or Google ID token)
eventRouter.use(requireAuth);

/**
 * Helper to extract a Google access token from body, header or query.
 */
export function extractGoogleAccessToken(req: any): string | null {
  const b = req.body || {};
  return (
    b.googleAccessToken ||
    req.headers['x-google-access-token'] ||
    (typeof req.query.googleAccessToken === 'string' ? req.query.googleAccessToken : null) ||
    null
  ) as string | null;
}

/**
 * POST /api/events/create
 * Body:
 *  - summary (string, required)
 *  - description? (string)
 *  - location? (string)
 *  - start (ISO string) / end (ISO string) or start/end objects
 *  - attendees? (string[] emails)
 *  - isRemote? (boolean) -> create Google Meet link
 *  - recurrence? (string[]) e.g. ['RRULE:FREQ=DAILY;COUNT=2']
 *  - colorId? (string)
 *  - sendUpdates? ('all' | 'externalOnly' | 'none')
 *  - googleAccessToken? (string) as fallback
 */
eventRouter.post('/create', async (req, res) => {
  const googleToken = extractGoogleAccessToken(req);
  const user = (req as any).user || (req as any).userId || (req as any).userEmail;

  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  if (!googleToken) {
    return res.status(400).json({
      error: 'Google access token ausente. Envie no header x-google-access-token, query googleAccessToken ou body.googleAccessToken.',
    });
  }

  const {
    summary,
    description,
    location,
    start,
    end,
    attendees,
    isRemote,
    recurrence,
    colorId,
    sendUpdates,
  } = req.body || {};

  if (!summary || !start || !end) {
    return res.status(400).json({ error: 'Campos obrigatórios: summary, start, end' });
  }

  const normalizeDate = (v: any) => {
    if (typeof v === 'string') return { dateTime: v };
    if (v && typeof v.dateTime === 'string') return v;
    return null;
  };

  const startObj = normalizeDate(start);
  const endObj = normalizeDate(end);
  if (!startObj || !endObj) {
    return res.status(400).json({ error: 'start/end devem ser ISO strings ou objetos { dateTime, timeZone? }' });
  }

  const attendeesList =
    Array.isArray(attendees) && attendees.length
      ? attendees.map((email: string | { email: string }) =>
        typeof email === 'string' ? { email } : email
      )
      : undefined;

  try {
    const created = await createGoogleEvent(googleToken, {
      summary,
      description,
      location,
      start: startObj,
      end: endObj,
      attendees: attendeesList,
      isRemote: !!isRemote,
      recurrence,
      colorId,
      sendUpdates,
    });
    return res.status(201).json(created);
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Erro ao criar evento' });
  }
});

/**
 * GET /api/events
 * Optional: ?date=YYYY-MM-DD
 * Requires: x-google-access-token or query/body googleAccessToken
 */
eventRouter.get('/', async (req, res) => {
  const googleToken = extractGoogleAccessToken(req);
  if (!googleToken) {
    return res.status(400).json({
      error: 'Google access token ausente. Envie no header x-google-access-token, query googleAccessToken ou body.googleAccessToken.',
    });
  }
  const date = typeof req.query.date === 'string' ? req.query.date : undefined;

  try {
    const items = await getGoogleEvents(googleToken, date);
    return res.status(200).json(items);
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Erro ao obter eventos' });
  }
});

/**
 * GET /api/events/user
 * Returns events linked to the authenticated user:
 *  - local reunioes where the user is a participant (from ParticipanteReuniao)
 *  - google events (optional) if x-google-access-token header provided
 */
eventRouter.get('/user', async (req, res) => {
  try {
    const userId = (req as any).userId as number | undefined;
    const userEmail = (req as any).userEmail as string | undefined;

    if (!userId && !userEmail) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const results: any[] = [];

    // 1) local meetings (Reuniao) where user is participant
    const participations = await prisma.participanteReuniao.findMany({
      where: { usuarioId: userId || 0 },
      include: { reuniao: true },
    });

    for (const p of participations) {
      const r = p.reuniao;
      // r.data is Date (date only), r.hora may be a Date with time only or null
      let start: Date | null = null;
      try {
        if (r.data) {
          const d = new Date(r.data as any);
          if (r.hora) {
            const time = new Date(r.hora as any);
            d.setHours(time.getHours(), time.getMinutes(), 0, 0);
          }
          start = d;
        }
      } catch (e) {
        start = null;
      }

      results.push({
        id: `local-${r.id}`,
        source: 'local',
        summary: r.titulo || 'Reunião',
        description: r.pauta || '',
        start: start ? start.toISOString() : null,
        end: start ? new Date(start.getTime() + 60 * 60 * 1000).toISOString() : null,
        location: r.local || '',
        attendees: [],
      });
    }

    // 2) fluxo de contrato: etapas PENDENTES (não mostrar NAO_INICIADO nem CONCLUIDO)
    if (userId) {
      const steps = await prisma.contractFlowStep.findMany({
        where: {
          status: 'PENDENTE',
          flow: {
            participantes: { some: { usuarioId: userId } },
            status: { not: 'CONCLUIDO' }
          },
        },
        include: { flow: { include: { empresa: true } } },
        orderBy: { scheduledAt: 'asc' },
      });

      for (const s of steps) {
        const empresaNome = s.flow.empresa?.nomeFantasia || s.flow.empresa?.razaoSocial || '';
        const fluxoNome = s.flow.nome || '';

        const labelMap: Record<string, string> = {
          REUNIAO: 'Reunião Inicial',
          PROPOSTA: 'Elaboração de Proposta',
          CONTRATO: 'Formalização de Contrato',
          CRIACAO_EMPRESA: 'Cadastro da Empresa',
        };

        const etapaLabel = labelMap[(s as any).type] || s.type;

        // Montar título prioritizando nome do fluxo, depois empresa
        let titulo = `[Fluxo] ${etapaLabel}`;
        if (fluxoNome) {
          titulo += ` — ${fluxoNome}`;
        } else if (empresaNome) {
          titulo += ` — ${empresaNome}`;
        }

        // Descrição mais detalhada
        let description = `Etapa atual do fluxo: ${etapaLabel}`;
        if (fluxoNome) {
          description += `\nFluxo: ${fluxoNome}`;
        }
        if (empresaNome && empresaNome !== fluxoNome) {
          description += `\nEmpresa: ${empresaNome}`;
        }

        const start = s.scheduledAt ? new Date(s.scheduledAt) : null;
        results.push({
          id: `flow-step-${s.id}`,
          source: 'flow',
          flowId: s.flow.id,
          stepId: s.id,
          stepType: s.type,
          summary: titulo,
          description: description,
          start: start ? start.toISOString() : null,
          end: start ? new Date(start.getTime() + 60 * 60 * 1000).toISOString() : null,
          location: '',
          attendees: [],
        });
      }
    }

    // 3) google events (optional)
    const googleToken = extractGoogleAccessToken(req);
    if (googleToken) {
      const items = await getGoogleEvents(googleToken);
      for (const ev of items || []) {
        // normalize start
        const s = ev.start?.dateTime || ev.start?.date || null;
        const e = ev.end?.dateTime || ev.end?.date || null;
        results.push({
          id: ev.id || `google-${Math.random().toString(36).slice(2)}`,
          source: 'google',
          summary: ev.summary || 'Evento',
          description: ev.description || '',
          start: s,
          end: e,
          location: ev.location || '',
          attendees: (ev.attendees || []).map((a: any) => a.email),
        });
      }
    }

    return res.status(200).json(results);
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Erro ao obter eventos do usuário' });
  }
});

export default eventRouter;
