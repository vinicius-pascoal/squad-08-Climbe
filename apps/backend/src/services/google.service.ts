import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

/**
 * Create a Google Calendar event. If `eventDetails.isRemote` is true, a Google Meet
 * conference is created and attached to the event.
 *
 * @param googleAccessToken A valid Google OAuth2 access token with Calendar scope
 * @param eventDetails The event payload (summary, description, start, end, attendees[], isRemote?)
 */
export async function createGoogleEvent(googleAccessToken: string, eventDetails: any) {
  const oauth2Client = new OAuth2Client();
  oauth2Client.setCredentials({ access_token: googleAccessToken });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const { isRemote, ...eventBody } = eventDetails ?? {};

  const resource: any = {
    ...eventBody,
  };

  if (isRemote) {
    resource.conferenceData = {
      createRequest: {
        requestId: `req-${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    };
  }

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: resource,
      conferenceDataVersion: isRemote ? 1 : 0,
      supportsAttachments: false,
      sendUpdates: 'all',
    });
    return response.data;
  } catch (error: any) {
    console.error('Error creating Google Calendar event:', error?.response?.data || error);
    throw new Error(`Error creating event: ${error?.message || 'Unknown error'}`);
  }
}

/**
 * List Google Calendar events for a specific day (UTC ISO date string 'YYYY-MM-DD'),
 * or for the next 7 days if no date is provided.
 */
export async function getGoogleEvents(googleAccessToken: string, date?: string) {
  const oauth2Client = new OAuth2Client();
  oauth2Client.setCredentials({ access_token: googleAccessToken });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  let timeMin: string;
  let timeMax: string;

  if (date) {
    const d = new Date(date + 'T00:00:00Z');
    const d2 = new Date(d);
    d2.setUTCDate(d.getUTCDate() + 1);
    timeMin = d.toISOString();
    timeMax = d2.toISOString();
  } else {
    const now = new Date();
    const week = new Date(now);
    week.setDate(now.getDate() + 7);
    timeMin = now.toISOString();
    timeMax = week.toISOString();
  }

  try {
    const events = await calendar.events.list({
      calendarId: 'primary',
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
    });
    return events.data.items || [];
  } catch (error: any) {
    console.error('Error fetching Google Calendar events:', error?.response?.data || error);
    throw new Error(`Error fetching events: ${error?.message || 'Unknown error'}`);
  }
}
