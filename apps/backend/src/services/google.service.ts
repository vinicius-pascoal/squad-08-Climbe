import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// Função para criar eventos no Google Calendar
export async function createGoogleEvent(googleAccessToken: string, eventDetails: any) {
  const oauth2Client = new OAuth2Client();
  oauth2Client.setCredentials({
    access_token: googleAccessToken,
  });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  if (eventDetails.isRemote) {
    eventDetails.conferenceData = {
      createRequest: {
        requestId: `${new Date().getTime()}`,
        conferenceSolutionKey: {
          type: 'hangoutsMeet',
        },
      },
    };
  }

  try {
    const event = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: eventDetails,
      conferenceDataVersion: 1,
    });
    return event.data;
  } catch (error: any) {
    // É uma boa prática logar o erro original no servidor
    console.error('Error creating Google Calendar event:', error);
    throw new Error(`Error creating event: ${error.message}`);
  }
}

// Função para buscar eventos no Google Calendar
export async function getGoogleEvents(googleAccessToken: string, date?: string) {
  const oauth2Client = new OAuth2Client();
  oauth2Client.setCredentials({
    access_token: googleAccessToken,
  });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const timeMin = date ? `${date}T00:00:00Z` : new Date().toISOString();
  // Corrigido para lidar com a data final corretamente
  const timeMax = date ? `${date}T23:59:59Z` : undefined;

  try {
    const events = await calendar.events.list({
      calendarId: 'primary',
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
    });
    return events.data.items;
  } catch (error: any) {
    console.error('Error fetching Google Calendar events:', error);
    throw new Error(`Error fetching events: ${error.message}`);
  }
}
