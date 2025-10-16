import { google, calendar_v3 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

type CreateEventInput = {
  summary: string;
  description?: string;
  location?: string;
  start: { dateTime: string; timeZone?: string };
  end: { dateTime: string; timeZone?: string };
  attendees?: { email: string; optional?: boolean }[];
  recurrence?: string[];
  colorId?: string;
  isRemote?: boolean;
  sendUpdates?: 'all' | 'externalOnly' | 'none';
};

/**
 * Create a Google Calendar event. If `isRemote` is true, a Google Meet
 * conference is created and attached to the event.
 *
 * @param googleAccessToken A valid Google OAuth2 access token with Calendar scope
 * @param eventDetails The event payload (summary, description, start, end, attendees[], isRemote?)
 */
export async function createGoogleEvent(googleAccessToken: string, eventDetails: CreateEventInput) {
  const oauth2Client = new OAuth2Client();
  oauth2Client.setCredentials({ access_token: googleAccessToken });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const requestBody: calendar_v3.Schema$Event = {
    summary: eventDetails.summary,
    description: eventDetails.description,
    location: eventDetails.location,
    start: {
      dateTime: eventDetails.start.dateTime,
      timeZone: eventDetails.start.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: eventDetails.end.dateTime,
      timeZone: eventDetails.end.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    attendees: eventDetails.attendees,
    recurrence: eventDetails.recurrence,
    colorId: eventDetails.colorId,
  };

  if (eventDetails.isRemote) {
    requestBody.conferenceData = {
      createRequest: {
        requestId: 'req-' + Math.random().toString(36).slice(2),
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    };
  }

  const res = await calendar.events.insert({
    calendarId: 'primary',
    requestBody,
    conferenceDataVersion: eventDetails.isRemote ? 1 : 0,
    sendUpdates: eventDetails.sendUpdates || 'all',
  });

  return res.data;
}

export async function getGoogleEvents(googleAccessToken: string, date?: string) {
  const oauth2Client = new OAuth2Client();
  oauth2Client.setCredentials({ access_token: googleAccessToken });
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  let timeMin: string | undefined;
  let timeMax: string | undefined;

  if (date) {
    const d = new Date(date);
    const start = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0));
    const end = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59));
    timeMin = start.toISOString();
    timeMax = end.toISOString();
  } else {
    const now = new Date();
    const in30d = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    timeMin = now.toISOString();
    timeMax = in30d.toISOString();
  }

  const events = await calendar.events.list({
    calendarId: 'primary',
    timeMin,
    timeMax,
    singleEvents: true,
    orderBy: 'startTime',
  });

  return events.data.items || [];
}