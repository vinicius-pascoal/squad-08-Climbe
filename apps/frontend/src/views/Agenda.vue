<template>
  <section class="  text-slate-800 ">
    <div class="mx-auto w-full max-w-7xl px-4 pt-6 pb-3 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 ">
      <div class="bg-white rounded-2xl p-5 shadow-lg">
        <p class="text-sm font-semibold tracking-wide">Contratos que&nbsp; vencem esse mês</p>
        <div class="text-5xl font-bold mt-2 leading-none">4</div>
      </div>

      <div class="bg-white rounded-2xl  p-4 md:px-6 md:py-4 flex items-center gap-4 shadow-lg">
        <div class="size-20 rounded-full grid place-items-center"
          :style="{ background: `conic-gradient(var(--color-94a3b8) 0 ${completedPct}%, var(--color-e2e8f0) ${completedPct}% 100%)` }">
          <div class="size-12 bg-white rounded-full"></div>
        </div>
        <div class="flex-1 ">
          <p class="text-sm font-semibold">Tarefas Concluídas</p>
          <div class="mt-2 flex items-center gap-4 text-xs">
            <div class="flex items-center gap-1">
              <span class="inline-block size-3 rounded-sm bg-slate-400"></span>
              <span>{{ completedPct }}% Concluídas</span>
            </div>
            <div class="flex items-center gap-1">
              <span class="inline-block size-3 rounded-sm bg-slate-200 outline outline-1 outline-slate-300"></span>
              <span>{{ 100 - completedPct }}% Pendentes</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-end">
        <input v-if="hasPerm('Reuniões — Agendar') || (currentUser && currentUser.value?.cargoNome === 'Admin')"
          type="button" value="Cadastrar reunião" @click="goToAgendarReuniao"
          class="cadastro shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-[#CAD8FD] border border-[#3B67D0] text-white rounded-lg px-4 py-2 hover cursor-pointer ml-16" />
        <input v-else disabled type="button" value="Cadastrar reunião"
          class="cadastro rounded-lg bg-slate-300 text-white px-4 py-2 ml-16 opacity-60" />
      </div>
    </div>

    <div class="mx-auto w-full max-w-7xl px-4 pt-3 pb-0 flex items-center gap-4">
      <button class="pb-3 text-base font-semibold  rounded-t-xl px-6 py-1 "
        :class="activeTab === 'agenda' ? 'text-brand-10b981 bg-white' : 'text-slate-400 bg-gray-300'"
        @click="activeTab = 'agenda'">
        <span class=" text-shadow-lg">
          Agenda
        </span>
      </button>
      <button class="pb-3 text-base font-semibold  rounded-t-xl px-6 py-1"
        :class="activeTab === 'board' ? 'text-brand-10b981 bg-white' : 'text-slate-400 bg-gray-300'"
        @click="activeTab = 'board'">
        <span class=" text-shadow-lg">
          Task Board
        </span>
      </button>

    </div>
    <div class=" bg-white rounded-xl mx-auto w-full max-w-7xl p-4 shadow-lg">
      <div class="bg-white rounded-t-[22px] px-4 pt-4 pb-0 flex items-center gap-6">

        <div class=" flex items-center gap-2 w-full">
          <div class="text-[28px] font-extrabold mr-4">{{ monthTitle }}</div>
          <div class=" ml-auto bg-slate-200/70 rounded-xl p-1 inline-flex">
            <button class="px-3 py-1.5 text-sm rounded-lg transition"
              :class="view === 'week' ? 'bg-white shadow text-slate-900' : 'text-slate-600'"
              @click="view = 'week'">Semanal</button>
            <button class="px-3 py-1.5 text-sm rounded-lg transition"
              :class="view === 'month' ? 'bg-white shadow text-slate-900' : 'text-slate-600'"
              @click="view = 'month'">Mensal</button>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'agenda'" class="overflow-y-auto p-4">
        <WeeklyView v-if="view === 'week'" :start-hour="startHour" :end-hour="endHour" :week-start="weekStart"
          :events="events" @event-click="onEventClick" />
        <MonthlyView v-else :month-start="monthStart" :events-raw="userEventsRaw" @event-click="onEventClick" />
      </div>
      <div v-else class="p-4">
        <TaskBoard />
      </div>
    </div>

    <EventDetailsModal v-model="showDetails" :event="selectedEvent" />
  </section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch, getCurrentInstance } from 'vue'
import { hasPermission as hasPerm, currentUser } from '../services/auth'
import WeeklyView from '../components/WeeklyView.vue'
import type { CalendarEvent } from '../components/calendar-types'
import { listUserEvents } from '../services/calendar'
import MonthlyView from '../components/MonthlyView.vue'
import TaskBoard from '../components/TaskBoard.vue'
import EventDetailsModal from '../components/modals/EventDetailsModal.vue'
import router from '../router'

const activeTab = ref<'agenda' | 'board'>('agenda')
const view = ref<'week' | 'month'>('week')
const completedPct = 79

const startHour = 8
const endHour = 20

function startOfWeek(d: Date) {
  const copy = new Date(d)
  const day = copy.getDay() // 0 = Sunday
  copy.setDate(copy.getDate() - day)
  copy.setHours(0, 0, 0, 0)
  return copy
}

const weekStart = ref<Date>(startOfWeek(new Date()))

const monthTitle = computed(() =>
  weekStart.value.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    .replace(/^\w/, (c: string) => c.toUpperCase())
)

const events = ref<CalendarEvent[]>([])
const googleWarningShown = ref(false)
const userEventsRaw = ref<any[]>([])
const monthStart = computed(() => new Date(weekStart.value.getFullYear(), weekStart.value.getMonth(), 1))

/** Carrega eventos do backend (local + google) e mapeia para o formato esperado pelo WeeklyView */
async function loadWeeklyEvents() {
  try {
    const items = await listUserEvents()
    // if there's no google token, recommend the user to connect Google to see personal calendar events
    const gtoken = localStorage.getItem('google_access_token')
    const inst = getCurrentInstance()
    const $notify = inst?.appContext.config.globalProperties.$notify
    if (!gtoken && !googleWarningShown.value) {
      googleWarningShown.value = true
      $notify?.info?.('Conecte sua conta Google (Login -> Google) para exibir eventos do seu Google Calendar');
    }
    userEventsRaw.value = items || [];
    const base = new Date(weekStart.value);
    const baseMidnight = new Date(base.getFullYear(), base.getMonth(), base.getDate())

    const mapped: CalendarEvent[] = (items || [])
      .map((ev: any) => {
        if (!ev.start) return null
        // ev.start can be ISO datetime or date-only 'YYYY-MM-DD'
        let startDate: Date
        if (typeof ev.start === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(ev.start)) {
          const parts = ev.start.split('-').map((s: string) => Number(s))
          startDate = new Date(parts[0], (parts[1] || 1) - 1, parts[2] || 1, 9, 0, 0)
        } else {
          startDate = new Date(ev.start)
        }
        let endDate: Date
        if (ev.end && typeof ev.end === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(ev.end)) {
          const endParts = ev.end.split('-').map((s: string) => Number(s));
          endDate = new Date(endParts[0], (endParts[1] || 1) - 1, endParts[2] || 1, 10, 0, 0);
        } else if (ev.end) {
          endDate = new Date(ev.end)
        } else {
          endDate = new Date(startDate.getTime() + 60 * 60 * 1000)
        }

        // calcular dayIndex relativo ao weekStart (0..6)
        const startDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
        const diffDays = Math.round((startDay.getTime() - baseMidnight.getTime()) / (24 * 60 * 60 * 1000))
        const dayIndex = diffDays

        const pad = (n: number) => String(n).padStart(2, '0')
        const toHM = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`

        return {
          id: ev.id || `evt-${Math.random().toString(36).slice(2, 9)}`,
          dayIndex,
          start: toHM(startDate),
          end: toHM(endDate),
          title: ev.summary || ev.title || 'Evento',
          resume: ev.description || '',
          color: ev.color || (ev.source === 'flow' ? 'mint' : 'blue'),
        }
      })
      .filter((x: any) => x && typeof x.dayIndex === 'number' && x.dayIndex >= 0 && x.dayIndex < 7)

    events.value = mapped
  } catch (e) {
    console.error('Erro ao carregar eventos semanais:', e)
  }
}

onMounted(() => loadWeeklyEvents())
watch(weekStart, () => loadWeeklyEvents())

/** Modal de detalhes */
const showDetails = ref(false)
const selectedEvent = ref<any | null>(null)

function onEventClick(ev: CalendarEvent) {
  selectedEvent.value = {
    ...ev,
    contextTitle: 'Apresentação do Projeto',
    label: 'Apresentação',
    status: 'A seguir',
    priority: 'Alta',
    responsaveis: [
      { name: 'The Rock', avatar: '/avatars/rock.jpg' },
      { name: 'Davi Brito', avatar: '/avatars/davi.jpg' },
    ],
    comments: [
      { id: 'c1', author: 'The Rock', text: 'Aqui está o link do drive para a apresentação: Drive', createdAt: '1h' }
    ]
  }
  showDetails.value = true
}


/** Navega para /AgendarReuniao ao clicar no botão */
const goToAgendarReuniao = () => {
  router.push('/AgendarReuniao')
}
</script>

<style>
.cadastro {
  background-image: url('/icones/cadastro.svg');
  background-repeat: no-repeat;
  background-position: 5px center;
  padding-left: 40px;
}
</style>
