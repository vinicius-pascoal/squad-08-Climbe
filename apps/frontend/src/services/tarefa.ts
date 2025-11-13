import { http } from '../lib/http'

export async function listTarefas(propostaId?: number) {
  const q = propostaId ? `?propostaId=${encodeURIComponent(String(propostaId))}` : ''
  return http(`/api/tarefas${q}`)
}

export async function getTarefa(id: number) {
  return http(`/api/tarefas/${id}`)
}

export async function createTarefa(input: any) {
  return http('/api/tarefas', { method: 'POST', body: JSON.stringify(input) })
}

export async function updateTarefa(id: number, input: any) {
  return http(`/api/tarefas/${id}`, { method: 'PUT', body: JSON.stringify(input) })
}

export async function deleteTarefa(id: number) {
  return http(`/api/tarefas/${id}`, { method: 'DELETE' })
}
