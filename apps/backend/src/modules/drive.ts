import { google, drive_v3 } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { Express, Request, Response } from "express";

const oauth2Client = new google.auth.OAuth2(
  process.env.OAUTH2_ID,
  process.env.OAUTH2_SECRET,
  process.env.OAUTH2_REDIRECT,
);

export function setupOAuth(app:Express)
{
	app.get("/login", (req, res) => {
		const url = oauth2Client.generateAuthUrl({
			access_type: "offline",
			prompt: "consent",
			scope: ["https://www.googleapis.com/auth/drive.readonly"],
		});
		res.redirect(url);
	});

	app.get("/oauth2callback", async (req:Request, res:Response) => {
		const code = req.query.code as string;
		if (!code) return res.send("Nenhum código foi encontrado.");

		const { tokens } = await oauth2Client.getToken(code);
		oauth2Client.setCredentials(tokens);

		// Pegar access e refresh tokens
		console.log("Access Token:", tokens.access_token);
		console.log("Refresh Token:", tokens.refresh_token);
		oauth2Client.setCredentials({
			access_token: tokens.access_token,
			refresh_token: tokens.refresh_token
		});

		//res.redirect('/');

		const planilha = await getFileTextByName("Pasta1.csv", process.env.DRIVE_FOLDERID!, oauth2Client);
		res.send(planilha);
	});
}

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