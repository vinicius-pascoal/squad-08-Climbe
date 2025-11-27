<template>

  <div class="home-dashboard-grid">

    <!-- Widget do Calendário (Área 1) -->
    <div class="widget-card calendar-widget">
      <div class="checklist-block">
        <div class="calendar-navigation">
          <button @click="prevMonth">&lt;</button>
          <span class="month-year">{{ monthYearDisplay }}</span>
          <button @click="nextMonth">&gt;</button>
        </div>
        <ActivityList :activities="activitiesForSelectedDate" :selectedDate="selectedDate"
          @update-activity="updateActivity" />
        <AddEventButton @click="openAddEventModal" />
      </div>
      <div class="calendar-display-block">
        <Calendar :activities="activities" :view-date="viewDate" @date-selected="onDateSelected" />
      </div>
    </div>

    <!--Widget da Agenda-->
    <AgendaWidget ref="agendaRef" class="main-agenda-widget" @event-click="onAgendaEventClick" />

    <div class="role-row">
      <component :is="roleComponent" v-bind="roleModalHandlers" />
    </div>

    <!-- Modals for quick creation (opened by role buttons) -->
    <ModalCreateProposta v-if="showPropostaModal" @close="handleClosePropostaModal" @saved="onPropostaSaved" />
    <ModalNovoContrato v-if="showContratoModal" :flowId="currentFlowContext?.flowId" @close="handleCloseContratoModal"
      @saved="onContratoSaved" />
    <ModalCadastroUsuario v-if="showCadastroModal" @close="showCadastroModal = false" />

    <!-- Fluxo -->
    <ModalIniciarFluxo v-if="showStartFlow" @close="showStartFlow = false" @started="onFlowStarted" />
    <CompanyWizard v-if="showEmpresaModal" v-model:open="showEmpresaModal" api-url="/api/empresas"
      @saved="onEmpresaSaved" />

    <AddEventModal v-if="isAddEventModalOpen" @close="closeAddEventModal" @add="addActivity"
      :selectedDate="selectedDate" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, getCurrentInstance } from 'vue';
import { showLoading, hideLoading } from '../lib/loading';

// Componentes do Widget de Calendário
import Calendar from '../components/Calendar.vue';
import ActivityList from '../components/ActivityList.vue';
import AddEventButton from '../components/AddEventButton.vue';
import AddEventModal from '../components/AddEventModal.vue';

// Placeholders dos outros widgets
import AgendaWidget from '../components/AgendaWidget.vue';
// Role-specific components (placed in components/home)
import RoleAdmin from '../components/home/RoleAdmin.vue';
import RoleCEO from '../components/home/RoleCEO.vue';
import RoleAnalista from '../components/home/RoleAnalista.vue';
import RoleCompliance from '../components/home/RoleCompliance.vue';
import RoleCFO from '../components/home/RoleCFO.vue';
import RoleCSOCMO from '../components/home/RoleCSOCMO.vue';
import RoleMembroConselho from '../components/home/RoleMembroConselho.vue';
import { currentUser } from '../services/auth';
import ModalCreateProposta from '../components/modals/ModalCreateProposta.vue';
import ModalNovoContrato from '../components/modals/ModalNovoContrato.vue';
import ModalCadastroUsuario from '../components/modals/ModalCadastroUsuario.vue';
import ModalIniciarFluxo from '../components/modals/ModalIniciarFluxo.vue';
import CompanyWizard from '../components/modals/company-wizard/CompanyWizard.vue';

// Serviços
import calendarApi, { listCalendarEvents, listUserEvents, addCalendarEvent } from '../services/calendar';
import { advanceFlow, linkProposta, linkContrato, cancelFlow } from '../services/flow';
import { http } from '../lib/http';
import Swal from 'sweetalert2';

// --- ESTADO DO WIDGET DE CALENDÁRIO ---
const selectedDate = ref<Date>(new Date());
const viewDate = ref<Date>(new Date());
const activitiesAll = ref<any[]>([]);
const activities = activitiesAll; // compat shorthand for older code using 'activities'
const isAddEventModalOpen = ref(false);
const showStartFlow = ref(false);
const showEmpresaModal = ref(false);
const agendaRef = ref<any>(null);
const currentFlowContext = ref<{ flowId: number; stepType: string } | null>(null);

const monthYearDisplay = computed(() => {
  return viewDate.value.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
});

const nextMonth = () => {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, 1);
};
const prevMonth = () => {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() - 1, 1);
};

// Callback quando seleciona uma data no calendário
const onDateSelected = (date: Date) => {
  selectedDate.value = date;
  if (date.getMonth() !== viewDate.value.getMonth() || date.getFullYear() !== viewDate.value.getFullYear()) {
    viewDate.value = new Date(date);
  }
};

// Util: comparar dia/mês/ano
const isSameDate = (d1: Date | string | number, d2: Date | string | number) => {
  if (!d1 || !d2) return false;
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const activitiesForSelectedDate = computed(() =>
  activitiesAll.value.filter((a: any) => isSameDate(a.date, selectedDate.value))
);

const openAddEventModal = () => { isAddEventModalOpen.value = true; };
const closeAddEventModal = () => { isAddEventModalOpen.value = false; };

const updateActivity = (updatedActivity: any) => {
  const index = activitiesAll.value.findIndex((a: any) => a.id === updatedActivity.id);
  if (index !== -1) {
    activitiesAll.value[index] = { ...activitiesAll.value[index], ...updatedActivity };
  }
};

const canStartFlow = computed(() => {
  const cargo = String(currentUser?.value?.cargoNome || currentUser?.value?.cargo || '').toLowerCase();
  return cargo.includes('admin') || cargo.includes('ceo');
});

function onFlowStarted() {
  // re-carregar eventos do usuário para refletir nova reunião
  setTimeout(() => {
    loadAllUserEvents();
    agendaRef.value?.loadEvents();
  }, 500);
}

async function onAgendaEventClick(ev: any) {
  // Se for evento de fluxo, abrir o modal da etapa atual
  if (ev.source === 'flow' && ev.flowId && ev.stepType) {
    currentFlowContext.value = { flowId: ev.flowId, stepType: ev.stepType };

    const instance = getCurrentInstance();
    const $notify = instance?.appContext.config.globalProperties.$notify;

    // Mostrar opções do fluxo
    const result = await Swal.fire({
      title: 'Fluxo de Contrato',
      text: `Etapa atual: ${ev.stepType}`,
      icon: 'info',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: 'Continuar Etapa',
      denyButtonText: 'Cancelar Fluxo',
      cancelButtonText: 'Fechar',
      customClass: {
        container: 'swal-high-z'
      }
    });

    if (result.isDenied) {
      // Cancelar fluxo
      const confirmCancel = await Swal.fire({
        title: 'Cancelar Fluxo?',
        text: 'Tem certeza que deseja cancelar este fluxo? Esta ação não pode ser desfeita.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, cancelar',
        cancelButtonText: 'Não',
        confirmButtonColor: '#d33',
        customClass: {
          container: 'swal-high-z'
        }
      });

      if (confirmCancel.isConfirmed && currentFlowContext.value?.flowId) {
        try {
          showLoading();
          await cancelFlow(currentFlowContext.value.flowId);
          hideLoading();
          $notify?.success?.('Fluxo cancelado com sucesso!');
          setTimeout(() => {
            loadAllUserEvents();
            agendaRef.value?.loadEvents();
            currentFlowContext.value = null;
          }, 500);
        } catch (e: any) {
          hideLoading();
          $notify?.error?.(e?.message || 'Erro ao cancelar fluxo');
        }
      }
      return;
    }

    if (!result.isConfirmed) {
      currentFlowContext.value = null;
      return;
    }

    // Mapa de etapas para modais
    const stepMap: Record<string, () => void> = {
      REUNIAO: async () => {
        // Para reunião, perguntar se deseja marcar como concluída e avançar
        const confirmar = confirm('Reunião agendada. Deseja marcar como concluída e avançar para a próxima etapa (Proposta)?');
        if (confirmar && currentFlowContext.value?.flowId) {
          try {
            await advanceFlow(currentFlowContext.value.flowId);
            $notify?.success?.('Reunião concluída! Avançando para Proposta...');
            setTimeout(() => {
              loadAllUserEvents();
              agendaRef.value?.loadEvents();
            }, 500);
          } catch (e: any) {
            $notify?.error?.(e?.message || 'Erro ao avançar fluxo');
          }
        }
      },
      PROPOSTA: () => {
        showPropostaModal.value = true;
      },
      CONTRATO: () => {
        showContratoModal.value = true;
      },
      CRIACAO_EMPRESA: () => {
        showEmpresaModal.value = true;
      },
    };

    const action = stepMap[ev.stepType];
    if (action) {
      action();
    } else {
      $notify?.warning?.(`Etapa ${ev.stepType} não reconhecida`);
    }
  }
}

function handleClosePropostaModal() {
  showPropostaModal.value = false;
  currentFlowContext.value = null;
}

function handleCloseContratoModal() {
  showContratoModal.value = false;
  currentFlowContext.value = null;
}

async function onPropostaSaved(proposta: any) {
  const instance = getCurrentInstance();
  const $notify = instance?.appContext.config.globalProperties.$notify;

  if (currentFlowContext.value?.flowId) {
    try {
      await linkProposta(currentFlowContext.value.flowId, proposta.id);
      // NÃO avançar automaticamente - aguardar aprovação da proposta
      $notify?.success?.('Proposta vinculada! Aguardando aprovação para avançar...');

      // Aguardar um pouco para garantir que o backend processou
      setTimeout(() => {
        loadAllUserEvents();
        agendaRef.value?.loadEvents();
      }, 500);
    } catch (e: any) {
      $notify?.error?.(e?.message || 'Erro ao vincular proposta');
    }
  }
  handleClosePropostaModal();
}

async function onContratoSaved(contrato: any) {
  const instance = getCurrentInstance();
  const $notify = instance?.appContext.config.globalProperties.$notify;

  if (currentFlowContext.value?.flowId) {
    try {
      await linkContrato(currentFlowContext.value.flowId, contrato.id);
      await advanceFlow(currentFlowContext.value.flowId);
      $notify?.success?.('Contrato vinculado! Avançando para próxima etapa...');

      // Aguardar um pouco para garantir que o backend processou
      setTimeout(() => {
        loadAllUserEvents();
        agendaRef.value?.loadEvents();
      }, 500);
    } catch (e: any) {
      $notify?.error?.(e?.message || 'Erro ao vincular contrato');
    }
  }
  handleCloseContratoModal();
}

async function onEmpresaSaved(empresa?: any) {
  const instance = getCurrentInstance();
  const $notify = instance?.appContext.config.globalProperties.$notify;

  if (currentFlowContext.value?.flowId && empresa?.id) {
    try {
      // Vincular empresa ao fluxo (atualizar empresaId)
      await http(`/api/flows/${currentFlowContext.value.flowId}`, {
        method: 'PATCH',
        body: JSON.stringify({ empresaId: empresa.id }),
      });
      await advanceFlow(currentFlowContext.value.flowId);
      $notify?.success?.('Empresa criada! Fluxo concluído com sucesso! 🎉');

      // Aguardar um pouco para garantir que o backend processou
      setTimeout(() => {
        loadAllUserEvents();
        agendaRef.value?.loadEvents();
      }, 500);
    } catch (e: any) {
      $notify?.error?.(e?.message || 'Erro ao vincular empresa');
    }
  }
  showEmpresaModal.value = false;
  currentFlowContext.value = null;
}

// --- Integração com backend de eventos/Google Calendar ---
async function loadEventsForSelectedDate() {
  try {
    const y = selectedDate.value.getFullYear();
    const m = String(selectedDate.value.getMonth() + 1).padStart(2, '0');
    const d = String(selectedDate.value.getDate()).padStart(2, '0');
    const items = await listCalendarEvents(`${y}-${m}-${d}`);
    // This function loads events for a single date (detailed view) but should not overwrite the global activitiesAll
    const dayItems = (items || []).map((ev: any) => {
      // Prefer start.dateTime (full ISO). If only start.date (YYYY-MM-DD) is present,
      // parse it as local date to avoid timezone shift.
      let evDate: Date;
      if (ev.start?.dateTime) {
        evDate = new Date(ev.start.dateTime);
      } else if (ev.start?.date) {
        const parts = String(ev.start.date).split('-').map((s: string) => Number(s));
        const yy = parts[0] || selectedDate.value.getFullYear();
        const mm = (parts[1] || (selectedDate.value.getMonth() + 1)) - 1;
        const dd = parts[2] || selectedDate.value.getDate();
        evDate = new Date(yy, mm, dd);
      } else {
        evDate = new Date(selectedDate.value);
      }

      return {
        id: ev.id || crypto.randomUUID(),
        date: evDate,
        title: ev.summary || 'Evento',
        completed: false,
        priority: 'Média',
        description: ev.description || '',
        location: ev.location || '',
      };
    });

    // Update only detailed view if needed (we can set activitiesAll for calendar elsewhere)
    // For now keep dayItems available by replacing activitiesAll entries for that day
    // Remove existing activities on that day and add fetched ones
    activitiesAll.value = activitiesAll.value.filter((a: any) => !isSameDate(a.date, selectedDate.value)).concat(dayItems);
  } catch (err) {
    console.error('Falha ao carregar eventos:', err);
  }
}

async function loadAllUserEvents() {
  try {
    const items = await listUserEvents();
    // items is array with merged local+google events
    activitiesAll.value = (items || []).map((ev: any) => {
      // ev.start may be ISO string or date-only; prefer to parse as local
      let evDate: Date;
      if (ev.start && typeof ev.start === 'string' && ev.start.includes('T')) {
        evDate = new Date(ev.start);
      } else if (ev.start && typeof ev.start === 'string' && ev.start.includes('-')) {
        const [y, m, d] = ev.start.split('-').map(Number);
        evDate = new Date(y, (m || 1) - 1, d || 1);
      } else {
        evDate = new Date();
      }

      return {
        id: ev.id || crypto.randomUUID(),
        date: evDate,
        title: ev.summary || ev.title || 'Evento',
        completed: false,
        priority: 'Média',
        description: ev.description || '',
        location: ev.location || '',
      };
    });
  } catch (err) {
    console.error('Falha ao carregar eventos do usuário:', err);
  }
}

type AddPayload = {
  title?: string;
  description?: string;
  location?: string;
  time?: string; // 'HH:mm'
  emails?: string[];
  isRemote?: boolean;
  date?: Date | string;
};

async function addActivity(payload: AddPayload) {
  try {
    // garantir payload.date como Date local
    let start = payload?.date ? new Date(payload.date as any) : new Date(selectedDate.value);
    // se payload.date foi uma string no formato YYYY-MM-DD, new Date(...) pode interpretar em UTC;
    // preferimos garantir local: se foi string com '-', criar localmente
    if (payload?.date && typeof payload.date === 'string' && payload.date.includes('-')) {
      const [y, m, d] = payload.date.split('-').map(Number);
      start = new Date(y, (m || 1) - 1, d || 1);
    }
    if (payload?.time) {
      const [hh = '9', mm = '0'] = String(payload.time).split(':');
      start.setHours(Number(hh), Number(mm), 0, 0);
    }
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    await addCalendarEvent({
      titulo: payload?.title || 'Novo evento',
      descricao: payload?.description || '',
      local: payload?.location || '',
      inicio: start,
      fim: end,
      emails: payload?.emails || undefined,
      remoto: !!payload?.isRemote,
      notificar: true,
    });

    await loadEventsForSelectedDate();
    isAddEventModalOpen.value = false;
    const instance = getCurrentInstance();
    const $notify = instance?.appContext.config.globalProperties.$notify;
    $notify?.success?.('Evento criado com sucesso!');
  } catch (err) {
    console.error('Falha ao criar evento:', err);
    const instance = getCurrentInstance();
    const $notify = instance?.appContext.config.globalProperties.$notify;
    $notify?.error?.('Falha ao criar evento');
  }
}

onMounted(() => {
  loadAllUserEvents();
  loadEventsForSelectedDate();
});
watch(selectedDate, () => loadEventsForSelectedDate());

// botão de teste: mostra o loader por 6 segundos
async function testLoader() {
  try {
    showLoading();
    await new Promise((r) => setTimeout(r, 6000));
  } finally {
    hideLoading();
  }
}

// Computed que retorna o componente de acordo com o cargo do usuário
const roleComponent = computed(() => {
  const cargoRaw = currentUser?.value?.cargoNome || currentUser?.value?.cargo || '';
  const cargo = String(cargoRaw || '').toLowerCase().trim();

  const map: Record<string, any> = {
    admin: RoleAdmin,
    ceo: RoleCEO,
    compliance: RoleCompliance,
    cfo: RoleCFO,
    cso: RoleCSOCMO,
    cmo: RoleCSOCMO,
    'membro do conselho': RoleMembroConselho,
    'membroconselho': RoleMembroConselho,
    analista: RoleAnalista,
  };

  // busca correspondência exata ou por inclusão
  if (map[cargo]) return map[cargo];
  const byInclude = Object.keys(map).find(k => cargo.includes(k));
  if (byInclude) return map[byInclude];
  // fallback para analista
  return RoleAnalista;
});

// modals exposed to role components
const showPropostaModal = ref(false);
const showContratoModal = ref(false);
const showCadastroModal = ref(false);

const roleModalHandlers = computed(() => ({
  openCreateProposta: () => { showPropostaModal.value = true },
  openNovoContrato: () => { showContratoModal.value = true },
  openCadastroUsuario: () => { showCadastroModal.value = true },
  openIniciarFluxo: canStartFlow.value ? () => { showStartFlow.value = true } : undefined,
}));

</script>

<style scoped>
.home-dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto auto auto;
  grid-template-areas:
    "calendar calendar main-agenda"
    "calendar calendar main-agenda"
    "stats history actions";
  gap: 1.5rem;
  padding: 2rem;
}

.widget-card {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.calendar-widget {
  grid-area: calendar;
}

.main-agenda-widget {
  grid-area: main-agenda;
}

.stats-widget {
  grid-area: stats;
}

.history-widget {
  grid-area: history;
}

.actions-widget {
  grid-area: actions;
}

.calendar-widget {
  display: flex;
  gap: 2rem;
  padding: 1.5rem;
}

.checklist-block {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
}

.calendar-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #eee;
}

.calendar-navigation .month-year {
  font-weight: bold;
  text-transform: capitalize;
}

.calendar-navigation button {
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  width: 32px;
  height: 32px;
  font-size: 1.2rem;
  font-weight: bold;
  line-height: 1;
  transition: opacity 0.2s;
  background: transparent;
  color: #000;
}

.calendar-navigation button:hover {
  opacity: 0.7;
}

.calendar-navigation button:first-of-type::before {
  content: '<';
}

.calendar-navigation button:last-of-type::before {
  content: '>';
}

/* Modo escuro */
@media (prefers-color-scheme: dark) {
  .calendar-navigation button {
    color: #fff;
  }
}

.calendar-display-block {
  flex: 1.5;
}

.home-dashboard-grid>.stats-widget,
.home-dashboard-grid>.history-widget,
.home-dashboard-grid>.actions-widget {
  width: 100%;
  align-self: stretch;
  justify-self: stretch;
  min-width: 0;
}

.home-dashboard-grid>* {
  min-width: 0;
}

.role-row {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.role-row>* {
  width: 100%;
  min-width: 0;
}

.role-row>*:nth-child(1) {
  grid-column: 1 / 2;
}

.role-row>*:nth-child(2) {
  grid-column: 2 / 3;
}

.role-row>*:nth-child(n+3) {
  grid-column: 1 / 2;
}
</style>
