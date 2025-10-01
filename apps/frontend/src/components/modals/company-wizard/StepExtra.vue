<template>
  <div class="grid gap-4 md:grid-cols-2">
    <FormField label="Porte da Empresa">
      <input v-model.trim="model.companySize" type="text" class="input" placeholder="MEI, ME, EPP..." />
    </FormField>

    <FormField label="Área de Atuação">
      <input v-model.trim="model.area" type="text" class="input" placeholder="Comércio, Serviços..." />
    </FormField>

    <div class="md:col-span-2">
      <FormField label="Upload de Documentos">
        <input type="file" multiple @change="onFiles" class="block w-full text-sm" />
        <ul v-if="model.files.length" class="mt-2 list-inside list-disc text-xs text-slate-600">
          <li v-for="f in model.files" :key="f.name">{{ f.name }}</li>
        </ul>
      </FormField>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineModel, defineExpose } from 'vue'
import FormField from './_FormField.vue'
type Extra = { companySize: string; area: string; files: File[] }
const model = defineModel<Extra>({ required: true })
function onFiles(e: Event) {
  const files = (e.target as HTMLInputElement).files
  model.value.files = files ? Array.from(files) : []
}
function validate() { return true }
defineExpose({ validate })
</script>

<style scoped>
.input { @apply w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none
         focus:border-sidebar focus:ring-2 focus:ring-sidebar/60; }
</style>