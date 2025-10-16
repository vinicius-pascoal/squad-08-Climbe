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
  const excludedRoutes = ['/', '/cadastro', '/auth']
  showSidebar.value = !excludedRoutes.includes(route.path?.toLowerCase())
})
</script>

<template>
  <div class="flex">
    <Sidebar v-if="showSidebar" :items="items" />

    <main class="flex-1 bg-gray-100 min-h-screen p-6">
      <div v-if="showSidebar" class="flex justify-end mb-4">
        <div>
          <button class="px-2 py-2 w-10 h-10 ">
            <img src="/img/chat.svg" alt="">
          </button>
          <button class="px-2 py-2 w-10 h-10 ">
            <img src="/img/acessibilidade.svg" alt="">
          </button>
          <button class="px-2 py-2 w-10 h-10 ">
            <img src="/img/duvida.svg" alt="">
          </button>
        </div>
        <div class="">
          <img src="/img/usuario.svg" alt="Avatar" class="w-10 h-10 rounded-full ml-4" />
        </div>
      </div>
      <RouterView />
    </main>
  </div>
  
</template>
