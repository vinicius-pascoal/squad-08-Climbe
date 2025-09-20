import { app } from "../app";
import { google, drive_v3 } from "googleapis";
import { Request, Response } from "express";

export const oauth2Client = new google.auth.OAuth2(
  process.env.OAUTH2_ID,
  process.env.OAUTH2_SECRET,
  `${process.env.VITE_BACKEND_URI}/oauth2callback`,
);

app.get("/login", (req:Request, res:Response) => {
	const url = oauth2Client.generateAuthUrl({
		access_type: "offline",
		scope: [
			"https://www.googleapis.com/auth/userinfo.email",		//Acesso ao endereço de email do usuário
			"https://www.googleapis.com/auth/userinfo.profile",		//Acesso ao nome completo do usuário
			"https://www.googleapis.com/auth/calendar",				//Acesso aos eventos do google calendar
			"https://www.googleapis.com/auth/tasks",				//Acesso as tarefas do google calendar
			/*, "https://www.googleapis.com/auth/drive.readonly"	//Acesso ao google drive*/
		],
	});
	res.redirect(url);
});

app.get("/oauth2callback", async (req:Request, res:Response) => {
	const code = req.query.code as string;
	if (!code) return res.send("Nenhum código foi encontrado.");

	let access_token = null;
	try {
		const { tokens } = await oauth2Client.getToken(code);

		// Pegar access e refresh tokens
		//console.log("Access Token:", tokens.access_token);
		//console.log("Refresh Token:", tokens.refresh_token);
		oauth2Client.setCredentials(tokens);
		const oauth2 = google.oauth2({
			auth: oauth2Client,
			version: "v2",
		});
		
		// Pegar informações do usuário baseado no access token do google
		access_token = tokens.access_token;
		const r = await fetch(`${process.env.VITE_BACKEND_URI}/api/auth/google`, {
			method: 'POST',
			body: JSON.stringify({
				grant_type: 'google',
				access_token: access_token
			}),
			headers: new Headers({'Content-Type': 'application/json'})});

		const text = await r.text();
		const data = text ? JSON.parse(text) : null;

		if (!r.ok) {
			const message = (data && (data.error || data.message)) || r.statusText || 'Erro na requisição';
			const err: any = new Error(message);
			(err as any).status = r.status;
			(err as any).data = data;
			throw err;
		}
		res.redirect(`${process.env.VITE_FRONTEND_URI}/auth?access_token=${access_token}&user=${encodeURIComponent(JSON.stringify(data.user))}`);

		/*const planilha = await getFileTextByName("Pasta1.csv", process.env.DRIVE_FOLDERID!, oauth2Client);
		res.send(planilha);*/
	} catch (e: any) {
		if (e?.status === 403) {
			res.send("Seu cadastro está pendente de aprovação.");
		} else if (e?.status === 400) {
			if(access_token !== null) {
				//Se o access token for valido, redireciona usuário a página de cadastro com algumas informações preenchidas pelo google
				res.redirect(`${process.env.VITE_FRONTEND_URI}/cadastro?access_token=${access_token}`);
			} else {
				//Se não for valido mostra um erro na tela
				res.send("Credenciais inválidas.");
			}
		} else {
			res.send(e?.message || "Falha ao autenticar.");
		}
	}
});

import './drive';