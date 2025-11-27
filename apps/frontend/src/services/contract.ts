import { http } from '../lib/http';

export type ContratoResponse = {
	id: string;
	nome: string;
	propostaId: number | null;
	status: string | null;
	descricao: string | null;
	valor: number;
	dataInicio: Date;
	dataFim: Date;
	envolvidos: string | null;
	acoes: string | null;
	permissoes: string | null;
};

export type contratoInput = {
	id: string;
	nome: string;
	propostaId: number;
	status: string;
	descricao: string;
	valor: number;
	dataInicio: string;
	dataFim: string;
	envolvidos: string;
	acoes: string;
	permissoes: string;
};

export function listContratos() {
	return http<ContratoResponse[]>('/api/contratos', {
		method: 'GET',
	});
}

export function getContratoById(id: string) {
	return http<ContratoResponse>(`/api/contratos/${id}`, {
		method: 'GET',
	});
}

export function createcontrato(input: contratoInput) {
	return http<ContratoResponse>('/api/contratos/register', {
		method: 'POST',
		body: JSON.stringify({ ...input }),
	});
}

export function aprovarContrato(id: string) {
	return http<ContratoResponse>(`/api/contratos/${id}/aprovar`, {
		method: 'PATCH',
		body: JSON.stringify({ status: 'Aprovado' }),
	});
}

export function recusarContrato(id: string) {
	return http<ContratoResponse>(`/api/contratos/${id}/recusar`, {
		method: 'PATCH',
		body: JSON.stringify({ status: 'Rescindido' }),
	});
}
