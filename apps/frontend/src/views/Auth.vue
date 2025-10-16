<template></template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(async () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const access_token = params.get('access_token');
    const user = params.get('user');
    const google_access_token = params.get('google_access_token');

    if (!access_token || !user) {
      console.error('Nenhum token ou usuário encontrado na URL.');
      return router.push('/');
    }

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user', user);
    if (google_access_token) localStorage.setItem('google_access_token', google_access_token);

    router.push('/Home');
  } catch (err) {
    console.error('Erro ao autenticar:', err);
    router.push('/');
  }
});
</script>