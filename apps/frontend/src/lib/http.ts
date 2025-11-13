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

export async function http<T = any>(path: string, init?: RequestInit & { showLoading?: boolean, responseType?: 'json' | 'blob' }): Promise<T> {
  const token = localStorage.getItem('access_token');
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
