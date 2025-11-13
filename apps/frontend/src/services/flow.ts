import { http } from '../lib/http';

export type StartFlowInput = {
  empresaId: number;
  participantIds?: number[];
  scheduledAt?: string; // ISO
};

export async function startFlow(body: StartFlowInput) {
  const headers: Record<string, string> = {};
  const gtoken = localStorage.getItem('google_access_token');
  if (gtoken) headers['x-google-access-token'] = gtoken;
  return http('/api/flows', { method: 'POST', headers, body: JSON.stringify(body) });
}

export async function advanceFlow(id: number, scheduledAt?: string) {
  return http(`/api/flows/${id}/advance`, { method: 'PATCH', body: JSON.stringify({ scheduledAt }) });
}

export async function listMyFlows() {
  return http('/api/flows?mine=true');
}

export async function scheduleStep(flowId: number, stepId: number, scheduledAt: string) {
  return http(`/api/flows/${flowId}/steps/${stepId}/schedule`, {
    method: 'POST',
    body: JSON.stringify({ scheduledAt }),
  });
}

export async function linkProposta(flowId: number, propostaId: number) {
  return http(`/api/flows/${flowId}/link-proposta`, {
    method: 'POST',
    body: JSON.stringify({ propostaId }),
  });
}

export async function linkContrato(flowId: number, contratoId: string) {
  return http(`/api/flows/${flowId}/link-contrato`, {
    method: 'POST',
    body: JSON.stringify({ contratoId }),
  });
}

const flowApi = { startFlow, advanceFlow, listMyFlows, scheduleStep, linkProposta, linkContrato };
export default flowApi;
