import { ref } from 'vue';
import { http } from '../lib/http';

export const currentUser = ref<any>(null);
export const permissions = ref<string[]>([]);

export async function initAuth() {
  try {
    const me = await http('/api/me');
    currentUser.value = me;
    permissions.value = Array.isArray(me?.permissoes) ? me.permissoes : [];
  } catch (e) {
    // se 401, http() já redireciona; apenas zera
    currentUser.value = null;
    permissions.value = [];
  }
}

export function hasPermission(desc: string) {
  if (!permissions.value || !permissions.value.length) return false;
  return permissions.value.includes(desc);
}

export type LoginInput = { username: string; password: string };
export type LoginResponse = {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  user: { id: number; nomeCompleto: string; email: string };
};

export function loginApi(input: LoginInput) {
  return http<LoginResponse>('/api/auth/token', {
    method: 'POST',
    body: JSON.stringify({ grant_type: 'password', ...input }),
  });
}

export function loginGoogle() {
  window.location.href = `${(import.meta as any).env?.VITE_BACKEND_URI || ''}/login`;
}

export default {
  currentUser,
  permissions,
  initAuth,
  hasPermission,
  loginApi,
  loginGoogle,
};
