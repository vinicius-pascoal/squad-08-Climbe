// apps/frontend/src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';

function parseJwtExp(token: string): number | null {
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = JSON.parse(atob(base64));
    return typeof json.exp === 'number' ? json.exp : null;
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const exp = parseJwtExp(token);
  if (!exp) return false;
  const nowSec = Math.floor(Date.now() / 1000);
  return nowSec >= exp;
}

function clearAuth() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('../views/Login.vue') },
    { path: '/cadastro', component: () => import('../views/Cadastro.vue') },
    { path: '/home', component: () => import('../views/Home.vue'), meta: { requiresAuth: true } },
    { path: '/usuarios', component: () => import('../views/Usuarios.vue'), meta: { requiresAuth: true } },
    { path: '/agenda', component: () => import('../views/Agenda.vue'), meta: { requiresAuth: true } },
    { path: '/contratos', component: () => import('../views/Contratos.vue'), meta: { requiresAuth: true } },
    { path: '/propostas', component: () => import('../views/Propostas.vue'), meta: { requiresAuth: true } },
    { path: '/empresas', component: () => import('../views/Empresas.vue'), meta: { requiresAuth: true } },
    { path: '/auditoria', component: () => import('../views/Auditoria.vue'), meta: { requiresAuth: true } },
    { path: '/CadastroUsuario', component: () => import('../views/CadastroUsuario.vue'), meta: { requiresAuth: true } },
    { path: '/auth', component: () => import('../views/Auth.vue') },
  ],
});

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('access_token') || null;

  if (token && isTokenExpired(token)) {
    clearAuth();
    if (to.meta?.requiresAuth) return next({ path: '/' });
  }

  if (to.meta?.requiresAuth) {
    if (!token) return next({ path: '/' });
  }

  if (!to.meta?.requiresAuth && token && !isTokenExpired(token) && to.path === '/') {
    return next({ path: '/home' });
  }

  next();
});

export default router;
