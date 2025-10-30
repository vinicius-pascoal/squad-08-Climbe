import { google, drive_v3 } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { Readable } from "stream";

export async function uploadCsv(auth:OAuth2Client, content:string, fileName:string): Promise<string | null> {
	const drive = google.drive({ version: "v3", auth });
	const stream = Readable.from([content]);

	try {
		const res = await drive.files.create({
			requestBody: {
				name: `${fileName}.csv`,
				mimeType: "text/csv",
				parents: [process.env.DRIVE_FOLDERID!]
			},
			media: {
				mimeType: "text/csv",
				body: stream
			},
			fields: "id",
		});
		console.log("Arquivo criado com ID:", res.data.id);
		return new Promise<string>(() => res.data.id);
	}
	catch(e) {
		console.log("Erro criando arquivo no Drive:", e)
	}
	return null;
}

export async function updateCsv(auth:OAuth2Client, fileId:string, content:string): Promise<string | null> {
	const drive = google.drive({ version: "v3", auth });
	const stream = Readable.from([content]);

	try {
		const res = await drive.files.update({
			fileId,
			media: {
				mimeType: "text/csv",
				body: stream,
			},
			fields: "id",
			supportsAllDrives: true
		});

		if(res.status == 403) {
			throw new Error("Permissões insuficientes ao Drive da Climbe, contate o administrador.");
		}
		return new Promise<string>(() => res.data.id);
	}
	catch(e) {
		console.log("Erro atualizando arquivo no Drive:", e);
	}
	return null;
}

export async function findById(auth:OAuth2Client, fileId:string):Promise<boolean> {
	const drive = google.drive({ version: "v3", auth });

	try {
		await drive.files.get({fileId, fields: "id", supportsAllDrives: true});
		return true;
	} catch (err: any) {
		if (err.code === 404) return false;
		throw err;
	}
}

export async function getFileTextById(auth: OAuth2Client, fileId: string): Promise<string | null> {
	const drive = google.drive({ version: "v3", auth });

	try {
		const res = await drive.files.get(
			{ fileId, alt: "media", supportsAllDrives: true },
			{ responseType: "stream" }
		);

		return await new Promise<string>((resolve, reject) => {
			let data = "";
			res.data
				.on("data", (chunk: Buffer) => (data += chunk.toString("utf-8")))
				.on("end", () => resolve(data))
				.on("error", (err: Error) => reject(err));
		});

	} catch (err: any) {
		if (err.code === 404) return null; // arquivo não encontrado
		throw err; // outros erros
	}
}