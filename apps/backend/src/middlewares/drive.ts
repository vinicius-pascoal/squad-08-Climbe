//import { app } from "../app";
import { google, drive_v3 } from "googleapis";
import { OAuth2Client } from "google-auth-library";

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