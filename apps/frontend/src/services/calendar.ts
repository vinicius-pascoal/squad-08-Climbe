import { loginGoogle } from "./auth";

const googleCalendar = {
	// adiciona um evento (reunião é um evento)
	async addEvent(titulo:string, local:string, descricao:string, inicio:Date, fim:Date, emails?:Array<string>) {
		const attendees = [];
		if(emails) {
			for (const email of emails) {
				attendees.push({'email': email, 'optional': false});
			}
		}

		return apiPost("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
			'summary': titulo,
			'location': local,
			'description': descricao,
			'start': {
				'dateTime': inicio.toISOString(),
				//'timeZone': 'America/Los_Angeles'
			},
			'end': {
				'dateTime': fim.toISOString(),
				//'timeZone': 'America/Los_Angeles'
			},
			'attendees': attendees,
			/*'recurrence': [
				'RRULE:FREQ=DAILY;COUNT=2'
			]*/
		},
		(res:Response) => {
			console.log("Evento adicionado!");
			console.log(res);
		},
		(res:Response) => {
			console.log("Erro ao adicionar evento!");
			console.log(res);
		})
	},

	// adiciona uma task
	async addTask(nome:string, descricao:string, data:Date) {
		
	},
};

async function apiPost(uri:string, body:any, success:(res:any) => void, failed?:(res:any) => void): Promise<boolean> {
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

async function apiGet(uri:string, success:(res:Response) => void, failed?:(res:Response) => void):Promise<boolean> {
	const access_token = localStorage.getItem('access_token');
	if(!access_token || access_token.length < 1) {
		//Access Token nulo ou invalido
		loginGoogle();
		return false;
	}

	const response:Response = await fetch(uri, {
		headers: {
			Authorization: `Bearer ${access_token}`
		}
	});

	if (response.ok) {
		//Access Token válido
		success(await response);
		return true;
	}
	
	if(failed) {
		//Access token expirou
		failed(await response);
	}
	return false;
}
export default googleCalendar;