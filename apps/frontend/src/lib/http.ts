// apps/frontend/src/lib/http.ts
const API_BASE = (import.meta as any).env?.VITE_BACKEND_URI || (import.meta as any).env?.VITE_API_BASE || '';

function buildUrl(path: string) {
  const base = API_BASE ? API_BASE.replace(/\/$/, '') : '';
  return base + path;
}

function logoutAndRedirect() {
  try {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('google_access_token');
  } finally {
    if (location.pathname !== '/') location.assign('/');
  }
}

export async function http<T = any>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem('access_token');
  const headers = new Headers(init?.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(buildUrl(path), { ...init, headers });

  let data: any = null;
  try {
    data = await res.json();
  } catch {}

  if (res.status === 401) {
    logoutAndRedirect();
    const err: any = new Error((data && (data.error || data.message)) || 'Unauthorized');
    err.status = 401;
    err.data = data;
    throw err;
  }

  if (!res.ok) {
    const err: any = new Error((data && (data.error || data.message)) || res.statusText || 'Erro na requisição');
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data as T;
}