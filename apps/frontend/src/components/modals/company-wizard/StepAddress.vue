<template>
  <div class="grid gap-4 md:grid-cols-2">
    <div class="md:col-span-2">
      <FormField label="Logradouro" required>
        <input v-model.trim="model.street" type="text" class="input" placeholder="Rua, Avenida..." />
      </FormField>
    </div>

    <FormField label="Número">
      <input v-model.trim="model.number" type="text" class="input" />
    </FormField>

    <FormField label="Bairro">
      <input v-model.trim="model.neighborhood" type="text" class="input" />
    </FormField>

    <FormField label="Cidade" required>
      <input v-model.trim="model.city" type="text" class="input" />
    </FormField>

    <FormField label="UF" required>
      <input :class="inputClass(errors.state)" v-model="model.state" @input="onUF" maxlength="2" class="input uppercase" placeholder="UF" />
      <p v-if="errors.state" class="mt-1 text-xs text-red-600">{{ errors.state }}</p>
    </FormField>

    <FormField label="CEP" required class="md:col-span-2">
      <input :class="inputClass(errors.zip)" v-model="model.zip" @input="onCEP" type="text" class="input" placeholder="00000-000" />
      <p v-if="errors.zip" class="mt-1 text-xs text-red-600">{{ errors.zip }}</p>
    </FormField>
  </div>
</template>

<script setup lang="ts">
import { defineModel, defineExpose, reactive } from 'vue'
import FormField from './_FormField.vue'
import { formatCEP, validateCEP, formatUF, validateUF } from '../../../utils/validators'
type Address = { street: string; number: string; neighborhood: string; city: string; state: string; zip: string }
const model = defineModel<Address>({ required: true })

const errors = reactive<{ zip?: string; state?: string }>({})
function inputClass(err?: string){ return err ? 'border-red-500 focus:ring-red-500' : '' }
function onCEP(e: Event){ model.value.zip = formatCEP((e.target as HTMLInputElement).value); errors.zip = validateCEP(model.value.zip) ? '' : 'CEP inválido'; }
function onUF(e: Event){ model.value.state = formatUF((e.target as HTMLInputElement).value); errors.state = validateUF(model.value.state) ? '' : 'UF inválida'; }

function validate() { return !!model.value.street && !!model.value.city && validateUF(model.value.state) && validateCEP(model.value.zip) }
defineExpose({ validate })
</script>

<style scoped>
.input { @apply w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none
         focus:border-sidebar focus:ring-2 focus:ring-sidebar/60; }
.uppercase { text-transform: uppercase; }
</style>