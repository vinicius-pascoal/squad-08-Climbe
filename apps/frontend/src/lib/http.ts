// apps/frontend/src/lib/http.ts
const API_BASE = (import.meta as any).env?.VITE_API_BASE || '';

function buildUrl(path: string) {
  return API_BASE ? API_BASE.replace(/\/$/, '') + path : path;
}

function logoutAndRedirect() {
  try {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  } finally {
    if (location.pathname !== '/') location.assign('/');
  }
}

export async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem('access_token') || '';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as any),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(buildUrl(path), {
    ...init,
    headers,
  });

  let data: any = null;
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    try { data = await res.json(); } catch {}
  } else {
    data = await res.text();
  }

  if (res.status === 401) {
    logoutAndRedirect();
    const err: any = new Error('Não autorizado');
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
