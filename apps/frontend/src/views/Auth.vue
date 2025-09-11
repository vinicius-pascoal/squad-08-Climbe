<template></template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(async () => {
	try {
		// Salva no localStorage
		const params = new URLSearchParams(window.location.search);
		const access_token = params.get('access_token');
		const user = params.get('user');
		if (!access_token || !user) {
			console.error('Nenhum token ou usuário encontrado na URL.');
			return;
		}
		
		//const userObj = JSON.parse(decodeURIComponent(userParam));

		// Salva no localStorage
		localStorage.setItem('access_token', access_token);
		localStorage.setItem('user', user);
		//localStorage.setItem('user', JSON.stringify(userObj));

		// Redireciona para Home
		router.push('/Home');
	} catch (err) {
		console.error('Erro ao autenticar:', err);
	}
});
</script>