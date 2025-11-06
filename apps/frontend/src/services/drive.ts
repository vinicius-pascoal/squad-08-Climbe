
import { http } from '../lib/http';

function getTokenHeaders():Record<string, string> {
	const token = localStorage.getItem('google_access_token');
	return token ? {'x-google-access-token': token} : {};
}

export async function drivePost(fileName: string, content: string) {
	try {
		const response = await http('/api/drive/create', {
			method: 'POST',
			headers: getTokenHeaders(),
			body: JSON.stringify({ fileName, content }),
		})
		console.log(response);
	} catch (error) {
		console.error(error)
	}
}

export async function driveUpdate(id: string, content: string) {
	try {
		const response = await http(`/api/drive/${id}`, {
			method: 'PUT',
			headers: getTokenHeaders(),
			body: JSON.stringify({ content }),
		});
		console.log(response);
	} catch (error) {
		console.error(error)
	}
}

export async function driveGet(id: string, content: string) {
	try {
		const response = await http(`/api/drive/${id}`, {
			method: 'GET',
			headers: getTokenHeaders()
		});
		console.log(response);
	} catch (error) {
		console.error(error)
	}
}