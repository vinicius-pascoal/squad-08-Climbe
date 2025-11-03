<template>
  <div class="widget p-6 stats-widget">
    <h3 class="text-lg font-bold text-gray-800 mb-4">Contratos Pendentes de Revisão</h3>
    <div class="space-y-4">
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div class="flex-1">
          <p class="font-medium">Revisar Contrato #2025-B12</p>
          <p class="text-sm text-gray-500">Solicitado por: Analista Silva</p>
        </div>
        <div class="flex gap-2"><button
            class="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md">Abrir</button></div>
      </div>
    </div>
  </div>

  <div class="widget p-6 history-widget">
    <h3 class="text-lg font-bold text-gray-800 mb-4">Atalhos de Compliance</h3>
    <div class="grid grid-cols-2 gap-4">
      <button class="p-4 bg-red-50 rounded-lg text-red-700">Novo Contrato</button>
      <button class="p-4 bg-red-50 rounded-lg text-red-700">Revisar Docs</button>
      <button class="p-4 bg-red-50 rounded-lg text-red-700">Aprovar Usuário</button>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
