<script>
import Card from '../components/cardUsers.vue';
import ModalCadastroUsuario from '../components/modals/ModalCadastroUsuario.vue';
import ModalEditarUsuario from '../components/modals/ModalEditarUsuario.vue';
import { http } from '../lib/http';
import { hasPermission as hasPerm, currentUser } from '../services/auth';

export default {
  name: 'GestaoUsuario',
  components: { Card, ModalCadastroUsuario, ModalEditarUsuario },

  data() {
    return {
      users: [],
      cargos: [],
      cargoMap: {},

      loading: false,
      error: null,

      searchTerm: '',
      showFilters: false,
      filters: { status: '', cargoId: '' },

      page: 1,
      pageSize: 5,
      showCreateModal: false,
      showEditModal: false,
      selectedUser: null,

      statusLoading: {}, // { [userId]: boolean }
    };
  },

  computed: {
    filteredUsers() {
      const term = this.searchTerm.trim().toLowerCase();
      return this.users.filter(u => {
        const nome = (u.nomeCompleto || '').toLowerCase();
        const email = (u.email || '').toLowerCase();
        const matchesTerm = !term || nome.includes(term) || email.includes(term);

        const status = this.mapSituacao(u.situacao);
        const matchesStatus = !this.filters.status || status === this.filters.status;

        const cargoId = (u.cargo && u.cargo.id) ?? u.cargoId ?? null;
        const matchesCargo = !this.filters.cargoId || Number(this.filters.cargoId) === Number(cargoId);

        return matchesTerm && matchesStatus && matchesCargo;
      });
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredUsers.length / this.pageSize));
    },
    paginatedUsers() {
      const start = (this.page - 1) * this.pageSize;
      return this.filteredUsers.slice(start, start + this.pageSize);
    },
  },

  watch: {
    searchTerm() { this.page = 1; },
    filters: { deep: true, handler() { this.page = 1; } }
  },

  methods: {
    async fetchUsers() {
      try {
        this.loading = true;
        this.error = null;
        const data = await http('/api/usuarios');
        this.users = Array.isArray(data) ? data : [];
        this.page = 1;
      } catch (e) {
        this.error = e?.message || 'Erro ao carregar usuários';
        this.$notify?.error(this.error);
      } finally {
        this.loading = false;
      }
    },
    async fetchCargos() {
      try {
        const data = await http('/api/cargos');
        this.cargos = Array.isArray(data) ? data : [];
        this.cargoMap = this.cargos.reduce((acc, c) => {
          acc[c.id] = c.nomeCargo || c.nome || '';
          return acc;
        }, {});
      } catch (e) {
        this.cargos = [];
        this.cargoMap = {};
        console.warn('Falha ao carregar cargos:', e?.message || e);
      }
    },

    mapSituacao(situacao) {
      const s = (situacao || '').toString().toLowerCase();
      if (s === 'aprovado' || s === 'ativo') return 'ativo';
      if (s === 'pendente') return 'pendente';
      return 'desativado';
    },

    cargoName(u) {
      if (u?.cargo?.nomeCargo) return u.cargo.nomeCargo;
      const id = (u?.cargo && u.cargo.id) ?? u?.cargoId;
      return id ? (this.cargoMap[id] || '—') : '—';
    },

    getPermissao(_user) { return '—'; },
    hasPermission(desc) { try { return hasPerm(desc); } catch (e) { return false; } },
    isAdmin() { try { return currentUser && (currentUser.value?.cargoNome === 'Admin' || currentUser.value?.cargoNome === 'ADMIN'); } catch (e) { return false; } },

    toggleFilters() { this.showFilters = !this.showFilters; },
    applyFilters() { this.page = 1; this.showFilters = false; },
    clearFilters() { this.filters.status = ''; this.filters.cargoId = ''; this.page = 1; this.showFilters = false; },

    goToPage(p) { if (p >= 1 && p <= this.totalPages) this.page = p; },
    prevPage() { if (this.page > 1) this.page -= 1; },
    nextPage() { if (this.page < this.totalPages) this.page += 1; },

    openCadastro() { this.showCreateModal = true; },

    openEdit(user) {
      this.selectedUser = user;
      this.showEditModal = true;
    },

    async handleUserUpdated() {
      this.showEditModal = false;
      this.selectedUser = null;
      await this.fetchUsers();
      this.$notify?.success('Usuário atualizado com sucesso!');
    },

    handleClickOutside(e) {
      const dropdown = this.$refs.filtersDropdown;
      const button = this.$refs.filtersBtn;
      if (!dropdown || !button) return;
      const clickedOutside = !dropdown.contains(e.target) && !button.contains(e.target);
      if (clickedOutside) this.showFilters = false;
    },

    // Aprovar usuário com cargo
    async onChangeStatus({ userId, status, cargoId }) {
      if ((status || '').toLowerCase() !== 'ativo') {
        this.error = 'Somente a aprovação está disponível no momento.';
        this.$notify?.warning(this.error);
        return;
      }
      const idx = this.users.findIndex(u => u.id === userId);
      if (idx === -1) return;

      const prev = { situacao: this.users[idx].situacao, cargoId: this.users[idx].cargoId, cargo: this.users[idx].cargo };
      this.statusLoading[userId] = true;
      // Otimista
      this.users[idx].situacao = 'aprovado';
      this.users[idx].cargoId = cargoId;
      this.users[idx].cargo = { id: cargoId, nomeCargo: this.cargoMap[cargoId] || '—' };

      try {
        await http(`/api/usuarios/${userId}/aprovar`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cargoId }),
        });
        this.$notify?.success('Usuário aprovado com sucesso!');
      } catch (e) {
        // rollback
        this.users[idx].situacao = prev.situacao;
        this.users[idx].cargoId = prev.cargoId;
        this.users[idx].cargo = prev.cargo;
        this.error = e?.message || 'Falha ao aprovar usuário';
        this.$notify?.error(this.error);
      } finally {
        this.$set?.(this.statusLoading, userId, false); // vue2 compat
        delete this.statusLoading[userId];
      }
    },
    // Handler quando um Card emite que o usuário foi removido
    onUserRemoved({ userId }) {
      const idx = this.users.findIndex(u => Number(u.id) === Number(userId));
      if (idx === -1) return;
      this.users.splice(idx, 1);
      this.$notify?.success('Usuário removido com sucesso.');
      if (this.page > this.totalPages) this.page = this.totalPages;
    },
  },

  mounted() {
    this.fetchUsers();
    this.fetchCargos();
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
};
</script>

<template>
  <div class="gestaousuario ml-16 relative usuarios ">
    <h1 class="font-bold text-[40px] titulo text-brand-000 dark:text-white">Gestão de Usuário</h1>

    <div class="flex items-center gap-4 mt-4 mb-6">
      <input v-model="searchTerm" type="search" placeholder="pesquisar por nome/email"
        class="email shadow-md border bg-brand-e1e5e5 dark:bg-brand-0e9a97 dark:border-brand-0e9989 rounded-lg px-4 py-2 w-[80vh] text-brand-5f6060 dark:text-white placeholder-brand-5f6060 dark:placeholder-brand-e5e7eb focus:ring-2 focus:ring-primary dark:focus:ring-primary outline-none" />

      <input ref="filtersBtn" type="button" value="Filtros" @click="toggleFilters"
        class="filtro shadow-md bg-brand-e1e5e5 dark:bg-brand-0e9a97 text-brand-5f6060 dark:text-white border border-brand-e5e7eb dark:border-brand-0e9989 rounded-lg px-4 py-2 hover:bg-brand-f6f7f8 dark:hover:bg-brand-0e9989 cursor-pointer transition" />

      <input v-if="hasPermission('Usuários — Criar') || isAdmin() || hasPermission('Usuários — Aceitar/Aprovar')"
        type="button" value="Cadastrar usuário" @click="openCadastro"
        class="cadastro shadow-md bg-brand-cad8fd border border-brand-3b67d0 text-brand-3b67d0 font-bold rounded-lg px-4 py-2 hover:bg-brand-93c5fd cursor-pointer ml-16 transition dark:bg-brand-cad8fd dark:border-brand-3b67d0 dark:text-brand-3b67d0 dark:hover:bg-brand-93c5fd" />
      <input v-else disabled type="button" value="Cadastrar usuário"
        class="cadastro shadow-md bg-brand-e0e0e0 text-white rounded-lg px-4 py-2 ml-16 opacity-60 cursor-not-allowed dark:bg-brand-e0e0e0 dark:text-white" />
    </div>

    <div v-if="showFilters" ref="filtersDropdown"
      class="absolute z-50 mt-2 bg-white dark:bg-brand-0e9a97 rounded-lg shadow-xl border border-brand-e5e7eb dark:border-brand-0e9989 w-[320px] p-4"
      style="top: 90px;">
      <h3 class="text-brand-5f6060 dark:text-white font-semibold mb-3">Filtrar por</h3>

      <label class="block text-sm text-brand-5f6060 dark:text-brand-e5e7eb mb-1">Status</label>
      <select v-model="filters.status"
        class="w-full mb-3 rounded-lg border border-brand-e5e7eb dark:border-brand-0e9989 bg-brand-f6f7f8 dark:bg-brand-0e9989 px-3 py-2 text-brand-5f6060 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary">
        <option value="">Todos</option>
        <option value="ativo">Ativo</option>
        <option value="pendente">Pendente</option>
        <option value="desativado">Desativado</option>
      </select>

      <label class="block text-sm text-brand-5f6060 dark:text-brand-e5e7eb mb-1">Cargo</label>
      <select v-model="filters.cargoId"
        class="w-full mb-4 rounded-lg border border-brand-e5e7eb dark:border-brand-0e9989 bg-brand-f6f7f8 dark:bg-brand-0e9989 px-3 py-2 text-brand-5f6060 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary">
        <option value="">Todos</option>
        <option v-for="c in cargos" :key="c.id" :value="c.id">{{ c.nomeCargo }}</option>
      </select>

      <div class="flex items-center justify-end gap-2">
        <button @click="clearFilters"
          class="px-4 py-2 rounded-lg border border-brand-e5e7eb dark:border-brand-0e9989 text-brand-5f6060 dark:text-white hover:bg-brand-f6f7f8 dark:hover:bg-brand-0e9989 transition">Limpar</button>
        <button @click="applyFilters"
          class="px-4 py-2 rounded-lg bg-brand-cad8fd dark:bg-brand-14b8a6 text-white hover:bg-brand-93c5fd dark:hover:bg-brand-16c3af transition">
          Aplicar
        </button>
      </div>
    </div>

    <div class="p-6 bg-white dark:bg-brand-0a0a0a rounded-lg shadow-lg">
      <div v-if="loading" class="py-8 text-center text-brand-5f6060 dark:text-brand-e5e7eb">Carregando usuários...</div>
      <div v-else-if="error" class="py-8 text-center text-brand-d32f2f dark:text-brand-ef4444">{{ error }}</div>

      <div v-else>
        <div class="overflow-x-auto">
          <table class="w-full bg-white dark:bg-brand-0a0a0a rounded-lg overflow-hidden">
            <thead class="bg-brand-f0f4ff dark:bg-brand-0e9a97">
              <tr>
                <th
                  class="py-4 px-6 text-left text-sm font-semibold text-brand-5f6060 dark:text-white border-r border-brand-e5e7eb dark:border-brand-0e9989">
                  Nome
                </th>
                <th
                  class="py-4 px-6 text-left text-sm font-semibold text-brand-5f6060 dark:text-white border-r border-brand-e5e7eb dark:border-brand-0e9989">
                  Cargo
                </th>
                <th
                  class="py-4 px-6 text-left text-sm font-semibold text-brand-5f6060 dark:text-white border-r border-brand-e5e7eb dark:border-brand-0e9989">
                  Email
                </th>
                <th
                  class="py-4 px-6 text-center text-sm font-semibold text-brand-5f6060 dark:text-white border-r border-brand-e5e7eb dark:border-brand-0e9989">
                  Permissões
                </th>
                <th class="py-4 px-6 text-center text-sm font-semibold text-brand-5f6060 dark:text-white">
                  Status
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-brand-e5e7eb dark:divide-brand-3e4343">
              <Card v-for="u in paginatedUsers" :key="u.id" :userId="u.id" :name="u.nomeCompleto || '—'"
                :email="u.email || '—'" :cargo="cargoName(u)" :permisao="getPermissao(u)"
                :status="mapSituacao(u.situacao)" :updating="Boolean(statusLoading[u.id])" :cargos="cargos"
                :canApprove="hasPermission('Usuários — Aceitar/Aprovar')"
                :canEdit="hasPermission('Usuários — Editar') || isAdmin()"
                :canRemove="hasPermission('Usuários — Remover') || isAdmin()" @change-status="onChangeStatus"
                @edit="openEdit(u)" @removed="onUserRemoved" />
            </tbody>
          </table>
        </div>

        <div v-if="!paginatedUsers.length && !loading"
          class="py-8 text-center text-brand-5f6060 dark:text-brand-e5e7eb">
          Nenhum usuário encontrado.
        </div>

        <div class="flex items-center justify-between mt-6 pt-4 border-t border-brand-e5e7eb dark:border-brand-3e4343">
          <span class="text-sm text-brand-5f6060 dark:text-brand-e5e7eb">
            Mostrando {{ (page - 1) * pageSize + 1 }} a {{ Math.min(page * pageSize, filteredUsers.length) }} de {{
              filteredUsers.length }} usuário(s)
          </span>
          <div class="flex items-center gap-2">
            <button @click="prevPage" :disabled="page === 1"
              class="px-4 py-2 rounded-lg border border-brand-e5e7eb dark:border-brand-3e4343 bg-white dark:bg-brand-0e9a97 text-brand-5f6060 dark:text-white hover:bg-brand-f6f7f8 dark:hover:bg-brand-0e9989 disabled:opacity-50 disabled:cursor-not-allowed transition">
              Anterior
            </button>
            <span class="px-4 py-2 text-sm font-medium text-brand-5f6060 dark:text-brand-e5e7eb">
              Página {{ page }} de {{ totalPages }}
            </span>
            <button @click="nextPage" :disabled="page === totalPages"
              class="px-4 py-2 rounded-lg border border-brand-e5e7eb dark:border-brand-3e4343 bg-white dark:bg-brand-0e9a97 text-brand-5f6060 dark:text-white hover:bg-brand-f6f7f8 dark:hover:bg-brand-0e9989 disabled:opacity-50 disabled:cursor-not-allowed transition">
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>
    <ModalCadastroUsuario v-if="showCreateModal" @close="showCreateModal = false" />
    <ModalEditarUsuario v-if="showEditModal" :user="selectedUser" :cargos="cargos" @close="showEditModal = false"
      @updated="handleUserUpdated" />
  </div>
</template>

<style scoped>
.email {
  background-image: url('/icones/pesquisa.svg');
  background-repeat: no-repeat;
  background-position: 15px center;
  padding-left: 45px;
}

.filtro {
  background-image: url('/icones/filtro.svg');
  background-repeat: no-repeat;
  background-position: 15px center;
  padding-left: 70px;
}

.cadastro {
  background-image: url('/icones/cadastro.svg');
  background-repeat: no-repeat;
  background-position: 5px center;
  padding-left: 40px;
}
</style>
