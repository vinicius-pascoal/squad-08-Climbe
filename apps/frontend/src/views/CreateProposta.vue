<template>
  <div class="p-2 md:p-4">
    <nav class="text-sm mb-4 text-slate-500">
      <router-link to="/Propostas" class="hover:underline text-emerald-700 font-medium">Propostas</router-link>
      <span class="mx-2">›</span>
      <span class="text-slate-600">Criar Proposta</span>
    </nav>

    <h1 class="text-3xl font-bold text-slate-900 mb-6">Criar nova Proposta</h1>

    <div class="rounded-2xl bg-white shadow border border-slate-200">
      <form @submit.prevent="onSubmit" class="p-6 space-y-6">
        <section>
          <label class="block text-sm font-semibold text-slate-800 mb-2">Criar Proposta</label>
          <select v-model="form.empresaId" required class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="" disabled>Selecione uma empresa</option>
            <option v-for="e in empresas" :key="e.id" :value="e.id">{{ e.nomeFantasia || e.razaoSocial }}</option>
          </select>
        </section>

        <section>
          <label class="block text-sm font-semibold text-slate-800 mb-2">Anexo de Documento</label>
          <div
            class="rounded-xl border-2 border-dashed border-sky-200 bg-sky-50 p-6 text-slate-600"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="onDrop"
          >
            <div class="flex flex-col items-center justify-center gap-2 pointer-events-none select-none" :class="{ 'opacity-70': isDragging }">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 16v-7m0 0-3 3m3-3 3 3M6 19h12a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2h-1.5a5.5 5.5 0 0 0-11 0H4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2Z"/>
              </svg>
              <p class="text-sm">Arraste ou carregue o documento</p>
              <p v-if="fileName" class="text-xs text-slate-500 truncate max-w-full">
                Selecionado: <span class="font-medium text-slate-700">{{ fileName }}</span>
              </p>
              <input ref="fileInput" type="file" class="hidden" @change="onFileChange" />
              <button type="button" @click="fileInput?.click()" class="mt-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100">
                Escolher arquivo
              </button>
            </div>
          </div>
        </section>

        <section>
          <label class="block text-sm font-semibold text-slate-800 mb-2">Observações</label>
          <input v-model="form.observacoes" type="text" class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500" />
        </section>

        <div class="flex items-center justify-end gap-3 pt-2">
          <button type="button" @click="onCancel" class="rounded-lg bg-slate-200 text-slate-700 font-medium px-4 py-2">Cancelar</button>
          <button type="submit" :disabled="submitting" class="rounded-lg bg-emerald-700 text-white font-semibold px-6 py-2 disabled:opacity-60">Enviar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';

type Empresa = { id: number; razaoSocial?: string; nomeFantasia?: string };

const router = useRouter();
const _ins = getCurrentInstance();
const swal = _ins?.appContext.config.globalProperties.$swal as any;
const notify = _ins?.appContext.config.globalProperties.$notify as any;

const empresas = ref<Empresa[]>([]);
const isDragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const file = ref<File | null>(null);
const fileName = ref<string>('');

const form = reactive({
  empresaId: '' as unknown as number | '',
  observacoes: '' as string,
});
const submitting = ref(false);

async function loadEmpresas() {
  // TODO: integrar com backend (ex.: const data = await http<Empresa[]>('/api/empresas');)
  empresas.value = [
    { id: 1, nomeFantasia: 'ACME' },
    { id: 2, nomeFantasia: 'Globex' },
    { id: 3, nomeFantasia: 'Initech' },
  ];
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
  router.push('/Propostas');
}

async function onSubmit() {
  try {
    if (!form.empresaId) {
      await (swal?.fire?.({ icon: 'warning', title: 'Selecione uma empresa' }) || window.alert('Selecione uma empresa'));
      return;
    }
    if (!file.value) {
      await (swal?.fire?.({ icon: 'warning', title: 'Anexe um documento' }) || window.alert('Anexe um documento'));
      return;
    }
    submitting.value = true;

    // TODO: integrar backend com FormData
    await new Promise((r) => setTimeout(r, 600));

    await (swal?.fire?.({ icon: 'success', title: 'Proposta enviada com sucesso!' }) || window.alert('Proposta enviada com sucesso!'));
    router.push('/Propostas');
  } catch (e: any) {
    await (swal?.fire?.({ icon: 'error', title: 'Falha ao enviar', text: e?.message || 'Erro ao enviar a proposta.' }) || window.alert('Falha ao enviar'));
  } finally {
    submitting.value = false;
  }
}

onMounted(loadEmpresas);
</script>

<style scoped></style>
