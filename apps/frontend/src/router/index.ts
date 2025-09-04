import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/login', component: () => import('../views/Login.vue') },
  { path: '/cadastro', component: () => import('../views/Cadastro.vue') },
  { path: '/', component: () => import('../views/Home.vue') },
];

const router = createRouter({ history: createWebHistory(), routes });

export default router;
