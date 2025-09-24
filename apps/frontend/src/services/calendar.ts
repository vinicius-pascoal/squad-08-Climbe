import { loginGoogle } from "./auth";

const googleCalendar = {
	// adiciona um evento (reunião é um evento)
	async addEvent(
		titulo: string,
		local: string,
		descricao: string,
		inicio: Date,
		fim: Date,
		emails?: Array<string>,
		recorrencia?: string[],          // ex: ['RRULE:FREQ=DAILY;COUNT=2']
		corId?: string,                  // ID de cor do evento
		notificar?: boolean
	): Promise<boolean> {
		const attendees = emails?.map(email => ({ email, optional: false })) || [];
		const timeZone = "America/Sao_Paulo"; // Defina o fuso horário desejado

		return apiPost(
			"https://www.googleapis.com/calendar/v3/calendars/primary/events",
			{
				summary: titulo,
				location: local,
				description: descricao,
				start: { dateTime: inicio.toISOString(), timeZone },
				end: { dateTime: fim.toISOString(), timeZone },
				attendees,
				recurrence: recorrencia,
				colorId: corId,
				sendUpdates: notificar ? "all" : "none"
			},
			(res: any) => {
				console.log("Evento adicionado");
				console.log(res);
			},
			(err: any) => {
				console.error("Erro ao adicionar evento:");
				console.error(err);
			}
		);
	},

    // Lista os próximos eventos 
	async listEvents(maxResults = 10): Promise<any> {
		const timeMin = new Date().toISOString();
		return apiGet(
			`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&maxResults=${maxResults}&singleEvents=true&orderBy=startTime`,
			(res) => console.log("Eventos listados:", res),
			(err) => console.error("Erro ao listar eventos:", err)
		);
	},

	// Atualiza um evento existente 
	async updateEvent(eventId: string, updates: Partial<any>): Promise<any> {
		const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		if (updates.start) updates.start.timeZone = timeZone;
		if (updates.end) updates.end.timeZone = timeZone;

		return apiPatch(
			`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
			updates,
			(res) => console.log("Evento atualizado:", res),
			(err) => console.error("Erro ao atualizar evento:", err)
		);
	},

	// Remove um evento existente 
	async deleteEvent(eventId: string): Promise<any> {
		return apiDelete(
			`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
			() => console.log("Evento excluído"),
			(err) => console.error("Erro ao excluir evento:", err)
		);
	},

	// adiciona uma task
	async addTask(
		nome: string,
		descricao: string,
		data: Date
	): Promise<boolean> {
		const dueDate = data.toISOString();

		return apiPost(
			"https://tasks.googleapis.com/tasks/v1/lists/@default/tasks",
			{
				title: nome,
				notes: descricao,
				due: dueDate,
			},
			(res: any) => {
				console.log("Task adicionada");
				console.log(res);
			},
			(err: any) => {
				console.error("Erro ao adicionar task");
				console.error(err);
			}
		);
	},
};

async function apiPost(
	uri: string,
	body: any,
	success: (res: any) => void,
	failed?: (res: any) => void
): Promise<boolean> {
	const access_token = localStorage.getItem("access_token");
	if (!access_token) {
		// Access Token nulo ou inválido
		loginGoogle();
		return false;
	}

	const response = await fetch(uri, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${access_token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});

	const data = await response.json().catch(() => null); // caso não tenha body
	if (!response.ok) {
		if (failed) failed(data);
		return false;
	}

	if (success) success(data);
	return true;
}

async function apiGet(
	uri: string,
	success: (res: any) => void,
	failed?: (res: any) => void
): Promise<boolean> {
	const access_token = localStorage.getItem("access_token");
	if (!access_token || access_token.length < 1) {
		loginGoogle();
		return false;
	}

	const response = await fetch(uri, {
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	});

	const data = await response.json().catch(() => null);
	if (response.ok) {
		success(data);
		return true;
	}

	if (failed) failed(data);
	return false;
}

export default googleCalendar;
function apiDelete(arg0: string, arg1: () => void, arg2: (err: any) => void): any {
    throw new Error("Function not implemented.");
}

function apiPatch(arg0: string, updates: Partial<any>, arg2: (res: any) => void, arg3: (err: any) => void): any {
    throw new Error("Function not implemented.");
}
