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
        <ActivityList
          :activities="activitiesForSelectedDate"
          :selectedDate="selectedDate"
          @update-activity="updateActivity"
        />
        <AddEventButton @click="openAddEventModal" />
      </div>
      <div class="calendar-display-block">
        <Calendar
          :activities="activities"
          :view-date="viewDate"
          @date-selected="onDateSelected"
        />
      </div>
    </div>

    <!--Widget da Agenda-->
    <AgendaWidget class="main-agenda-widget" />

    <!--Widget das Estatísticas-->
    <StatsWidget class="stats-widget" />

    <!--Widget do Histórico-->
    <HistoryWidget class="history-widget" />

    <!--Widget de Ultimas Ações-->
    <ActionsWidget class="actions-widget" />

    <!--Modal do Calendario-->
    <AddEventModal
      v-if="isAddEventModalOpen"
      @close="closeAddEventModal"
      @add="addActivity"
      :selectedDate="selectedDate"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Componentes do Widget de Calendário
import Calendar from '../components/Calendar.vue';
import ActivityList from '../components/ActivityList.vue';
import AddEventButton from '../components/AddEventButton.vue';
import AddEventModal from '../components/AddEventModal.vue';

// Placeholders dos outros widgets
import AgendaWidget from '../components/AgendaWidget.vue';
import StatsWidget from '../components/StatsWidget.vue';
import HistoryWidget from '../components/HistoryWidget.vue';
import ActionsWidget from '../components/ActionsWidget.vue';

// --- LÓGICA DO WIDGET DE CALENDÁRIO ---

// A data que o usuário selecionou ativamente. Usada para filtrar a lista de atividades.
const selectedDate = ref(new Date());

// A data que controla o mês/ano exibido no componente Calendário.
// Permite navegar pelos meses sem alterar o dia selecionado.
const viewDate = ref(new Date());

// Array principal de todas as atividades.
// BACKEND: Substituir por uma chamada de API para buscar e persistir dados.
const activities = ref([]);

const isAddEventModalOpen = ref(false);

const monthYearDisplay = computed(() => {
  return viewDate.value.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
});

const nextMonth = () => {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, 1);
};
const prevMonth = () => {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() - 1, 1);
};

// Callback para o evento @date-selected emitido pelo componente Calendário.
const onDateSelected = (date) => {
  selectedDate.value = date;
  if (date.getMonth() !== viewDate.value.getMonth() || date.getFullYear() !== viewDate.value.getFullYear()) {
    viewDate.value = new Date(date);
  }
};

// Função utilitária para comparar se duas datas são o mesmo dia.
const isSameDate = (d1, d2) => {
  if (!d1 || !d2) return false;
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
};

// Filtra a lista completa de atividades para mostrar apenas as do dia selecionado.
const activitiesForSelectedDate = computed(() => activities.value.filter(a => isSameDate(a.date, selectedDate.value)));

const openAddEventModal = () => { isAddEventModalOpen.value = true; };
const closeAddEventModal = () => { isAddEventModalOpen.value = false; };

// Atualiza uma atividade existente no array principal.
const updateActivity = (updatedActivity) => {
  const idx = activities.value.findIndex(a => a.id === updatedActivity.id);
  if (idx !== -1) activities.value[idx] = { ...activities.value[idx], ...updatedActivity };
};

// Adiciona uma nova atividade ao array principal.
const addActivity = (newActivity) => {
  activities.value.push({
    id: Date.now(),
    date: newActivity.date,
    title: newActivity.type || 'Sem título',
    participants: newActivity.participants || '',
    time: newActivity.time || '',
    completed: false
  });
};
</script>

<style scoped>

/* Define o layout principal do dashboard com CSS Grid. */
.home-dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto auto auto;
  grid-template-areas:
    "calendar calendar main-agenda main-agenda"
    "stats stats main-agenda main-agenda"
    "history history actions actions";
  gap: 1.5rem;
  padding: 2rem;
  background-color: #f4f7f9; 
}

.widget-card {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.calendar-widget { grid-area: calendar; }
.main-agenda-widget { grid-area: main-agenda; }
.stats-widget { grid-area: stats; }
.history-widget { grid-area: history; }
.actions-widget { grid-area: actions; }

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
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;
  padding: 0 0.5rem;
}

.calendar-display-block {
  flex: 1.5;
}
</style>

