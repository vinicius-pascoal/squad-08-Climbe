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

import { showLoading, hideLoading } from './loading'

// Verifica se o token está próximo de expirar (menos de 5 minutos)
function shouldRefreshToken(token: string): boolean {
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = JSON.parse(atob(base64));
    if (typeof json.exp !== 'number') return false;
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = json.exp - now;
    // Renova se faltam menos de 5 minutos (300 segundos)
    return timeLeft > 0 && timeLeft < 300;
  } catch {
    return false;
  }
}

// Função para renovar o token
let refreshPromise: Promise<string> | null = null;
async function refreshToken(): Promise<string> {
  // Se já há uma renovação em andamento, aguarda ela
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('No token');

      const res = await fetch(buildUrl('/api/auth/refresh'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Refresh failed');

      const data = await res.json();
      if (data?.access_token) {
        localStorage.setItem('access_token', data.access_token);
        return data.access_token;
      }
      throw new Error('No token in response');
    } catch (error) {
      // Se falhar a renovação, faz logout
      logoutAndRedirect();
      throw error;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function http<T = any>(path: string, init?: RequestInit & { showLoading?: boolean, responseType?: 'json' | 'blob' }): Promise<T> {
  let token = localStorage.getItem('access_token');

  // Renova o token se estiver próximo de expirar (exceto na própria rota de refresh)
  if (token && !path.includes('/auth/refresh') && !path.includes('/auth/token') && shouldRefreshToken(token)) {
    try {
      token = await refreshToken();
    } catch {
      // Se falhar, continua com o token atual (middleware vai tratar)
    }
  }

  // clone headers and ensure Content-Type JSON by default
  const headers = new Headers(init?.headers || {});
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  // determine whether to show loading: explicit opt-in via init.showLoading, otherwise true for POST requests
  const method = (init?.method || 'GET').toString().toUpperCase();
  const shouldShow = (init as any)?.showLoading !== undefined ? !!(init as any).showLoading : (method === 'POST');

  if (shouldShow) showLoading()
  try {
    // remove custom props before passing to fetch
    const { showLoading: _sl, responseType, ...fetchInit } = (init as any) || {};
    const res = await fetch(buildUrl(path), { ...fetchInit, headers });

    let data: any = null;
    try {
      if (responseType === 'blob') {
        data = await res.blob();
      } else {
        data = await res.json();
      }
    } catch { }

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
  } finally {
    if (shouldShow) hideLoading()
  }
}
