<template>
  <div class="widget p-6 stats-widget">
    <h3 class="text-lg font-bold text-gray-800 mb-4">Minhas Propostas Comerciais</h3>
    <div class="space-y-4">
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div class="flex-1">
          <p class="font-medium">Proposta #PC-018 (FutureTech)</p>
          <p class="text-sm text-gray-500">Status: <span class="font-medium text-yellow-600">Aguardando Validação
              (CFO)</span></p>
        </div>
        <div class="flex gap-2"><button
            class="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md">Ver</button></div>
      </div>
    </div>
  </div>

  <div class="widget p-6 history-widget">
    <h3 class="text-lg font-bold text-gray-800 mb-4">Atalhos</h3>
    <div class="grid grid-cols-2 gap-4">
      <button class="p-4 bg-green-50 rounded-lg text-green-700">Nova Proposta</button>
      <button class="p-4 bg-green-50 rounded-lg text-green-700">Ver Contratos</button>
    </div>
  </div>

  <div class="widget p-6 actions-widget">
    <h3 class="text-lg font-bold text-gray-800 mb-4">Relatórios</h3>
    <p class="text-sm text-gray-500">Acompanhe performance e conversões comerciais.</p>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
