import { http } from '../lib/http';

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
export function createcontrato(input: contratoInput) {
  return http<any>('/api/contrato', {
	method: 'POST',
	body: JSON.stringify({ ...input }),
  });
}