<script>
import Card from '../components/cardUsers.vue';
import { http } from '../lib/http';

export default {
  name: 'GestaoUsuario',
  components: { Card },

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
      return 'inativo';
    },

    cargoName(u) {
      if (u?.cargo?.nomeCargo) return u.cargo.nomeCargo;
      const id = (u?.cargo && u.cargo.id) ?? u?.cargoId;
      return id ? (this.cargoMap[id] || '—') : '—';
    },

    getPermissao(_user) { return '—'; },

    toggleFilters() { this.showFilters = !this.showFilters; },
    applyFilters() { this.page = 1; this.showFilters = false; },
    clearFilters() { this.filters.status = ''; this.filters.cargoId = ''; this.page = 1; this.showFilters = false; },

    goToPage(p) { if (p >= 1 && p <= this.totalPages) this.page = p; },
    prevPage() { if (this.page > 1) this.page -= 1; },
    nextPage() { if (this.page < this.totalPages) this.page += 1; },

    openCadastro() { this.$router.push('/CadastroUsuario'); },

    handleClickOutside(e) {
      const dropdown = this.$refs.filtersDropdown;
      const button = this.$refs.filtersBtn;
      if (!dropdown || !button) return;
      const clickedOutside = !dropdown.contains(e.target) && !button.contains(e.target);
      if (clickedOutside) this.showFilters = false;
    },

    // Aprovar usuário (único fluxo suportado no backend)
    async onChangeStatus({ userId, status }) {
      if ((status || '').toLowerCase() !== 'ativo') {
        this.error = 'Somente a aprovação está disponível no momento.';
        return;
      }
      const idx = this.users.findIndex(u => u.id === userId);
      if (idx === -1) return;

      const prev = this.users[idx].situacao;
      this.statusLoading[userId] = true;
      this.users[idx].situacao = 'aprovado'; // otimista

      try {
        await http(`/api/usuarios/${userId}/aprovar`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ motivo: 'aprovação via UI' }),
        });
      } catch (e) {
        this.users[idx].situacao = prev;
        this.error = e?.message || 'Falha ao aprovar usuário';
      } finally {
        delete this.statusLoading[userId];
      }
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
  <div class="gestaousuario ml-16 relative ">
    <h1 class="font-bold text-[40px]">Gestão de Usuário</h1>

    <div class="flex items-center gap-4 mt-4 mb-6">
      <input v-model="searchTerm" type="search" placeholder="pesquisar por nome/email"
        class="email shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] border bg-[#E1E5E5] rounded-lg px-4 py-2 w-[80vh] text-[#5F6060]" />

      <input ref="filtersBtn" type="button" value="Filtros" @click="toggleFilters"
        class="filtro shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-[#E1E5E5] text-[#5F6060] rounded-lg px-4 py-2 hover cursor-pointer" />

      <input type="button" value="Cadastrar usuário" @click="openCadastro"
        class="cadastro shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-[#CAD8FD] border border-[#3B67D0] text-white rounded-lg px-4 py-2 hover cursor-pointer ml-16" />
    </div>

    <div v-if="showFilters" ref="filtersDropdown"
      class="absolute z-50 mt-2 bg-white rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-gray-200 w-[320px] p-4"
      style="top: 90px;">
      <h3 class="text-[#5F6060] font-semibold mb-3">Filtrar por</h3>

      <label class="block text-sm text-[#5F6060] mb-1">Status</label>
      <select v-model="filters.status"
        class="w-full mb-3 rounded-lg border bg-[#F6F7F8] px-3 py-2 text-[#5F6060] focus:outline-none focus:ring-2 focus:ring-primary">
        <option value="">Todos</option>
        <option value="ativo">Ativo</option>
        <option value="pendente">Pendente</option>
        <option value="inativo">Inativo</option>
      </select>

      <label class="block text-sm text-[#5F6060] mb-1">Cargo</label>
      <select v-model="filters.cargoId"
        class="w-full mb-4 rounded-lg border bg-[#F6F7F8] px-3 py-2 text-[#5F6060] focus:outline-none focus:ring-2 focus:ring-primary">
        <option value="">Todos</option>
        <option v-for="c in cargos" :key="c.id" :value="c.id">{{ c.nomeCargo }}</option>
      </select>

      <div class="flex items-center justify-end gap-2">
        <button @click="clearFilters" class="px-3 py-2 rounded-lg border text-[#5F6060]">Limpar</button>
        <button @click="applyFilters" class="px-3 py-2 rounded-lg bg-[#CAD8FD] text-[#3B67D0] border border-[#3B67D0]">
          Aplicar
        </button>
      </div>
    </div>

    <div class="p-4 bg-white rounded-lg shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
      <div v-if="loading" class="py-8 text-center text-[#5F6060]">Carregando usuários...</div>
      <div v-else-if="error" class="py-8 text-center text-red-500">{{ error }}</div>

      <div v-else>
        <table class=" bg-white shadow-md rounded-lg overflow-hidden w-full">
          <thead class="bg-white">
            <tr class="grid grid-cols-6 h-[50px] items-center">
              <th
                class="shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] py-3 px-6 text-center text-black font-bold border-[#5F6060] border-r-2 h-[40px]">
                Nome Completo</th>
              <th
                class="shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] py-3 px-6 text-center text-black font-bold border-[#5F6060] border-r-2 h-[40px]">
                Cargo</th>
              <th
                class="shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] py-3 px-6 text-center text-black font-bold col-span-2 border-[#5F6060] border-r-2 h-[40px]">
                Email</th>
              <th
                class="shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] py-3 px-6 text-center text-black font-bold border-[#5F6060] border-r-2 h-[40px]">
                Permissões</th>
              <th
                class="shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] py-3 px-6 text-center text-black font-bold border-r-2 h-[40px]">
                Status</th>
            </tr>
          </thead>

          <tbody class="max-h-[60vh] overflow-y-auto h-[50vh] w-fit flex flex-col gap-4 my-4">
            <Card v-for="u in paginatedUsers" :key="u.id" :userId="u.id" :name="u.nomeCompleto || '—'"
              :email="u.email || '—'" :cargo="cargoName(u)" :permisao="getPermissao(u)"
              :status="mapSituacao(u.situacao)" :updating="Boolean(statusLoading[u.id])"
              @change-status="onChangeStatus" />
          </tbody>
        </table>

        <div v-if="!paginatedUsers.length && !loading" class="py-6 text-center text-[#5F6060]">
          Nenhum usuário encontrado.
        </div>

        <div class="flex items-center justify-end mt-4 gap-2">
          <button @click="prevPage" :disabled="page === 1" class="px-3 py-1 rounded border disabled:opacity-50">
            Anterior
          </button>

          <span class="px-2">Página {{ page }} de {{ totalPages }}</span>

          <button @click="nextPage" :disabled="page === totalPages"
            class="px-3 py-1 rounded border disabled:opacity-50">
            Próxima
          </button>
        </div>
      </div>
    </div>
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
