import { createRouter, createWebHistory } from 'vue-router';


// Importando as views para as rotas
const routes = [
  { path: '/', component: () => import('../views/Login.vue') },
  { path: '/cadastro', component: () => import('../views/Cadastro.vue') },
  { path: '/home', component: () => import('../views/Home.vue'), meta: { requiresAuth: true } },
  { path: '/usuarios', component: () => import('../views/Usuarios.vue'), meta: { requiresAuth: true } },
  { path: '/agenda', component: () => import('../views/Agenda.vue'), meta: { requiresAuth: true } },
  { path: '/contratos', component: () => import('../views/Contratos.vue'), meta: { requiresAuth: true } },
  { path: '/propostas', component: () => import('../views/Propostas.vue'), meta: { requiresAuth: true } },
  { path: '/empresas', component: () => import('../views/Empresas.vue'), meta: { requiresAuth: true } },
  { path: '/auditoria', component: () => import('../views/Auditoria.vue'), meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});
// Proteção de rota para páginas que requerem autenticação
router.beforeEach((to, _from, next) => {
  if (to.meta?.requiresAuth) {
    const token = localStorage.getItem('access_token');
    if (!token) return next({ path: '/' });  // Se não tiver token, redireciona para o login
  }
  next();
});


export default router;
