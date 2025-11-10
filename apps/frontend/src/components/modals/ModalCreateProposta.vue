<template>
  <div class="modal-overlay">
    <div class="modal-content max-w-3xl">
      <div class="flex items-start justify-between mb-4">
        <div>
          <h2 class="text-2xl font-bold">Criar nova Proposta</h2>
          <p class="text-sm text-slate-500">Preencha as informações para criar uma proposta</p>
        </div>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="rounded-2xl bg-white shadow border border-slate-200 p-0">
        <form @submit.prevent="onSubmit" class="p-6 space-y-6">
          <section>
            <label class="block text-sm font-semibold text-slate-800 mb-2">
              Empresa <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input type="text" v-model="companySearch" @input="onCompanySearch"
                placeholder="Digite para buscar empresa"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500" />

              <ul v-if="showSuggestions"
                class="absolute z-50 left-0 right-0 bg-white border border-slate-200 rounded-md mt-1 max-h-48 overflow-auto">
                <li v-for="c in filteredCompanies" :key="c.id" @click="selectCompany(c)"
                  class="px-3 py-2 hover:bg-slate-100 cursor-pointer truncate">
                  {{ c.nomeFantasia || c.razaoSocial }}
                </li>
                <li v-if="filteredCompanies.length === 0" class="px-3 py-2 text-slate-500">Nenhuma empresa encontrada
                </li>
              </ul>
            </div>
            <p class="text-xs text-slate-500 mt-1">Selecione a empresa para a qual a proposta será criada</p>
          </section>

          <section>
            <label class="block text-sm font-semibold text-slate-800 mb-2">
              Anexo de Documento (Opcional)
            </label>
            <div class="rounded-xl border-2 border-dashed border-sky-200 bg-sky-50 p-6 text-slate-600"
              @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @drop.prevent="onDrop">
              <div class="flex flex-col items-center justify-center gap-2 pointer-events-none select-none"
                :class="{ 'opacity-70': isDragging }">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12 16v-7m0 0-3 3m3-3 3 3M6 19h12a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2h-1.5a5.5 5.5 0 0 0-11 0H4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2Z" />
                </svg>
                <p class="text-sm">Arraste ou carregue o documento (PDF, DOC, DOCX)</p>
                <p v-if="fileName" class="text-xs text-slate-500 truncate max-w-full">
                  Selecionado: <span class="font-medium text-slate-700">{{ fileName }}</span>
                </p>
                <input ref="fileInput" type="file" class="hidden" accept=".pdf,.doc,.docx" @change="onFileChange" />
                <button type="button" @click="fileInput?.click()"
                  class="mt-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100 pointer-events-auto">
                  Escolher arquivo
                </button>
              </div>
            </div>
            <p class="text-xs text-slate-500 mt-1">O documento poderá ser anexado posteriormente</p>
          </section>

          <div class="flex items-center justify-end gap-3 pt-2">
            <button type="button" @click="onCancel"
              class="rounded-lg bg-slate-200 text-slate-700 font-medium px-4 py-2 hover:bg-slate-300 transition">
              Cancelar
            </button>
            <button v-if="hasPermission('Propostas Comerciais — Criar')" type="submit"
              :disabled="submitting || !form.empresaId"
              class="rounded-lg bg-emerald-700 text-white font-semibold px-6 py-2 hover:bg-emerald-800 disabled:opacity-60 disabled:cursor-not-allowed transition">
              {{ submitting ? 'Criando...' : 'Criar Proposta' }}
            </button>
            <button v-else disabled class="rounded-lg bg-slate-300 text-white font-semibold px-6 py-2 opacity-60">Sem
              permissão</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, getCurrentInstance } from 'vue';
import { http } from '../../lib/http';
import { hasPermission } from '../../services/auth';
import { drivePost } from '../../services/drive';

type Empresa = { id: number; razaoSocial?: string; nomeFantasia?: string };

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'saved', proposta: any): void;
}>();
const _ins = getCurrentInstance();
const notify = _ins?.appContext.config.globalProperties.$notify as any;

const empresas = ref<Empresa[]>([]);
const isDragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const file = ref<File | null>(null);
const fileName = ref<string>('');

const companySearch = ref('');
const showSuggestions = ref(false);

const form = reactive({ empresaId: '' as unknown as number | '' });
const submitting = ref(false);

const filteredCompanies = computed(() => {
  const term = companySearch.value.trim().toLowerCase();
  if (!term) return empresas.value.slice(0, 10);
  return empresas.value.filter((e) => ((e.nomeFantasia || e.razaoSocial) || '').toLowerCase().includes(term));
});

async function loadEmpresas() {
  try {
    const data = await http('/api/empresas');
    empresas.value = Array.isArray(data) ? data : [];
  } catch (error: any) {
    notify?.error(`Erro ao carregar empresas: ${error.message}`);
  }
}

function onDrop(ev: DragEvent) {
  isDragging.value = false;
  const f = ev.dataTransfer?.files?.[0];
  if (f) {
    file.value = f;
    fileName.value = f.name;
  }
}
function onFileChange(ev: Event) {
  const input = ev.target as HTMLInputElement;
  const f = input?.files?.[0] || null;
  file.value = f;
  fileName.value = f?.name || '';
}

function onCancel() {
  emit('close');
}

function onCompanySearch() {
  showSuggestions.value = true;
}

function selectCompany(c: Empresa) {
  form.empresaId = c.id as any;
  companySearch.value = c.nomeFantasia || c.razaoSocial || '';
  showSuggestions.value = false;
}

function readFileAsBase64(f: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // result is data:[mime];base64,AAAA
      const idx = result.indexOf(',');
      const b64 = idx >= 0 ? result.slice(idx + 1) : result;
      resolve(b64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(f);
  });
}

async function onSubmit() {
  try {
    if (!form.empresaId) {
      notify?.warning('Selecione uma empresa');
      return;
    }

    submitting.value = true;

    const payload: any = { empresaId: Number(form.empresaId) };

    if (file.value) {
      // upload to backend drive endpoint
      try {
        const base64 = await readFileAsBase64(file.value);
        const url = await drivePost(fileName.value || file.value.name, base64, file.value.type || 'application/octet-stream', true);
        if (url) {
          payload.documentoUrl = url;
        }
      } catch (err: any) {
        console.error('Erro ao enviar documento:', err);
        notify?.warning('Não foi possível enviar o documento. A proposta será criada sem anexo.');
      }
    }

    const proposta = await http('/api/propostas', { method: 'POST', body: JSON.stringify(payload) });

    notify?.success('Proposta criada com sucesso!');
    emit('saved', proposta);
    emit('close');
  } catch (e: any) {
    const message = e?.message || 'Erro ao criar a proposta.';
    notify?.error(message);
  } finally {
    submitting.value = false;
  }
}

onMounted(loadEmpresas);
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
  max-width: 900px
}
</style>
