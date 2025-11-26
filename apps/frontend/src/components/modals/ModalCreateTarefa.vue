<template>
  <div class="modal-overlay">
    <div class="modal-content max-w-2xl">
      <div class="flex items-start justify-between mb-4">
        <div>
          <h2 class="text-2xl font-bold">Cadastrar Tarefa</h2>
          <p class="text-sm text-slate-500">
            Crie uma nova tarefa vinculada à proposta
            <span v-if="propostaId" class="font-semibold text-emerald-600">#{{ propostaId }}</span>
          </p>
        </div>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-semibold text-slate-800 mb-1">Título <span
              class="text-red-500">*</span></label>
          <input v-model="form.titulo" type="text" required
            class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-800 mb-1">Descrição</label>
          <textarea v-model="form.descricao" rows="3"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-800 mb-1">Responsável</label>
          <div class="relative">
            <input v-model="userSearch" @input="onUserSearch" type="text" placeholder="Digite para buscar usuário"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500" />

            <ul v-if="showSuggestions"
              class="absolute z-50 left-0 right-0 bg-white border border-slate-200 rounded-md mt-1 max-h-48 overflow-auto">
              <li v-for="u in filteredUsers" :key="u.id" @click="selectUser(u)"
                class="px-3 py-2 hover:bg-slate-100 cursor-pointer truncate">
                {{ u.nomeCompleto || u.email }}
              </li>
              <li v-if="filteredUsers.length === 0" class="px-3 py-2 text-slate-500">Nenhum usuário encontrado</li>
            </ul>
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-800 mb-1">Categoria</label>
          <select v-model="form.categoria"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="">-- Selecionar --</option>
            <option v-for="opt in categories" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </div>

        <div class="flex items-center justify-end gap-3 pt-2">
          <button type="button" @click="$emit('close')"
            class="rounded-lg bg-slate-200 text-slate-700 font-medium px-4 py-2 hover:bg-slate-300 transition">Cancelar</button>
          <button type="submit"
            class="rounded-lg bg-emerald-700 text-white font-semibold px-6 py-2 hover:bg-emerald-800 disabled:opacity-60 disabled:cursor-not-allowed transition">
            {{ submitting ? 'Salvando...' : 'Cadastrar' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import { http } from '../../lib/http'
import { createTarefa } from '../../services/tarefa'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved', tarefa: any): void
}>()

const props = defineProps<{ propostaId: number }>()

const _ins = getCurrentInstance();
const notify = _ins?.appContext.config.globalProperties.$notify as any;

const form = ref({ titulo: '', descricao: '', usuarioId: undefined as number | undefined, categoria: '' })
const submitting = ref(false)

const users = ref<any[]>([])
const userSearch = ref('')
const showSuggestions = ref(false)

const filteredUsers = computed(() => {
  const term = userSearch.value.trim().toLowerCase()
  if (!term) return users.value.slice(0, 20)
  return users.value.filter(u => ((u.nomeCompleto || u.email) || '').toLowerCase().includes(term)).slice(0, 20)
})

const categories = [
  { value: 'DESENVOLVIMENTO', label: 'Desenvolvimento' },
  { value: 'DOCUMENTACAO', label: 'Documentação' },
  { value: 'MARKETING', label: 'Marketing' },
  { value: 'VENDAS', label: 'Vendas' },
  { value: 'UI_DESIGN', label: 'UI Design' },
]

async function loadUsers() {
  try {
    const data = await http('/api/usuarios')
    users.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.warn('Erro ao carregar usuários', e)
    users.value = []
  }
}

function onUserSearch() {
  showSuggestions.value = true
}

function selectUser(u: any) {
  form.value.usuarioId = u.id
  userSearch.value = u.nomeCompleto || u.email || ''
  showSuggestions.value = false
}

async function onSubmit() {
  if (!form.value.titulo) return
  submitting.value = true
  try {
    const payload: any = {
      titulo: form.value.titulo,
      descricao: form.value.descricao,
      propostaId: props.propostaId ? Number(props.propostaId) : undefined
    }
    if (form.value.usuarioId) payload.usuarioId = Number(form.value.usuarioId)
    if (form.value.categoria) payload.categoria = form.value.categoria

    console.log('Criando tarefa com payload:', payload)
    const res = await createTarefa(payload)
    console.log('Tarefa criada:', res)
    notify?.success('Tarefa criada e vinculada à proposta')
    emit('saved', res)
    emit('close')
  } catch (e: any) {
    console.error('Erro ao criar tarefa:', e)
    notify?.error(e?.message || 'Erro ao criar tarefa')
  } finally {
    submitting.value = false
  }
}

onMounted(loadUsers)
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  width: 95%;
  max-width: 800px
}
</style>
