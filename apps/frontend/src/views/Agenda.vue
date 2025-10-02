<template>
  <section class=" bg-brand-f4f4f6 text-slate-800 ">
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
        <input type="button" value="Cadastrar reunião"
          class="cadastro shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-brand-cad8fd border border-brand-3b67d0 text-white rounded-lg px-4 py-2 hover cursor-pointer ml-16" />
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
          :events="events" />
        <MonthlyPlaceholder v-else />
      </div>
      <div v-else class="p-4">
        <TaskBoard />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import WeeklyView from '../components/WeeklyView.vue'
import type { CalendarEvent } from '../components/calendar-types'
import MonthlyPlaceholder from '../components/MonthlyPlaceholder.vue'
import TaskBoard from '../components/TaskBoard.vue'

const activeTab = ref<'agenda' | 'board'>('agenda')
const view = ref<'week' | 'month'>('week')
const completedPct = 79

const startHour = 8
const endHour = 20
const weekStart = new Date(2025, 7, 24)

const monthTitle = computed(() =>
  weekStart.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    .replace(/^\w/, c => c.toUpperCase())
)

const events = ref<CalendarEvent[]>([
  { id: 'e1', dayIndex: 0, start: '09:00', end: '11:30', title: 'reuniao com cliente', color: 'blue', resume: 'Reunião com o cliente para discutir os requisitos do projeto.' },
  { id: 'e2', dayIndex: 0, start: '14:00', end: '18:30', title: 'Almoço com a equipe', color: 'green', resume: 'Almoço com a equipe para fortalecer o relacionamento e discutir ideias.' },
  { id: 'e3', dayIndex: 2, start: '10:30', end: '15:30', title: 'brainstorming', color: 'blue', resume: 'Sessão de brainstorming para gerar novas ideias e soluções criativas.' },
  { id: 'e4', dayIndex: 5, start: '11:30', end: '13:00', title: 'Revisão do código', color: 'mint', resume: 'Revisão do código para garantir a qualidade e aderência aos padrões estabelecidos.' },
  { id: 'e5', dayIndex: 1, start: '11:00', end: '13:00', title: 'Revisão do código', color: 'mint', resume: 'Revisão do código para garantir a qualidade e aderência aos padrões estabelecidos.' },
  { id: 'e6', dayIndex: 1, start: '13:30', end: '15:00', title: 'Revisão do código', color: 'mint', resume: 'Revisão do código para garantir a qualidade e aderência aos padrões estabelecidos.' },
  { id: 'e7', dayIndex: 3, start: '15:00', end: '17:00', title: 'Almoço com a equipe', color: 'green', resume: 'Almoço com a equipe para fortalecer o relacionamento e discutir ideias.' },
  //{ id: 'e4', dayIndex: 4, start: '6:00', end: '20:00', title: 'demonstracao', color: 'green' },
])
</script>

<style>
.cadastro {
  background-image: url('/icones/cadastro.svg');
  background-repeat: no-repeat;
  background-position: 5px center;
  padding-left: 40px;
}
</style>
