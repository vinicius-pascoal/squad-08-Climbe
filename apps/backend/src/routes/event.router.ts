import { Router } from 'express';
import { createGoogleEvent, getGoogleEvents } from '../services/google.service';
import { requireAuth } from '../middlewares/auth';

const eventRouter = Router();

// All routes require auth (supports our JWT or Google ID token)
eventRouter.use(requireAuth);

/**
 * Helper to extract a Google access token from body, header or query.
 */
function extractGoogleAccessToken(req: any): string | null {
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

export default eventRouter;