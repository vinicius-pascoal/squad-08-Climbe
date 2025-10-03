// apps/frontend/src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

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
  if (!exp) return false; // if cannot parse, assume valid
  const now = Math.floor(Date.now() / 1000);
  return exp <= now;
}

const routes: RouteRecordRaw[] = [
  { path: '/login', name: 'Login', component: () => import('../views/Login.vue') },
  { path: '/auth', name: 'Auth', component: () => import('../views/Auth.vue') },
  { path: '/Home', name: 'Home', component: () => import('../views/Home.vue'), meta: { requiresAuth: true } },
  { path: '/Usuarios', name: 'Usuarios', component: () => import('../views/Usuarios.vue'), meta: { requiresAuth: true } },
  { path: '/Empresas', name: 'Empresas', component: () => import('../views/Empresas.vue'), meta: { requiresAuth: true } },
  { path: '/Propostas', name: 'Propostas', component: () => import('../views/Propostas.vue'), meta: { requiresAuth: true } },
  { path: '/Contratos', name: 'Contratos', component: () => import('../views/Contratos.vue'), meta: { requiresAuth: true } },
  { path: '/Cadastro', name: 'Cadastro', component: () => import('../views/Cadastro.vue') },
  { path: '/CadastroUsuario', name: 'CadastroUsuario', component: () => import('../views/CadastroUsuario.vue'), meta: { requiresAuth: true } },
  { path: '/Auditoria', name: 'Auditoria', component: () => import('../views/Auditoria.vue'), meta: { requiresAuth: true } },
  { path: '/Agenda', name: 'Agenda', component: () => import('../views/Agenda.vue'), meta: { requiresAuth: true } },
  { path: '/', name: 'AgendarReuniao', component: () => import('../views/AgendarReuniao.vue'), /*meta: { requiresAuth: true }*/ },
  { path: '/Perfilusuario', component: () => import('../views/Perfilusuario.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('access_token') || '';

  // Redirect invalid/expired tokens to login
  if (token && isTokenExpired(token)) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  if (to.meta?.requiresAuth) {
    if (!token) return next({ path: '/' });
  }

  // If already logged in and going to root, go to Home
  if (!to.meta?.requiresAuth && token && !isTokenExpired(token) && to.path === '/') {
    return next({ path: '/Home' });
  }

  next();
});

export default router;
