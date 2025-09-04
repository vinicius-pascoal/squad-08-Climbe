<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue'

// Caminhos dos ícones
const home = '/icones/home.svg'
const contrato = '/icones/contrato.svg'
const usuarios = '/icones/usuarios.svg'
const propostas = '/icones/propostas.svg'
const agenda = '/icones/agenda.svg'
const empresas = '/icones/empresas.svg'
const auditoria = '/icones/auditoria.svg'

// Definindo os itens de navegação
const items = [
  { label: 'Home', to: '/home', icon: home },
  { label: 'Usuários', to: '/usuarios', icon: usuarios },
  { label: 'Agenda', to: '/agenda', icon: agenda },
  { label: 'Contratos', to: '/contratos', icon: contrato },
  { label: 'Propostas', to: '/propostas', icon: propostas },
  { label: 'Empresas', to: '/empresas', icon: empresas },
  { label: 'Auditoria', to: '/auditoria', icon: auditoria },
]

const route = useRoute()

const showSidebar = ref(true)

watchEffect(() => {
  const excludedRoutes = ['/', '/cadastro']
  showSidebar.value = !excludedRoutes.includes(route.path)
})
</script>

<template>
  <div class="flex">
    <Sidebar v-if="showSidebar" :items="items" />

    <main class="flex-1 bg-gray-100 min-h-screen p-6">
      <RouterView />
    </main>
  </div>
</template>
