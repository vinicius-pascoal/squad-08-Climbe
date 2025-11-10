import { google, drive_v3 } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { Readable } from "stream";

export async function uploadCsv(
	auth: OAuth2Client,
	content: string,
	fileName: string,
	mimeType = 'text/csv',
	isBase64 = false
): Promise<string | null> {
	const drive = google.drive({ version: 'v3', auth });
	const body = isBase64 ? Buffer.from(content, 'base64') : content;
	const stream = Readable.from([body]);

	try {
		const res = await drive.files.create({
			requestBody: {
				name: fileName,
				mimeType,
				parents: process.env.DRIVE_FOLDERID ? [process.env.DRIVE_FOLDERID] : undefined,
			},
			media: {
				mimeType,
				body: stream,
			},
			fields: 'id,webViewLink',
		});
		const id = res.data.id as string | undefined;
		const webViewLink = res.data.webViewLink as string | undefined;
		console.log('Arquivo criado com ID:', id, 'link:', webViewLink);
		if (!id) return null;
		return webViewLink ?? `https://drive.google.com/file/d/${id}/view`;
	} catch (e) {
		console.log('Erro criando arquivo no Drive:', e);
	}
	return null;
}

export async function updateCsv(
	auth: OAuth2Client,
	fileId: string,
	content: string,
	mimeType = 'text/csv',
	isBase64 = false
): Promise<string | null> {
	const drive = google.drive({ version: 'v3', auth });
	const body = isBase64 ? Buffer.from(content, 'base64') : content;
	const stream = Readable.from([body]);

	try {
		const res = await drive.files.update({
			fileId,
			media: {
				mimeType,
				body: stream,
			},
			fields: 'id,webViewLink',
			supportsAllDrives: true,
		});

		if (res.status === 403) {
			throw new Error('Permissões insuficientes ao Drive da Climbe, contate o administrador.');
		}

		const id = res.data.id as string | undefined;
		const webViewLink = res.data.webViewLink as string | undefined;
		return webViewLink ?? (id ? `https://drive.google.com/file/d/${id}/view` : null);
	} catch (e) {
		console.log('Erro atualizando arquivo no Drive:', e);
	}
	return null;
}

export async function findById(auth: OAuth2Client, fileId: string): Promise<boolean> {
	const drive = google.drive({ version: "v3", auth });

	try {
		await drive.files.get({ fileId, fields: "id", supportsAllDrives: true });
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
