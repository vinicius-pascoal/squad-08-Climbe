<template>
  <div class="grid gap-4 md:grid-cols-2">
    <div class="md:col-span-2">
      <FormField label="Nome" required>
        <input v-model.trim="model.name" type="text" class="input" />
      </FormField>
    </div>

    <FormField label="CPF" required>
      <input :class="inputClass(errors.cpf)" v-model="model.cpf" @input="onCPF" type="text" class="input" placeholder="000.000.000-00" />
      <p v-if="errors.cpf" class="mt-1 text-xs text-red-600">{{ errors.cpf }}</p>
    </FormField>

    <FormField label="RG">
      <input v-model.trim="model.rg" type="text" class="input" />
    </FormField>

    <FormField label="E-mail" required class="md:col-span-2">
      <input :class="inputClass(errors.email)" v-model="model.email" @input="onEmail" type="email" class="input" />
      <p v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
    </FormField>

    <FormField label="Telefone">
      <input :class="inputClass(errors.phone1)" v-model="model.phone1" @input="onPhone1" type="text" class="input" placeholder="(00) 00000-0000" />
      <p v-if="errors.phone1" class="mt-1 text-xs text-red-600">{{ errors.phone1 }}</p>
    </FormField>

    <FormField label="Telefone">
      <input :class="inputClass(errors.phone2)" v-model="model.phone2" @input="onPhone2" type="text" class="input" placeholder="(00) 00000-0000" />
      <p v-if="errors.phone2" class="mt-1 text-xs text-red-600">{{ errors.phone2 }}</p>
    </FormField>
  </div>
</template>

<script setup lang="ts">
import { defineModel, defineExpose, reactive } from 'vue'
import FormField from './_FormField.vue'
import { formatCPF, validateCPF, formatPhoneBR, validatePhoneBR, validateEmail } from '../../../utils/validators'
type Representative = { name: string; cpf: string; rg: string; email: string; phone1: string; phone2: string }
const model = defineModel<Representative>({ required: true })

const errors = reactive<{ cpf?: string; email?: string; phone1?: string; phone2?: string }>({})
function inputClass(err?: string){ return err ? 'border-red-500 focus:ring-red-500' : '' }
function onCPF(e: Event){ model.value.cpf = formatCPF((e.target as HTMLInputElement).value); errors.cpf = validateCPF(model.value.cpf) ? '' : 'CPF inválido'; }
function onEmail(){ errors.email = validateEmail(model.value.email) ? '' : 'E-mail inválido'; }
function onPhone1(e: Event){ model.value.phone1 = formatPhoneBR((e.target as HTMLInputElement).value); errors.phone1 = model.value.phone1 ? (validatePhoneBR(model.value.phone1) ? '' : 'Telefone inválido') : ''; }
function onPhone2(e: Event){ model.value.phone2 = formatPhoneBR((e.target as HTMLInputElement).value); errors.phone2 = model.value.phone2 ? (validatePhoneBR(model.value.phone2) ? '' : 'Telefone inválido') : ''; }

function validate() { return !!model.value.name && validateCPF(model.value.cpf) && validateEmail(model.value.email) }
defineExpose({ validate })
</script>

<style scoped>
.input { @apply w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none
         focus:border-sidebar focus:ring-2 focus:ring-sidebar/60; }
</style>