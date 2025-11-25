<template>
  <div class="h-screen absolute top-5">
    <h1 class="font-bold text-[40px] text-brand-000 dark:text-white">Perfil do usuário</h1>
  </div>

  <div class="flex justify-between items-center h-fit">
    <div class="flex items-start gap-4">
      <p class="text-brand-0e9a97 dark:text-brand-14b8a6">Perfil</p>
      <p class="text-brand-0e9a97 dark:text-brand-14b8a6">></p>
      <p class="text-brand-5f6060 dark:text-brand-e5e7eb">Meu perfil</p>
    </div>
    <div class="flex justify-end items-center">
      <button @click="showPasswordModal = true"
        class="shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-brand-cad8fd dark:bg-brand-14b8a6 border border-brand-3b67d0 dark:border-brand-0e9989 text-brand-3b67d0 dark:text-white font-bold text-[18px] rounded-lg px-6 h-[40px] cursor-pointer hover:bg-brand-93c5fd dark:hover:bg-brand-16c3af transition">
        Alterar Senha
      </button>
    </div>
  </div>

  <div class="flex justify-end mt-10 w-full gap-6">
    <div class="flex flex-col flex-1 max-w-2xl">
      <div
        class="rounded-lg shadow-lg bg-white dark:bg-brand-0a0a0a border border-brand-e5e7eb dark:border-brand-0e9989 overflow-hidden transition-colors">
        <div
          class="bg-brand-f0f4ff dark:bg-brand-0e9a97 px-6 py-4 border-b border-brand-e5e7eb dark:border-brand-0e9989">
          <h2 class="text-xl font-bold text-brand-000 dark:text-white">Ações Recentes</h2>
        </div>
        <div class="p-6">
          <div v-if="!acoes.length" class="text-center py-8 text-brand-5f6060 dark:text-brand-e5e7eb">
            Nenhuma ação registrada
          </div>
          <div v-else class="space-y-3">
            <div v-for="acao in acoes" :key="acao.id"
              class="flex items-start gap-4 p-4 rounded-lg bg-brand-f6f7f8 dark:bg-brand-0e9989 hover:bg-brand-e5e7eb dark:hover:bg-brand-0e9a97 transition-colors">
              <div
                class="flex-shrink-0 w-10 h-10 rounded-full bg-brand-cad8fd dark:bg-brand-14b8a6 flex items-center justify-center">
                <span class="text-lg">📋</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-brand-000 dark:text-white">{{ acao.açao }}</p>
                <p class="text-xs text-brand-5f6060 dark:text-brand-e5e7eb mt-1">{{ acao.data_hora }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-6 w-96">
      <div
        class="flex flex-col items-center gap-4 rounded-lg shadow-lg bg-white dark:bg-brand-0a0a0a border border-brand-e5e7eb dark:border-brand-0e9989 p-6 transition-colors">
        <div class="relative">
          <img src="/img/usuario.svg" alt="Avatar"
            class="w-24 h-24 rounded-full border-4 border-brand-cad8fd dark:border-brand-14b8a6" />
          <div
            class="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-brand-0a0a0a">
          </div>
        </div>
        <div class="text-center">
          <h1 class="text-2xl font-bold text-brand-000 dark:text-white">{{ user?.nome || 'Usuário' }}</h1>
          <p class="text-sm text-brand-5f6060 dark:text-brand-e5e7eb mt-1">{{ user?.email || 'email@exemplo.com' }}</p>
        </div>
        <div class="w-full pt-4 border-t border-brand-e5e7eb dark:border-brand-0e9989">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-brand-5f6060 dark:text-brand-e5e7eb">Cargo:</span>
            <span class="text-sm font-semibold text-brand-000 dark:text-white">{{ user?.cargoNome || 'Não definido'
              }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-brand-5f6060 dark:text-brand-e5e7eb">Status:</span>
            <span class="inline-flex items-center gap-1 text-sm font-semibold text-green-600 dark:text-green-400">
              <span class="w-2 h-2 bg-green-500 rounded-full"></span>
              Ativo
            </span>
          </div>
        </div>
      </div>

      <div
        class="flex flex-col gap-3 rounded-lg shadow-lg bg-white dark:bg-brand-0a0a0a border border-brand-e5e7eb dark:border-brand-0e9989 overflow-hidden transition-colors">
        <div
          class="bg-brand-f0f4ff dark:bg-brand-0e9a97 px-6 py-4 border-b border-brand-e5e7eb dark:border-brand-0e9989">
          <h2 class="text-xl font-bold text-brand-000 dark:text-white flex items-center gap-2">
            🔐 Minhas Permissões
          </h2>
          <p class="text-xs text-brand-5f6060 dark:text-brand-e5e7eb mt-1">Apenas administradores podem alterar
            permissões</p>
        </div>
        <div class="px-6 pb-6">
          <div v-if="!user?.permissoes?.length" class="text-center py-8 text-brand-5f6060 dark:text-brand-e5e7eb">
            <p class="text-sm">Nenhuma permissão atribuída</p>
            <p class="text-xs mt-2">Entre em contato com o administrador</p>
          </div>
          <div v-else class="space-y-2 max-h-80 overflow-y-auto">
            <div v-for="(perm, idx) in user?.permissoes" :key="idx"
              class="flex items-center gap-3 p-3 rounded-lg bg-brand-f6f7f8 dark:bg-brand-0e9989 transition-colors">
              <div
                class="flex-shrink-0 w-8 h-8 rounded-full bg-brand-cad8fd dark:bg-brand-14b8a6 flex items-center justify-center">
                <span class="text-sm">✓</span>
              </div>
              <span class="text-sm text-brand-000 dark:text-white">{{ perm }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de Alterar Senha -->
  <teleport to="body">
    <div v-if="showPasswordModal" class="fixed inset-0 z-[100]" @click.self="showPasswordModal = false">
      <div class="absolute inset-0 bg-black/40 dark:bg-black/60 pointer-events-none"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div
          class="w-full max-w-md bg-white dark:bg-brand-0a0a0a rounded-2xl shadow-xl border border-brand-e5e7eb dark:border-brand-0e9989 pointer-events-auto transition-colors">
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-2xl font-bold text-brand-000 dark:text-white">Alterar Senha</h2>
              <button @click="showPasswordModal = false"
                class="p-2 rounded-lg hover:bg-brand-f6f7f8 dark:hover:bg-brand-0e9989 transition">
                <span class="text-xl text-brand-5f6060 dark:text-brand-e5e7eb">✕</span>
              </button>
            </div>

            <form @submit.prevent="handleChangePassword" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-brand-5f6060 dark:text-brand-e5e7eb mb-2">
                  Senha Atual
                </label>
                <input v-model="passwordForm.currentPassword" type="password" required
                  class="w-full px-4 py-2 rounded-lg border border-brand-e5e7eb dark:border-brand-0e9989 bg-white dark:bg-brand-0e9989 text-brand-000 dark:text-white placeholder-brand-5f6060 dark:placeholder-brand-e5e7eb focus:ring-2 focus:ring-brand-3b67d0 dark:focus:ring-brand-14b8a6 focus:border-transparent outline-none transition"
                  placeholder="Digite sua senha atual" />
              </div>

              <div>
                <label class="block text-sm font-medium text-brand-5f6060 dark:text-brand-e5e7eb mb-2">
                  Nova Senha
                </label>
                <input v-model="passwordForm.newPassword" type="password" required minlength="6"
                  class="w-full px-4 py-2 rounded-lg border border-brand-e5e7eb dark:border-brand-0e9989 bg-white dark:bg-brand-0e9989 text-brand-000 dark:text-white placeholder-brand-5f6060 dark:placeholder-brand-e5e7eb focus:ring-2 focus:ring-brand-3b67d0 dark:focus:ring-brand-14b8a6 focus:border-transparent outline-none transition"
                  placeholder="Digite a nova senha (mínimo 6 caracteres)" />
              </div>

              <div>
                <label class="block text-sm font-medium text-brand-5f6060 dark:text-brand-e5e7eb mb-2">
                  Confirmar Nova Senha
                </label>
                <input v-model="passwordForm.confirmPassword" type="password" required minlength="6"
                  class="w-full px-4 py-2 rounded-lg border border-brand-e5e7eb dark:border-brand-0e9989 bg-white dark:bg-brand-0e9989 text-brand-000 dark:text-white placeholder-brand-5f6060 dark:placeholder-brand-e5e7eb focus:ring-2 focus:ring-brand-3b67d0 dark:focus:ring-brand-14b8a6 focus:border-transparent outline-none transition"
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
                  class="flex-1 px-4 py-2 rounded-lg border border-brand-e5e7eb dark:border-brand-0e9989 text-brand-5f6060 dark:text-white hover:bg-brand-f6f7f8 dark:hover:bg-brand-0e9989 transition">
                  Cancelar
                </button>
                <button type="submit" :disabled="isChangingPassword"
                  class="flex-1 px-4 py-2 rounded-lg bg-brand-cad8fd dark:bg-brand-14b8a6 text-brand-3b67d0 dark:text-white font-bold hover:bg-brand-93c5fd dark:hover:bg-brand-16c3af disabled:opacity-50 disabled:cursor-not-allowed transition">
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
