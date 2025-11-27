<template>
  <div class="w-full">
    <h1 class="font-bold text-[40px] text-[var(--text)] mb-6">Perfil do usuário</h1>

    <div class="flex justify-between items-center mb-6">
      <div class="flex items-start gap-4">
        <p class="text-[var(--accent)]">Perfil</p>
        <p class="text-[var(--accent)]">></p>
        <p class="text-[var(--muted)]">Meu perfil</p>
      </div>
      <div class="flex justify-end items-center">
        <button @click="showPasswordModal = true"
          class="shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-[var(--accent)] border border-[var(--accent)] text-white font-bold text-[18px] rounded-lg px-6 h-[40px] cursor-pointer hover:opacity-90 transition">
          Alterar Senha
        </button>
      </div>
    </div>

    <div class="flex w-full gap-6">
      <div class="flex flex-col flex-1">
        <div
          class="rounded-lg shadow-lg bg-[var(--panel)] border border-[var(--border)] overflow-hidden transition-colors">
          <div class="bg-[var(--card)] px-6 py-4 border-b border-[var(--border)]">
            <h2 class="text-xl font-bold text-[var(--text)]">Ações Recentes</h2>
          </div>
          <div class="p-6">
            <div v-if="!acoes.length" class="text-center py-8 text-[var(--muted)]">
              Nenhuma ação registrada
            </div>
            <div v-else class="space-y-3">
              <div v-for="acao in acoes" :key="acao.id"
                class="flex items-start gap-4 p-4 rounded-lg bg-[var(--card)] hover:opacity-80 transition-colors">
                <div class="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center">
                  <span class="text-lg">📋</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-[var(--text)]">{{ acao.açao }}</p>
                  <p class="text-xs text-[var(--muted)] mt-1">{{ acao.data_hora }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-6 w-full max-w-md">
        <div
          class="flex flex-col items-center gap-4 rounded-lg shadow-lg bg-[var(--panel)] border border-[var(--border)] p-6 transition-colors">
          <div class="relative">
            <img src="/img/usuario.svg" alt="Avatar" class="w-24 h-24 rounded-full border-4 border-[var(--accent)]" />
            <div class="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-[var(--panel)]">
            </div>
          </div>
          <div class="text-center">
            <h1 class="text-2xl font-bold text-[var(--text)]">{{ user?.nome || 'Usuário' }}</h1>
            <p class="text-sm text-[var(--muted)] mt-1">{{ user?.email || 'email@exemplo.com' }}</p>
          </div>
          <div class="w-full pt-4 border-t border-[var(--border)]">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-[var(--muted)]">Cargo:</span>
              <span class="text-sm font-semibold text-[var(--text)]">{{ user?.cargoNome || 'Não definido'
                }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-[var(--muted)]">Status:</span>
              <span class="inline-flex items-center gap-1 text-sm font-semibold text-green-600 dark:text-green-400">
                <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                Ativo
              </span>
            </div>
          </div>
        </div>

        <div
          class="flex flex-col gap-3 rounded-lg shadow-lg bg-[var(--panel)] border border-[var(--border)] overflow-hidden transition-colors">
          <div class="bg-[var(--card)] px-6 py-4 border-b border-[var(--border)]">
            <h2 class="text-xl font-bold text-[var(--text)] flex items-center gap-2">
              🔐 Minhas Permissões
            </h2>
            <p class="text-xs text-[var(--muted)] mt-1">Apenas administradores podem alterar
              permissões</p>
          </div>
          <div class="px-6 pb-6">
            <div v-if="!user?.permissoes?.length" class="text-center py-8 text-[var(--muted)]">
              <p class="text-sm">Nenhuma permissão atribuída</p>
              <p class="text-xs mt-2">Entre em contato com o administrador</p>
            </div>
            <div v-else class="space-y-2 max-h-80 overflow-y-auto">
              <div v-for="(perm, idx) in user?.permissoes" :key="idx"
                class="flex items-center gap-3 p-3 rounded-lg bg-[var(--card)] transition-colors">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center">
                  <span class="text-sm">✓</span>
                </div>
                <span class="text-sm text-[var(--text)]">{{ perm }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de Alterar Senha -->
  <teleport to="body">
    <div v-if="showPasswordModal" class="fixed inset-0 z-[100]" @click.self="showPasswordModal = false">
      <div class="absolute inset-0 bg-black/40 pointer-events-none"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div
          class="w-full max-w-md bg-[var(--panel)] rounded-2xl shadow-xl border border-[var(--border)] pointer-events-auto transition-colors">
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-2xl font-bold text-[var(--text)]">Alterar Senha</h2>
              <button @click="showPasswordModal = false" class="p-2 rounded-lg hover:bg-[var(--card)] transition">
                <span class="text-xl text-[var(--muted)]">✕</span>
              </button>
            </div>

            <form @submit.prevent="handleChangePassword" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-[var(--muted)] mb-2">
                  Senha Atual
                </label>
                <input v-model="passwordForm.currentPassword" type="password" required
                  class="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--text)] placeholder-[var(--muted)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none transition"
                  placeholder="Digite sua senha atual" />
              </div>

              <div>
                <label class="block text-sm font-medium text-[var(--muted)] mb-2">
                  Nova Senha
                </label>
                <input v-model="passwordForm.newPassword" type="password" required minlength="6"
                  class="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--text)] placeholder-[var(--muted)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none transition"
                  placeholder="Digite a nova senha (mínimo 6 caracteres)" />
              </div>

              <div>
                <label class="block text-sm font-medium text-[var(--muted)] mb-2">
                  Confirmar Nova Senha
                </label>
                <input v-model="passwordForm.confirmPassword" type="password" required minlength="6"
                  class="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--text)] placeholder-[var(--muted)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none transition"
                  placeholder="Confirme a nova senha" />
              </div>

              <div v-if="passwordError"
                class="p-3 rounded-lg bg-rose-50 dark:bg-rose-900 border border-rose-200 dark:border-rose-700">
                <p class="text-sm text-rose-700 dark:text-rose-200">{{ passwordError }}</p>
              </div>

              <div v-if="passwordSuccess"
                class="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900 border border-emerald-200 dark:border-emerald-700">
                <p class="text-sm text-emerald-700 dark:text-emerald-200">{{ passwordSuccess }}</p>
              </div>

              <div class="flex gap-3 pt-4">
                <button type="button" @click="showPasswordModal = false"
                  class="flex-1 px-4 py-2 rounded-lg border border-[var(--border)] text-[var(--text)] hover:bg-[var(--card)] transition">
                  Cancelar
                </button>
                <button type="submit" :disabled="isChangingPassword"
                  class="flex-1 px-4 py-2 rounded-lg bg-[var(--accent)] text-white font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition">
                  {{ isChangingPassword ? 'Alterando...' : 'Alterar Senha' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue'
import { currentUser } from '../services/auth'

const user = ref<any>(null)
const showPasswordModal = ref(false)
const isChangingPassword = ref(false)
const passwordError = ref('')
const passwordSuccess = ref('')

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const acoes = ref([
  { id: 1, data_hora: '20/08/2025 - 14:32', açao: 'Criou contrato com a empresa Tech Solutions Ltda' },
  { id: 2, data_hora: '18/08/2025 - 09:15', açao: 'Aprovou proposta da Construtora Alpha' },
  { id: 3, data_hora: '16/08/2025 - 16:42', açao: 'Editou cadastro da empresa Beta Corp' },
  { id: 4, data_hora: '01/08/2025 - 11:30', açao: 'Criou o cadastro da empresa Tech Solutions Ltda' },
  { id: 5, data_hora: '28/07/2025 - 15:20', açao: 'Visualizou relatório de auditoria' }
])

const resetPasswordForm = () => {
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  passwordError.value = ''
  passwordSuccess.value = ''
}

const handleChangePassword = async () => {
  passwordError.value = ''
  passwordSuccess.value = ''

  // Validações
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = 'As senhas não coincidem'
    return
  }

  if (passwordForm.value.newPassword.length < 6) {
    passwordError.value = 'A nova senha deve ter no mínimo 6 caracteres'
    return
  }

  if (passwordForm.value.currentPassword === passwordForm.value.newPassword) {
    passwordError.value = 'A nova senha deve ser diferente da senha atual'
    return
  }

  isChangingPassword.value = true

  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      passwordError.value = 'Sessão expirada. Faça login novamente.'
      return
    }

    const response = await fetch('http://localhost:3000/api/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        currentPassword: passwordForm.value.currentPassword,
        newPassword: passwordForm.value.newPassword
      })
    })

    const data = await response.json()

    if (!response.ok) {
      passwordError.value = data.message || 'Erro ao alterar senha'
      return
    }

    passwordSuccess.value = 'Senha alterada com sucesso!'
    const instance = getCurrentInstance()
    const $notify = instance?.appContext.config.globalProperties.$notify
    $notify?.success?.('Senha alterada com sucesso!')

    setTimeout(() => {
      resetPasswordForm()
      showPasswordModal.value = false
    }, 2000)
  } catch (error) {
    console.error('Erro ao alterar senha:', error)
    passwordError.value = 'Erro ao conectar com o servidor'
  } finally {
    isChangingPassword.value = false
  }
}

onMounted(() => {
  user.value = currentUser.value
  console.log('User data:', user.value)
})
</script>

<style scoped>
/* Estilos removidos - usando apenas Tailwind CSS */
</style>
