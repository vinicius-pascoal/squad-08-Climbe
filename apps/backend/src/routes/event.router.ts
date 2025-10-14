import { Router } from 'express';
import { createGoogleEvent, getGoogleEvents } from '../services/google.service';
import { requireAuth } from '../middlewares/auth';

const eventRouter = Router();

// Protect all routes with JWT (works with tokens from password or Google login flows)
eventRouter.use(requireAuth);

/**
 * Create event
 * Body:
 *  - eventDetails: Google Calendar event body (summary, start, end, attendees, isRemote?)
 *  - googleAccessToken?: string  (fallback if you want to pass the Google OAuth token explicitly)
 * Also accepts the Google token via header 'x-google-access-token' or query '?googleAccessToken='
 */
eventRouter.post('/create', async (req, res) => {
  const eventDetails = req.body?.eventDetails;
  const explicitToken = req.body?.googleAccessToken || req.headers['x-google-access-token'] || req.query.googleAccessToken;

  if (!eventDetails) {
    return res.status(400).json({ error: 'eventDetails is required' });
  }
  if (!explicitToken || typeof explicitToken !== 'string') {
    return res.status(400).json({ error: 'Google access token is required (send in body.googleAccessToken, header x-google-access-token, or query googleAccessToken)' });
  }

  try {
    const created = await createGoogleEvent(String(explicitToken), eventDetails);
    return res.status(201).json(created);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * List events
 * Query:
 *  - date?: 'YYYY-MM-DD' (optional)
 *  - googleAccessToken?: string (also accepted in header x-google-access-token)
 */
eventRouter.get('/list', async (req, res) => {
  const date = (req.query?.date as string) || undefined;
  const explicitToken = (req.query?.googleAccessToken as string) || (req.headers['x-google-access-token'] as string) || (req.body?.googleAccessToken as string);

  if (!explicitToken) {
    return res.status(400).json({ error: 'Google access token is required (header x-google-access-token, query googleAccessToken or body.googleAccessToken)' });
  }

  try {
    const events = await getGoogleEvents(explicitToken, date);
    return res.status(200).json(events);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default eventRouter;
