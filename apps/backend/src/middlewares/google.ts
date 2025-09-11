import { app } from "../app";
import { google, drive_v3 } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { Express, Request, Response } from "express";

const oauth2Client = new google.auth.OAuth2(
  process.env.OAUTH2_ID,
  process.env.OAUTH2_SECRET,
  process.env.OAUTH2_REDIRECT,
);

app.get("/login", (req:Request, res:Response) => {
	const url = oauth2Client.generateAuthUrl({
		access_type: "offline",
		prompt: "consent",
		scope: ["https://www.googleapis.com/auth/userinfo.email"/*, "https://www.googleapis.com/auth/drive.readonly"*/],
	});
	res.redirect(url);
});

app.get("/oauth2callback", async (req:Request, res:Response) => {
	const code = req.query.code as string;
	if (!code) return res.send("Nenhum código foi encontrado.");

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
		const access_token = tokens.access_token;
		const r = await fetch('http://localhost:3000/api/auth/google', {
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
		res.redirect(`http://localhost:5173/auth?access_token=${tokens.access_token}&user=${encodeURIComponent(JSON.stringify(data.user))}`);

		/*const planilha = await getFileTextByName("Pasta1.csv", process.env.DRIVE_FOLDERID!, oauth2Client);
		res.send(planilha);*/
	} catch (e: any) {
		if (e?.status === 403) res.send("Seu cadastro está pendente de aprovação.");
		else if (e?.status === 400) res.send("Credenciais inválidas.");
		else res.send(e?.message || "Falha ao autenticar.");
	}
});

async function getFileTextByName(fileName:string, folderId:string, auth:OAuth2Client):Promise<string | null> {
	const drive = google.drive({ version: "v3", auth });

	// Busca o arquivo pelo nome dentro da pasta
	const resList = await drive.files.list({
		q: `'${folderId}' in parents and name='${fileName}' and trashed=false`,
		fields: "files(id, name)",
		spaces: "drive",
		orderBy: "modifiedTime desc", //garante que é a versão mais nova do arquivo
		pageSize: 1,
	});

	const files = resList.data.files;
	if (!files || files.length === 0) return null;

	const fileId = files[0].id!;
	
	// Baixa o arquivo e converte pra string
	const res = await drive.files.get(
		{ fileId, alt: "media" },
		{ responseType: "stream" }
	);

	return new Promise<string>((resolve, reject) => {
		let data = "";
		res.data
		.on("data", (chunk: Buffer) => (data += chunk.toString("utf-8")))
		.on("end", () => resolve(data))
		.on("error", (err: Error) => reject(err));
	});
}