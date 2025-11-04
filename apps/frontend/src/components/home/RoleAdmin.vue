<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow dark:shadow-none stats-widget w-full h-full">
    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Auditoria do Sistema (Logs Recentes)</h3>
    <div class="space-y-3 text-sm font-mono bg-gray-800 text-gray-200 p-4 rounded-lg overflow-x-auto">
      <p><span class="text-blue-400">[2025-10-21 16:10:02]</span> <span class="text-green-400">USER_CREATE:</span>
        Usuário 'ceo' criou o usuário 'ana.paula'.</p>
      <p><span class="text-blue-400">[2025-10-21 16:08:51]</span> <span class="text-yellow-400">CONTRACT_EDIT:</span>
        Usuário 'compliance' editou o Contrato #2025-A80.</p>
      <p><span class="text-blue-400">[2025-10-21 16:05:15]</span> <span class="text-red-400">LOGIN_FAIL:</span>
        Tentativa de login falhou para o IP 192.168.1.10.</p>
      <p><span class="text-blue-400">[2025-10-21 16:02:30]</span> <span class="text-green-400">PROPOSAL_VALIDATE:</span>
        Usuário 'cfo' validou a Proposta #PC-014.</p>
    </div>
  </div>

  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow dark:shadow-none history-widget w-full h-full">
    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Atalhos de Admin</h3>
    <div class="grid grid-cols-2 gap-4">
      <button
        class="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-700 shadow-sm dark:shadow-transparent rounded-lg text-indigo-700 dark:text-indigo-200 transition-colors w-full text-center"><span
          class="mb-2">👤</span><span class="text-sm font-semibold">Criar Usuário</span></button>
      <button
        class="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-700 shadow-sm dark:shadow-transparent rounded-lg text-indigo-700 dark:text-indigo-200 transition-colors w-full text-center"><span
          class="mb-2">👥</span><span class="text-sm font-semibold">Gerenciar Perfis</span></button>
      <button
        class="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-700 shadow-sm dark:shadow-transparent rounded-lg text-indigo-700 dark:text-indigo-200 transition-colors w-full text-center"><span
          class="mb-2">🛡️</span><span class="text-sm font-semibold">Ver Permissões</span></button>
      <button
        class="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-700 shadow-sm dark:shadow-transparent rounded-lg text-indigo-700 dark:text-indigo-200 transition-colors w-full text-center"><span
          class="mb-2">📜</span><span class="text-sm font-semibold">Acessar Logs</span></button>
    </div>
  </div>

  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow dark:shadow-none actions-widget w-full h-full">
    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Painel Admin</h3>
    <p class="text-sm text-gray-500 dark:text-gray-300">Ações rápidas e gerenciamento global.</p>
  </div>
</template>

<script setup lang="ts">
// Componente que provê as áreas (stats, history, actions) já com as classes usadas pelo grid na Home
</script>

<style scoped></style>
