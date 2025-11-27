<script setup>
import { ref, watch, computed } from 'vue';
import { http } from '../../lib/http';

const props = defineProps({
  user: { type: Object, required: true },
  cargos: { type: Array, default: () => [] }
});

const emit = defineEmits(['close', 'updated']);

const form = ref({
  nomeCompleto: '',
  email: '',
  cargoId: null,
  situacao: '',
  senha: '',
  confirmarSenha: ''
});

const loading = ref(false);
const error = ref('');
const permissoes = ref([]);

// Preenche o formulário quando o usuário muda
watch(() => props.user, (newUser) => {
  if (newUser) {
    form.value = {
      nomeCompleto: newUser.nomeCompleto || '',
      email: newUser.email || '',
      cargoId: newUser.cargoId || (newUser.cargo?.id || null),
      situacao: newUser.situacao || 'pendente',
      senha: '',
      confirmarSenha: ''
    };
    permissoes.value = newUser.usuarioPermissoes?.map(up => up.permissao) || [];
  }
}, { immediate: true });

const statusOptions = computed(() => [
  { value: 'aprovado', label: 'Ativo' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'desativado', label: 'Desativado' }
]);

const handleSubmit = async () => {
  error.value = '';

  if (!form.value.nomeCompleto || !form.value.email) {
    error.value = 'Nome e email são obrigatórios';
    return;
  }

  // Validação de senha se preenchida
  if (form.value.senha || form.value.confirmarSenha) {
    if (form.value.senha !== form.value.confirmarSenha) {
      error.value = 'As senhas não coincidem';
      return;
    }
    if (form.value.senha.length < 8) {
      error.value = 'A senha deve ter no mínimo 8 caracteres';
      return;
    }
  }

  loading.value = true;

  try {
    const payload = {
      nomeCompleto: form.value.nomeCompleto,
      email: form.value.email,
      cargoId: form.value.cargoId ? Number(form.value.cargoId) : null,
      situacao: form.value.situacao
    };

    // Adiciona senha apenas se foi preenchida
    if (form.value.senha) {
      payload.senha = form.value.senha;
    }

    await http(`/api/usuarios/${props.user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    emit('updated');
    emit('close');
  } catch (e) {
    error.value = e?.message || 'Erro ao atualizar usuário';
  } finally {
    loading.value = false;
  }
};

const handleClose = () => {
  emit('close');
};
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    @click.self="handleClose">
    <div
      class="bg-white dark:bg-brand-0a0a0a rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-brand-e5e7eb dark:border-brand-0e9989 m-4">
      <!-- Header -->
      <div
        class="sticky top-0 bg-brand-f0f4ff dark:bg-brand-0e9a97 px-6 py-4 border-b border-brand-e5e7eb dark:border-brand-0e9989 flex items-center justify-between">
        <h2 class="text-2xl font-bold text-brand-000 dark:text-white">Editar Usuário</h2>
        <button @click="handleClose"
          class="w-8 h-8 flex items-center justify-center rounded-lg text-brand-5f6060 dark:text-white hover:bg-brand-e5e7eb dark:hover:bg-brand-0e9989 transition">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Nome Completo -->
          <div>
            <label class="block text-sm font-medium text-brand-5f6060 dark:text-brand-e5e7eb mb-2">
              Nome Completo *
            </label>
            <input v-model="form.nomeCompleto" type="text" required
              class="w-full px-4 py-2 rounded-lg border border-brand-e5e7eb dark:border-brand-0e9989 bg-brand-f6f7f8 dark:bg-brand-0e9989 text-brand-000 dark:text-white placeholder-brand-5f6060 dark:placeholder-brand-e5e7eb focus:ring-2 focus:ring-brand-14b8a6 dark:focus:ring-brand-0e9a97 outline-none transition" />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-brand-5f6060 dark:text-brand-e5e7eb mb-2">
              Email *
            </label>
            <input v-model="form.email" type="email" required
              class="w-full px-4 py-2 rounded-lg border border-brand-e5e7eb dark:border-brand-0e9989 bg-brand-f6f7f8 dark:bg-brand-0e9989 text-brand-000 dark:text-white placeholder-brand-5f6060 dark:placeholder-brand-e5e7eb focus:ring-2 focus:ring-brand-14b8a6 dark:focus:ring-brand-0e9a97 outline-none transition" />
          </div>

          <!-- Cargo -->
          <div>
            <label class="block text-sm font-medium text-brand-5f6060 dark:text-brand-e5e7eb mb-2">
              Cargo
            </label>
            <select v-model="form.cargoId"
              class="w-full px-4 py-2 rounded-lg border border-brand-e5e7eb dark:border-brand-0e9989 bg-brand-f6f7f8 dark:bg-brand-0e9989 text-brand-000 dark:text-white focus:ring-2 focus:ring-brand-14b8a6 dark:focus:ring-brand-0e9a97 outline-none transition">
              <option :value="null">Selecione um cargo</option>
              <option v-for="cargo in cargos" :key="cargo.id" :value="cargo.id">
                {{ cargo.nomeCargo }}
              </option>
            </select>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-brand-5f6060 dark:text-brand-e5e7eb mb-2">
              Status
            </label>
            <select v-model="form.situacao"
              class="w-full px-4 py-2 rounded-lg border border-brand-e5e7eb dark:border-brand-0e9989 bg-brand-f6f7f8 dark:bg-brand-0e9989 text-brand-000 dark:text-white focus:ring-2 focus:ring-brand-14b8a6 dark:focus:ring-brand-0e9a97 outline-none transition">
              <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- Seção de Alteração de Senha -->
          <div class="pt-4 border-t border-brand-e5e7eb dark:border-brand-0e9989">
            <h3 class="text-lg font-semibold text-brand-000 dark:text-white mb-4">
              Alterar Senha
            </h3>
            <p class="text-xs text-brand-5f6060 dark:text-brand-e5e7eb mb-4">
              Deixe em branco para manter a senha atual
            </p>

            <!-- Nova Senha -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-brand-5f6060 dark:text-brand-e5e7eb mb-2">
                Nova Senha
              </label>
              <input v-model="form.senha" type="password" autocomplete="new-password"
                class="w-full px-4 py-2 rounded-lg border border-brand-e5e7eb dark:border-brand-0e9989 bg-brand-f6f7f8 dark:bg-brand-0e9989 text-brand-000 dark:text-white placeholder-brand-5f6060 dark:placeholder-brand-e5e7eb focus:ring-2 focus:ring-brand-14b8a6 dark:focus:ring-brand-0e9a97 outline-none transition"
                placeholder="Mínimo 8 caracteres" />
            </div>

            <!-- Confirmar Senha -->
            <div>
              <label class="block text-sm font-medium text-brand-5f6060 dark:text-brand-e5e7eb mb-2">
                Confirmar Nova Senha
              </label>
              <input v-model="form.confirmarSenha" type="password" autocomplete="new-password"
                class="w-full px-4 py-2 rounded-lg border border-brand-e5e7eb dark:border-brand-0e9989 bg-brand-f6f7f8 dark:bg-brand-0e9989 text-brand-000 dark:text-white placeholder-brand-5f6060 dark:placeholder-brand-e5e7eb focus:ring-2 focus:ring-brand-14b8a6 dark:focus:ring-brand-0e9a97 outline-none transition"
                placeholder="Confirme a nova senha" />
            </div>
          </div>

          <!-- Permissões (apenas visualização) -->
          <div v-if="permissoes.length > 0">
            <label class="block text-sm font-medium text-brand-5f6060 dark:text-brand-e5e7eb mb-2">
              Permissões Atuais
            </label>
            <div class="flex flex-wrap gap-2">
              <span v-for="(perm, idx) in permissoes" :key="idx"
                class="px-3 py-1 rounded-full text-xs font-medium bg-brand-cad8fd dark:bg-brand-14b8a6 text-brand-3b67d0 dark:text-white">
                {{ perm.nome || perm.descricao }}
              </span>
            </div>
            <p class="text-xs text-brand-5f6060 dark:text-brand-e5e7eb mt-2">
              As permissões são gerenciadas através do cargo atribuído
            </p>
          </div>

          <!-- Error Message -->
          <div v-if="error"
            class="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-brand-e5e7eb dark:border-brand-0e9989">
            <button type="button" @click="handleClose" :disabled="loading"
              class="px-6 py-2 rounded-lg border border-brand-e5e7eb dark:border-brand-0e9989 text-brand-5f6060 dark:text-white hover:bg-brand-f6f7f8 dark:hover:bg-brand-0e9989 disabled:opacity-50 disabled:cursor-not-allowed transition">
              Cancelar
            </button>
            <button type="submit" :disabled="loading"
              class="px-6 py-2 rounded-lg bg-brand-cad8fd dark:bg-brand-14b8a6 border border-brand-3b67d0 dark:border-brand-0e9989 text-brand-3b67d0 dark:text-white font-semibold hover:bg-brand-93c5fd dark:hover:bg-brand-16c3af disabled:opacity-50 disabled:cursor-not-allowed transition">
              {{ loading ? 'Salvando...' : 'Salvar Alterações' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
