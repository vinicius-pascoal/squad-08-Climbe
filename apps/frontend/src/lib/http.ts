// apps/frontend/src/lib/http.ts
const API_BASE = import.meta.env.VITE_API_BASE || '';

function buildUrl(path: string) {
  return API_BASE ? API_BASE.replace(/\/$/, '') + path : path;
}

function logoutAndRedirect() {
  try {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  } finally {
    // usa navegação dura para zerar estado
    if (location.pathname !== '/') location.assign('/');
  }
}

export async function http<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && options.body) headers.set('Content-Type', 'application/json');

  const token = localStorage.getItem('access_token');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(buildUrl(path), { ...options, headers });

  // tenta ler corpo (pode ser vazio)
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { /* ignore */ }

  if (res.status === 401) {
    // token expirado/inválido → logout + redirect
    logoutAndRedirect();
    // lança erro para quem chamou (se precisar tratar localmente)
    const msg = data?.error || data?.message || 'Não autorizado';
    const err: any = new Error(msg);
    err.status = 401;
    err.data = data;
    throw err;
  }

  if (!res.ok) {
    const msg = data?.error || data?.message || res.statusText || 'Erro na requisição';
    const err: any = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data as T;
}
