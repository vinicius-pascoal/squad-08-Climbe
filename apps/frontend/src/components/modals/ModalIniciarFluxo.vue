<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div class="w-full max-w-xl rounded-xl bg-white p-5 shadow-xl">
      <header class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-slate-800">Iniciar fluxo de contrato</h3>
        <button class="text-slate-500 hover:text-slate-700" @click="$emit('close')">✕</button>
      </header>

      <form @submit.prevent="onSubmit" class="space-y-4">

        <div>
          <label class="block">
            <span class="mb-1 block text-xs font-medium text-slate-600">Nome da jornada</span>
            <input type="text" v-model="form.nome" placeholder="Ex: Jornada Empresa XYZ"
              class="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-sidebar focus:outline-none" />
          </label>
        </div>

        <div>
          <span class="mb-1 block text-xs font-medium text-slate-600">Participantes</span>
          <div class="relative">
            <input type="text" v-model="searchQuery" @input="onSearchInput" @focus="showDropdown = true"
              placeholder="Digite para buscar usuários..."
              class="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-sidebar focus:outline-none" />

            <!-- Dropdown de sugestões -->
            <div v-if="showDropdown && filteredUsuarios.length"
              class="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg">
              <button type="button" v-for="u in filteredUsuarios" :key="u.id" @click="selectUser(u)"
                class="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100">
                {{ u.nomeCompleto }} — {{ u.email }}
              </button>
            </div>
          </div>

          <!-- Usuários selecionados -->
          <div v-if="selectedUsuarios.length" class="mt-2 space-y-1">
            <div v-for="u in selectedUsuarios" :key="u.id"
              class="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <span class="text-sm text-slate-700">{{ u.nomeCompleto }} — {{ u.email }}</span>
              <button type="button" @click="removeUser(u.id)" class="text-red-500 hover:text-red-700">✕</button>
            </div>
          </div>

          <p class="mt-1 text-xs text-slate-500">Você será incluído automaticamente.</p>
        </div>

        <div>
          <label class="block">
            <span class="mb-1 block text-xs font-medium text-slate-600">Título da reunião</span>
            <input type="text" v-model="form.tituloReuniao" placeholder="Ex: Reunião inicial - Empresa XYZ"
              class="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-sidebar focus:outline-none" />
          </label>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <label class="block">
            <span class="mb-1 block text-xs font-medium text-slate-600">Data da reunião inicial</span>
            <input type="date" v-model="form.date" required
              class="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-sidebar focus:outline-none" />
          </label>
          <label class="block">
            <span class="mb-1 block text-xs font-medium text-slate-600">Hora</span>
            <input type="time" v-model="form.time" required
              class="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-sidebar focus:outline-none" />
          </label>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <label class="block">
            <span class="mb-1 block text-xs font-medium text-slate-600">Reunião presencial?</span>
            <select v-model="form.presencial"
              class="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-sidebar focus:outline-none">
              <option :value="true">Sim</option>
              <option :value="false">Não (Online)</option>
            </select>
          </label>
          <label class="block">
            <span class="mb-1 block text-xs font-medium text-slate-600">Local/Link</span>
            <input type="text" v-model="form.local" placeholder="Endereço ou link da reunião"
              class="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-sidebar focus:outline-none" />
          </label>
        </div>

        <div>
          <label class="block">
            <span class="mb-1 block text-xs font-medium text-slate-600">Pauta da reunião</span>
            <textarea v-model="form.pauta" rows="3" placeholder="Digite a pauta da reunião..."
              class="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-sidebar focus:outline-none resize-none"></textarea>
          </label>
        </div>

        <footer class="mt-4 flex justify-end gap-2">
          <button type="button" class="rounded-lg border border-slate-300 px-4 py-2 text-sm"
            @click="$emit('close')">Cancelar</button>
          <button type="submit" :disabled="submitting"
            class="rounded-lg bg-sidebar px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {{ submitting ? 'Iniciando...' : 'Iniciar fluxo' }}
          </button>
        </footer>
      </form>
    </div>
  </div>

</template>

<script setup lang="ts">
import { onMounted, reactive, ref, getCurrentInstance, computed } from 'vue'
import { http } from '../../lib/http'
import { startFlow } from '../../services/flow'
type Usuario = { id: number; nomeCompleto: string; email: string }

const props = defineProps<{}>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'started', flow: any): void }>()

const instance = getCurrentInstance();
const notify = (instance?.appContext.config.globalProperties as any)?.$notify;

const usuarios = ref<Usuario[]>([])
const submitting = ref(false)
const searchQuery = ref('')
const showDropdown = ref(false)
const selectedUsuarios = ref<Usuario[]>([])
const form = reactive({
  nome: '',
  participantIds: [] as number[],
  date: '',
  time: '',
  tituloReuniao: '',
  presencial: true,
  local: '',
  pauta: ''
})

const filteredUsuarios = computed(() => {
  if (!searchQuery.value.trim()) return usuarios.value;
  const query = searchQuery.value.toLowerCase();
  return usuarios.value.filter((u: Usuario) =>
    !selectedUsuarios.value.find((s: Usuario) => s.id === u.id) &&
    (u.nomeCompleto.toLowerCase().includes(query) || u.email.toLowerCase().includes(query))
  );
});

function onSearchInput() {
  showDropdown.value = true;
}

function selectUser(user: Usuario) {
  if (!selectedUsuarios.value.find((u: Usuario) => u.id === user.id)) {
    selectedUsuarios.value.push(user);
    form.participantIds.push(user.id);
  }
  searchQuery.value = '';
  showDropdown.value = false;
}

function removeUser(userId: number) {
  selectedUsuarios.value = selectedUsuarios.value.filter((u: Usuario) => u.id !== userId);
  form.participantIds = form.participantIds.filter((id: number) => id !== userId);
}

async function loadUsuarios() {
  const data = await http('/api/usuarios')
  usuarios.value = Array.isArray(data) ? data.map((u: any) => ({ id: u.id, nomeCompleto: u.nomeCompleto, email: u.email })) : []
}

function isoFromDateTime(date: string, time: string) {
  if (!date) return undefined
  try {
    const [y, m, d] = date.split('-').map(Number)
    let dt = new Date(y, (m || 1) - 1, d || 1)
    if (time) {
      const [hh, mm] = time.split(':').map(Number)
      dt.setHours(hh || 9, mm || 0, 0, 0)
    }
    return dt.toISOString()
  } catch { return undefined }
}

async function onSubmit() {
  try {
    if (!form.date || !form.time) {
      notify?.error?.('Data e hora da reunião são obrigatórios')
      return
    }
    submitting.value = true
    const scheduledAt = isoFromDateTime(form.date, form.time)
    const payload: any = {
      nome: form.nome || undefined,
      participantIds: form.participantIds,
      scheduledAt,
      reuniao: {
        titulo: form.tituloReuniao || form.nome || 'Reunião inicial',
        presencial: form.presencial,
        local: form.local || undefined,
        pauta: form.pauta || undefined
      }
    }
    const flow = await startFlow(payload)
    notify?.success?.('Jornada iniciada, reunião criada e participantes notificados')
    emit('started')
    emit('close')
  } catch (e: any) {
    notify?.error?.(e?.message || 'Falha ao iniciar jornada')
  } finally {
    submitting.value = false
  }
}

// Fechar dropdown ao clicar fora
function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (!target.closest('.relative')) {
    showDropdown.value = false;
  }
}

onMounted(() => {
  loadUsuarios();
  document.addEventListener('click', handleClickOutside);
});

</script>

<style scoped></style>
