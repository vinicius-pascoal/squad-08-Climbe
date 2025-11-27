<template>
  <div class="modal-overlay">
    <div class="modal-content max-w-3xl">
      <div class="flex items-start justify-between mb-4">
        <div>
          <h2 class="text-2xl font-bold">Cadastro de usuário</h2>
          <p class="text-sm text-slate-500">Crie um novo usuário e defina cargo e permissões</p>
        </div>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="h-full bg-white p-6 rounded-lg">
        <div class="flex justify-end mb-4">
          <button @click="salvar" :disabled="loading"
            class="shadow bg-brand-c7d6fa border border-brand-4167c0 text-brand-2b5ddf rounded-lg px-4 py-2">Salvar</button>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <div class="flex flex-col gap-4">
            <div>
              <label class="font-bold text-sm">Nome Completo</label>
              <input v-model="form.nomeCompleto" class="w-full rounded border px-2 py-2" />
            </div>
            <div>
              <label class="font-bold text-sm">Cargo</label>
              <select v-model="form.cargoId" class="w-full rounded border px-2 py-2">
                <option value="" disabled>Selecione o cargo</option>
                <option v-for="c in cargos" :key="c.id" :value="c.id">{{ c.nomeCargo }}</option>
              </select>
            </div>
            <div>
              <label class="font-bold text-sm">Email</label>
              <input v-model="form.email" type="email" class="w-full rounded border px-2 py-2" />
            </div>
            <div>
              <label class="font-bold text-sm">Senha</label>
              <input v-model="form.senha" type="password" class="w-full rounded border px-2 py-2" />
            </div>
          </div>

          <div class="flex flex-col gap-4">
            <div>
              <label class="font-bold text-sm">Telefone</label>
              <input v-model="form.contato" class="w-full rounded border px-2 py-2" />
            </div>
            <div>
              <label class="font-bold text-sm">Status</label>
              <select v-model="statusSelecionado" class="w-full rounded border px-2 py-2">
                <option value="ativo">Ativo</option>
                <option value="pendente">Pendente</option>
                <option value="desativado">Desativado</option>
              </select>
            </div>

            <div class="mt-4">
              <h3 class="font-bold mb-2">Permissões</h3>
              <div class="grid grid-cols-2 gap-2">
                <label><input type="checkbox" v-model="permissions.criarPropostas" /> Criar Propostas</label>
                <label><input type="checkbox" v-model="permissions.acessarCalendario" /> Acessar Calendário</label>
                <label><input type="checkbox" v-model="permissions.visualizarContratos" /> Visualizar Contratos</label>
                <label><input type="checkbox" v-model="permissions.excluirUsuarios" /> Excluir Usuários</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, getCurrentInstance } from 'vue';
const emit = defineEmits(['close']);
import { http } from '../../lib/http';

const _ins = getCurrentInstance();
const notify = _ins?.appContext.config.globalProperties.$notify as any;

const form = reactive({ nomeCompleto: '', email: '', senha: '', contato: '', cargoId: '' });
const statusSelecionado = ref('pendente');
const cargos = ref<any[]>([]);
const permissions = reactive({ criarPropostas: true, acessarCalendario: true, visualizarContratos: true, excluirUsuarios: false });
const loading = ref(false);

function mapStatusToSituacao(status: string) {
  const s = String(status).toLowerCase();
  if (s === 'ativo') return 'aprovado';
  if (s === 'pendente') return 'pendente';
  return 'desativado';
}

async function carregarCargos() {
  try {
    const data = await http('/api/cargos');
    cargos.value = Array.isArray(data) ? data : [];
  } catch (e: any) {
    console.warn('Falha ao carregar cargos:', e?.message || e);
    cargos.value = [];
  }
}

async function salvar() {
  try {
    if (!form.nomeCompleto || !form.email || !form.senha || !form.cargoId) {
      notify?.warning('Preencha nome, email, senha e cargo.');
      return;
    }

    loading.value = true;
    const payload = {
      nomeCompleto: form.nomeCompleto.trim(),
      email: form.email.trim(),
      contato: form.contato?.trim() || null,
      senha: form.senha,
      cargoId: Number(form.cargoId),
      situacao: mapStatusToSituacao(statusSelecionado.value),
    };

    await http('/api/usuarios/admin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

    notify?.success('Usuário criado com sucesso!');
    emit('close');
  } catch (e: any) {
    console.error(e);
    notify?.error(e?.message || 'Falha ao criar usuário.');
  } finally {
    loading.value = false;
  }
}


onMounted(() => carregarCargos());
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  width: 95%;
  max-width: 900px
}

.dark .modal-content {
  background: linear-gradient(244.47deg, #2F3C60 3.97%, #222A3F 24.52%, #1F263A 50.41%, #1F2638 70.95%);
  border: 1px solid #485780;
  box-shadow: 0px 4px 4px 0px #00000040;
  color: var(--text);
}

.dark .modal-content h2,
.dark .modal-content p,
.dark .modal-content label {
  color: var(--text);
}

.dark .modal-content input,
.dark .modal-content select {
  background-color: #57648E;
  border-color: #485780;
  color: var(--text);
}

.dark .modal-content input::placeholder {
  color: var(--muted);
}

.dark .modal-content button:not(.btn-secondary) {
  color: var(--text);
}
</style>
