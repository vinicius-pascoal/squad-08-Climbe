
import { Router } from 'express';
import { createGoogleEvent, getGoogleEvents } from '../services/google.service';

const eventRouter = Router();

// Endpoint to create Google Calendar event
eventRouter.post('/create', async (req, res) => {
  const { googleAccessToken, eventDetails } = req.body;

  if (!googleAccessToken || !eventDetails) {
    return res.status(400).json({ error: 'Google access token and event details are required' });
  }

  try {
    // Agora a função é importada e conhecida neste arquivo
    const event = await createGoogleEvent(googleAccessToken, eventDetails);
    return res.status(201).json(event);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Endpoint to get events from Google Calendar
eventRouter.get('/events', async (req, res) => {
  const { googleAccessToken, date } = req.query;

  if (!googleAccessToken) {
    return res.status(400).json({ error: 'Google access token is required' });
  }

  try {
    // Agora a função é importada e conhecida neste arquivo
    const events = await getGoogleEvents(googleAccessToken as string, date as string);
    return res.status(200).json(events);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default eventRouter;
