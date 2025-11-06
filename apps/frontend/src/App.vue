<script setup lang="ts">
import { ref, watchEffect, computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import ThemeSwitch from './components/ThemeSwitch.vue'
import { hasPermission, currentUser } from './services/auth'

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

function isAdmin() {
  try { return currentUser.value?.cargoNome === 'Admin' || currentUser.value?.cargoNome === 'ADMIN'; } catch { return false }
}

function canShowItem(label: string) {
  // map labels to required permissions (any-of semantics)
  const map: Record<string, string[]> = {
    'Usuários': ['Usuários — Criar', 'Usuários — Aceitar/Aprovar', 'Usuários — Excluir'],
    'Contratos': ['Contratos — Visualizar'],
    'Propostas': ['Propostas Comerciais — Criar', 'Propostas Comerciais — Validar'],
    'Agenda': ['Reuniões — Agendar'],
    'Auditoria': ['Sistema — Acesso a Logs'],
    // 'Empresas' left open to Admin or any explicit perms (none in CSV), show to Admin by default
  }

  if (label === 'Home') return true;
  if (isAdmin()) return true;
  const reqs = map[label];
  if (!reqs) return true; // default show when no mapping
  return reqs.some(r => hasPermission(r));
}

const visibleItems = computed(() => items.filter(i => canShowItem(i.label)));

const route = useRoute()

const showSidebar = ref(true)

watchEffect(() => {
  const excludedRoutes = ['/', '/cadastro', '/auth']
  showSidebar.value = !excludedRoutes.includes(route.path?.toLowerCase())
})
</script>

<template>
  <div class="flex">
    <Sidebar v-if="showSidebar" :items="visibleItems" />

    <main class="flex-1 bg-gray-100 min-h-screen p-6">
      <div v-if="showSidebar" class="flex justify-end mb-4">
        <!--switch tema-->
        <div>
          <ThemeSwitch />
        </div>
        <div class="">
          <img src="/img/usuario.svg" alt="Avatar" class="w-10 h-10 rounded-full ml-4" />
        </div>
      </div>
      <RouterView />
    </main>
  </div>

</template>
