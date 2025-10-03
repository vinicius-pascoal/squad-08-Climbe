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
    <AgendaWidget class="main-agenda-widget" />

    <!--Widget das Estatísticas-->
    <StatsWidget class="stats-widget" />

    <!--Widget do Histórico-->
    <HistoryWidget class="history-widget" />

    <!--Widget de Ultimas Ações-->
    <ActionsWidget class="actions-widget" />

    <!--Modal do Calendario-->
    <AddEventModal v-if="isAddEventModalOpen" @close="closeAddEventModal" @add="addActivity"
      :selectedDate="selectedDate" />
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
import googleCalendar from '../services/calendar';
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

// --- LÓGICA DOS OUTROS WIDGETS ABAIXO... ---  
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
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: transparent;
  padding: 0 0.5rem;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  width: 12px;
  height: 12px;
}

.calendar-navigation button:last-of-type {
  background-image: url("data:image/svg+xml,%3Csvg width='7' height='12' viewBox='0 0 7 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5.80367 6L0.145331 11.2332C0.0987453 11.2754 0.0619154 11.3254 0.0369725 11.3805C0.0120296 11.4356 -0.000531673 11.4945 1.71661e-05 11.554C0.000566006 11.6135 0.014214 11.6722 0.0401702 11.7269C0.0661263 11.7816 0.103875 11.8311 0.151233 11.8726C0.198591 11.9141 0.254618 11.9467 0.316071 11.9685C0.377524 11.9904 0.443184 12.0011 0.509249 11.9999C0.575315 11.9988 0.640475 11.9859 0.700959 11.9619C0.761443 11.938 0.816049 11.9035 0.861619 11.8604L6.85845 6.31362C6.94921 6.22966 7 6.11714 7 6C7 5.88286 6.94921 5.77034 6.85845 5.68638L0.861619 0.139579C0.816049 0.0965157 0.761443 0.0620146 0.700959 0.0380697C0.640475 0.0141249 0.575315 0.00121307 0.509249 8.2016e-05C0.443184 -0.00105 0.377524 0.00961971 0.316071 0.0314751C0.254618 0.0533304 0.198591 0.0859365 0.151233 0.127407C0.103875 0.168878 0.0661263 0.21839 0.0401702 0.273076C0.014214 0.327763 0.000566006 0.386539 1.71661e-05 0.446004C-0.000531673 0.505469 0.0120296 0.564442 0.0369725 0.619509C0.0619154 0.674576 0.0987453 0.724645 0.145331 0.766818L5.80367 6Z' fill='black'/%3E%3C/svg%3E");
}

.calendar-navigation button:first-of-type {
  background-image: url("data:image/svg+xml,%3Csvg width='7' height='12' viewBox='0 0 7 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5.80367 6L0.145331 11.2332C0.0987453 11.2754 0.0619154 11.3254 0.0369725 11.3805C0.0120296 11.4356 -0.000531673 11.4945 1.71661e-05 11.554C0.000566006 11.6135 0.014214 11.6722 0.0401702 11.7269C0.0661263 11.7816 0.103875 11.8311 0.151233 11.8726C0.198591 11.9141 0.254618 11.9467 0.316071 11.9685C0.377524 11.9904 0.443184 12.0011 0.509249 11.9999C0.575315 11.9988 0.640475 11.9859 0.700959 11.9619C0.761443 11.938 0.816049 11.9035 0.861619 11.8604L6.85845 6.31362C6.94921 6.22966 7 6.11714 7 6C7 5.88286 6.94921 5.77034 6.85845 5.68638L0.861619 0.139579C0.816049 0.0965157 0.761443 0.0620146 0.700959 0.0380697C0.640475 0.0141249 0.575315 0.00121307 0.509249 8.2016e-05C0.443184 -0.00105 0.377524 0.00961971 0.316071 0.0314751C0.254618 0.0533304 0.198591 0.0859365 0.151233 0.127407C0.103875 0.168878 0.0661263 0.21839 0.0401702 0.273076C0.014214 0.327763 0.000566006 0.386539 1.71661e-05 0.446004C-0.000531673 0.505469 0.0120296 0.564442 0.0369725 0.619509C0.0619154 0.674576 0.0987453 0.724645 0.145331 0.766818L5.80367 6Z' fill='black'/%3E%3C/svg%3E");
  transform: rotate(180deg);
}

.calendar-display-block {
  flex: 1.5;
}
</style>
