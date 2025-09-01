<template>
  <div class="p-6 text-white">
    <h1 class="text-2xl font-semibold">Dashboard</h1>
    <p class="mt-2 opacity-80">Você está autenticado.</p>
    <button class="mt-6 bg-white/10 hover:bg-white/20 px-4 py-2 rounded" @click="logout">Sair</button>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
  router.replace('/');
}
</script>
<style scoped>
:host, body { background: #0b0b0b; }
</style>
