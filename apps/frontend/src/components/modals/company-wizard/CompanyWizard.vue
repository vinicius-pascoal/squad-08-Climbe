<template>
  <transition name="fade">
    <div v-if="open" class="fixed inset-0 z-50 grid place-items-center">
      <div class="absolute inset-0 bg-black/40" @click="closeOnBackdrop ? close() : null"></div>
      <div class="relative z-10 w-[min(960px,95vw)] rounded-2xl bg-white p-6 shadow-xl">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-center text-xl font-semibold text-slate-800 w-full">Cadastro de Empresa</h2>
          <button class="absolute right-4 top-4 rounded-full p-1 text-slate-500 hover:bg-slate-100" @click="close"
            title="Fechar">✕</button>
        </div>

        <div class="mb-6">
          <div class="relative">
            <div class="absolute left-[7%] right-[7%] top-1/2 -z-10 h-1 -translate-y-1/2 rounded bg-slate-200"></div>
            <div class="flex items-center justify-between">
              <template v-for="(s, idx) in steps" :key="s.key">
                <div class="flex flex-col items-center">
                  <div :class="[
                    'grid size-10 place-items-center rounded-full border-2 text-sm font-semibold',
                    currentStep >= idx + 1 ? 'border-sidebar bg-sidebar text-white' : 'border-slate-300 bg-white text-slate-600'
                  ]">{{ idx + 1 }}</div>
                </div>
              </template>
            </div>
          </div>
        </div>

        <h3 class="mb-1 text-center text-base font-semibold text-slate-800">{{ steps[currentStep - 1].title }}</h3>
        <p class="mb-6 text-center text-xs text-slate-500">Preencha os dados abaixo para cadastrar sua empresa no
          sistema.</p>

        <div class="min-h-[320px]">
          <StepBasic v-if="currentStep === 1" ref="stepRef" v-model="form.basic" />
          <StepAddress v-else-if="currentStep === 2" ref="stepRef" v-model="form.address" />
          <StepRepresentative v-else-if="currentStep === 3" ref="stepRef" v-model="form.representative" />
          <StepExtra v-else-if="currentStep === 4" ref="stepRef" v-model="form.extra" />
          <StepConfirm v-else :form="form" />
        </div>

        <div class="mt-6 flex items-center justify-between">
          <button
            class="rounded-xl border border-slate-300 bg-slate-100 px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 disabled:opacity-60"
            :disabled="currentStep === 1 || loading" @click="prev">Anterior</button>

          <div class="flex items-center gap-3">
            <p v-if="error" class="text-xs text-red-600">{{ error }}</p>

            <button v-if="currentStep < 5"
              class="rounded-xl bg-sidebar px-5 py-2 text-sm font-semibold text-white shadow hover:bg-secondary disabled:opacity-60"
              :disabled="loading" @click="next">Próximo</button>

            <button v-else
              class="rounded-xl bg-sidebar px-5 py-2 text-sm font-semibold text-white shadow hover:bg-secondary disabled:opacity-60"
              :disabled="loading" @click="submit">
              <span v-if="!loading">Salvar</span>
              <span v-else>Salvando...</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits, reactive, ref } from 'vue'
import StepBasic from './StepBasic.vue'
import StepAddress from './StepAddress.vue'
import StepRepresentative from './StepRepresentative.vue'
import StepExtra from './StepExtra.vue'
import StepConfirm from './StepConfirm.vue'


type Basic = { name: string; cnpj: string; phone: string; corporateName: string; email: string }
type Address = { street: string; number: string; neighborhood: string; city: string; state: string; zip: string }
type Representative = { name: string; cpf: string; rg: string; email: string; phone1: string; phone2: string }
type Extra = { companySize: string; area: string; files: File[] }
type Payload = { basic: Basic; address: Address; representative: Representative; extra: Extra }

const props = withDefaults(defineProps<{ open: boolean; apiUrl?: string; closeOnBackdrop?: boolean }>(), {
  apiUrl: '/api/companies',
  closeOnBackdrop: true
})
const emit = defineEmits<{ (e: 'update:open', v: boolean): void; (e: 'saved'): void }>()

const open = computed({ get: () => props.open, set: (v: boolean) => emit('update:open', v) })
const steps = [
  { key: 'basic', title: 'Informações Básicas' },
  { key: 'address', title: 'Endereço' },
  { key: 'rep', title: 'Representante Legal' },
  { key: 'extra', title: 'Informações Adicionais' },
  { key: 'confirm', title: 'Confirmação e Salvamento' },
]

const currentStep = ref(1)
const loading = ref(false)
const error = ref<string | null>(null)

const form = reactive<Payload>({
  basic: { name: '', cnpj: '', phone: '', corporateName: '', email: '' },
  address: { street: '', number: '', neighborhood: '', city: '', state: '', zip: '' },
  representative: { name: '', cpf: '', rg: '', email: '', phone1: '', phone2: '' },
  extra: { companySize: '', area: '', files: [] },
})

const stepRef = ref<{ validate: () => Promise<boolean> | boolean } | null>(null)

function close() {
  open.value = false
}

async function next() {
  error.value = null
  const ok = (await stepRef.value?.validate?.()) ?? true
  if (!ok) { error.value = 'Verifique os campos obrigatórios.'; notify.warning('Preencha os campos obrigatórios.'); return }
  if (currentStep.value < 5) currentStep.value++
}

function prev() {
  error.value = null
  if (currentStep.value > 1) currentStep.value--
}

async function submit() {
  error.value = null
  loading.value = true
  try {
    const hasFiles = (form.extra.files?.length ?? 0) > 0
    if (hasFiles) {
      const fd = new FormData()
      fd.append('basic', JSON.stringify(form.basic))
      fd.append('address', JSON.stringify(form.address))
      fd.append('representative', JSON.stringify(form.representative))
      fd.append('extra', JSON.stringify({ companySize: form.extra.companySize, area: form.extra.area }))
      form.extra.files.forEach((f, i) => fd.append(`files[${i}]`, f, f.name))

      const res = await fetch(props.apiUrl!, { method: 'POST', body: fd })
      if (!res.ok) throw new Error(`Falha ao salvar (HTTP ${res.status})`)
    } else {
      const res = await fetch(props.apiUrl!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error(`Falha ao salvar (HTTP ${res.status})`)
    }
    notify.success('Empresa cadastrada com sucesso!');
    emit('saved')
    close()
  } catch (e: any) {
    error.value = e?.message ?? 'Erro ao salvar';
    notify.error(error.value)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .18s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
