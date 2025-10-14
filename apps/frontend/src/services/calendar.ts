import { http } from '../lib/http';

type AddEventInput = {
  titulo: string;
  local?: string;
  descricao?: string;
  inicio: Date | string;
  fim: Date | string;
  emails?: string[];
  recorrencia?: string[];
  corId?: string;
  notificar?: boolean;
  remoto?: boolean; // cria link do Meet
};

function getGoogleToken(): string | null {
  return localStorage.getItem('google_access_token');
}

export async function addCalendarEvent(input: AddEventInput) {
  const startIso = typeof input.inicio === 'string' ? input.inicio : input.inicio.toISOString();
  const endIso = typeof input.fim === 'string' ? input.fim : input.fim.toISOString();

  const body = {
    summary: input.titulo,
    description: input.descricao,
    location: input.local,
    start: { dateTime: startIso },
    end: { dateTime: endIso },
    attendees: input.emails,
    recurrence: input.recorrencia,
    colorId: input.corId,
    sendUpdates: input.notificar ? 'all' : 'none',
    isRemote: !!input.remoto,
  };

  const headers: Record<string,string> = {};
  const gtoken = getGoogleToken();
  if (gtoken) headers['x-google-access-token'] = gtoken;

  return http('/api/events/create', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
}

export async function listCalendarEvents(date?: string) {
  const headers: Record<string,string> = {};
  const gtoken = getGoogleToken();
  if (gtoken) headers['x-google-access-token'] = gtoken;

  const url = date ? `/api/events?date=${encodeURIComponent(date)}` : '/api/events';
  return http(url, { headers });
}

const calendarApi = { addCalendarEvent, listCalendarEvents };
export default calendarApi;
