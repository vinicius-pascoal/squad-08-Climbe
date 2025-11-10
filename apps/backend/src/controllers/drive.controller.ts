import { Request, Response } from "express";
import { uploadCsv, updateCsv, findById, getFileTextById } from "../middlewares/drive";
import { extractGoogleAccessToken } from "../routes/event.router";
import { OAuth2Client } from "google-auth-library";

export const driveController = {
	// POST /create
	// { fileName: string, content: string }
	async create(req: Request, res: Response) {
		try {
			const token = extractGoogleAccessToken(req)!;
			if (!token) {
				return res.status(400).json({
					error: 'Google access token ausente. Envie no header x-google-access-token, query googleAccessToken ou body.googleAccessToken.',
				});
			}

			const auth = new OAuth2Client();
			auth.setCredentials({ access_token: token });
			const mimeType = req.body.mimeType || 'application/octet-stream';
			const isBase64 = !!req.body.base64;
			const url = await uploadCsv(auth, req.body.content, req.body.fileName, mimeType, isBase64);
			console.log('drive.create ->', url);
			return res.status(201).json({ url });
		}
		catch (error: any) {
			console.error(error);
			return res.status(500).json({ message: "Erro ao enviar dados ao drive" });
		}
	},

	// PUT /:id
	// { content: string }
	async update(req: Request, res: Response) {
		const id = req.params.id;
		try {
			const token = extractGoogleAccessToken(req)!;
			if (!token) {
				return res.status(400).json({
					error: 'Google access token ausente. Envie no header x-google-access-token, query googleAccessToken ou body.googleAccessToken.',
				});
			}

			const auth = new OAuth2Client();
			auth.setCredentials({ access_token: token });
			const fileExists = await findById(auth, id);
			if (fileExists) {
				const mimeType = req.body.mimeType || 'application/octet-stream';
				const isBase64 = !!req.body.base64;
				const url = await updateCsv(auth, id, req.body.content, mimeType, isBase64);
				return res.status(200).json({ url });
			} else {
				return res.status(404).json({ message: 'Arquivo não encontrado, ID:', id });
			}
		}
		catch (error: any) {
			console.error(error);
			if (error.status == "404") {
				return res.status(404).json({ message: "Arquivo não encontrado no drive" });
			}
			return res.status(500).json({ message: "Erro ao atualizar dados do drive" });
		}
	},

	// GET /:id
	async getById(req: Request, res: Response) {
		const id = req.params.id;
		try {
			const token = extractGoogleAccessToken(req)!;
			if (!token) {
				return res.status(400).json({
					error: 'Google access token ausente. Envie no header x-google-access-token, query googleAccessToken ou body.googleAccessToken.',
				});
			}

			const auth = new OAuth2Client();
			auth.setCredentials({ access_token: token });
			const csv = await getFileTextById(auth, id);
			return res.status(200).json({ data: csv });
		}
		catch (error: any) {
			console.error(error);
			if (error.status == "404") {
				return res.status(404).json({ message: "Arquivo não encontrado no drive" });
			}
			return res.status(500).json({ message: "Erro ao adquirir dados do drive" });
		}
	}
}
