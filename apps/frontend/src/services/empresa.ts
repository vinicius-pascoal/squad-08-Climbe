import { http } from '../lib/http';

export type EmpresaResponse = {
  id: number;
  razaoSocial: string;
  nomeFantasia: string | null;
  cnpj: string;
};

export function listEmpresas() {
  return http<EmpresaResponse[]>('/api/empresas', {
    method: 'GET',
  });
}

export function getEmpresaById(id: number) {
  return http<EmpresaResponse>(`/api/empresas/${id}`, {
    method: 'GET',
  });
}
