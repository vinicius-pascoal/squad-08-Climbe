<template>
  <div class="grid gap-4 md:grid-cols-2">
    <div class="md:col-span-2">
      <FormField label="Nome" required>
        <input v-model.trim="model.name" type="text" class="input" placeholder="Nome fantasia" />
      </FormField>
    </div>

    <FormField label="CNPJ" required>
      <input :class="inputClass(errors.cnpj)" v-model="model.cnpj" @input="onCnpj" type="text" class="input" placeholder="00.000.000/0000-00" />
      <p v-if="errors.cnpj" class="mt-1 text-xs text-red-600">{{ errors.cnpj }}</p>
    </FormField>

    <FormField label="Telefone">
      <input :class="inputClass(errors.phone)" v-model="model.phone" @input="onPhone" type="text" class="input" placeholder="(00) 00000-0000" />
      <p v-if="errors.phone" class="mt-1 text-xs text-red-600">{{ errors.phone }}</p>
    </FormField>

    <div class="md:col-span-2">
      <FormField label="Razão Social">
        <input v-model.trim="model.corporateName" type="text" class="input" placeholder="Razão Social" />
      </FormField>
    </div>

    <div class="md:col-span-2">
      <FormField label="Email" required>
        <input :class="inputClass(errors.email)" v-model="model.email" @input="onEmail" type="email" class="input" placeholder="contato@empresa.com" />
      <p v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
      </FormField>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineModel, defineExpose, reactive } from 'vue'
import FormField from './_FormField.vue'
import { formatCNPJ, validateCNPJ, formatPhoneBR, validatePhoneBR, validateEmail } from '../../../utils/validators'
type Basic = { name: string; cnpj: string; phone: string; corporateName: string; email: string }
const model = defineModel<Basic>({ required: true })

const errors = reactive<{ cnpj?: string; phone?: string; email?: string }>({})

function inputClass(err?: string) {
  return err ? 'border-red-500 focus:ring-red-500' : ''
}
function onCnpj(e: Event){ model.value.cnpj = formatCNPJ((e.target as HTMLInputElement).value); errors.cnpj = validateCNPJ(model.value.cnpj) ? '' : 'CNPJ inválido'; }
function onPhone(e: Event){ model.value.phone = formatPhoneBR((e.target as HTMLInputElement).value); errors.phone = validatePhoneBR(model.value.phone) ? '' : 'Telefone inválido'; }
function onEmail(){ errors.email = validateEmail(model.value.email) ? '' : 'E-mail inválido'; }

function validate() { return !!model.value.name && validateCNPJ(model.value.cnpj) && validateEmail(model.value.email) }
defineExpose({ validate })
</script>

<style scoped>
.input { @apply w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none
         focus:border-sidebar focus:ring-2 focus:ring-sidebar/60; }
</style>