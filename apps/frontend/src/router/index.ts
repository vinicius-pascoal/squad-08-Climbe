import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', component: () => import('../views/Login.vue') },
  { path: '/cadastro', component: () => import('../views/Cadastro.vue') },
  { path: '/dashboard', component: () => import('../views/Dashboard.vue'), meta: { requiresAuth: true } },
];

const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach((to, _from, next) => {
  if (to.meta?.requiresAuth) {
    const token = localStorage.getItem('access_token');
    if (!token) return next({ path: '/' });
  }
  next();
});

export default router;
