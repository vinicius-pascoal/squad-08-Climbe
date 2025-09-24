<template>
  <section class=" bg-[#f4f4f6] text-slate-800 ">
    <!-- Top: cards + CTA -->
    <div class="mx-auto w-full max-w-7xl px-4 pt-6 pb-3 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4">
      <!-- Card: contratos -->
      <div class="bg-white rounded-2xl shadow-sm p-5">
        <p class="text-sm font-semibold tracking-wide">Contratos que&nbsp; vencem esse mês</p>
        <div class="text-5xl font-bold mt-2 leading-none">4</div>
      </div>

      <!-- Card: tarefas (donut) -->
      <div class="bg-white rounded-2xl shadow-sm p-4 md:px-6 md:py-4 flex items-center gap-4">
        <div class="size-20 rounded-full grid place-items-center"
          :style="{ background: `conic-gradient(#94a3b8 0 ${completedPct}%, #e2e8f0 ${completedPct}% 100%)` }">
          <div class="size-12 bg-white rounded-full"></div>
        </div>
        <div class="flex-1">
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

      <!-- CTA -->
      <div class="flex items-center justify-end">
        <input type="button" value="Cadastrar reunião"
          class="cadastro shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-[#CAD8FD] border border-[#3B67D0] text-white rounded-lg px-4 py-2 hover cursor-pointer ml-16" />
      </div>
    </div>

    <!-- Tabs + título + controle de visão -->
    <div class="mx-auto w-full max-w-7xl px-4 pt-3 pb-0 flex items-center gap-6">
      <button class="pb-3 text-base font-semibold" :class="activeTab === 'agenda' ? 'text-[#10b981]' : 'text-slate-400'"
        @click="activeTab = 'agenda'">
        <span class="relative">
          Agenda
          <span v-if="activeTab === 'agenda'"
            class="absolute -bottom-3 left-0 right-0 h-[3px] rounded-full bg-[#10b981]" />
        </span>
      </button>
      <button class="pb-3 text-base font-semibold" :class="activeTab === 'board' ? 'text-slate-800' : 'text-slate-400'"
        @click="activeTab = 'board'">
        <span class="relative">
          Task Board
          <span v-if="activeTab === 'board'"
            class="absolute -bottom-3 left-0 right-0 h-[3px] rounded-full bg-slate-300" />
        </span>
      </button>

    </div>
    <div class=" bg-white rounded-xl mx-auto w-full max-w-7xl p-4 shadow-lg">
      <div class="bg-white rounded-t-[22px] px-4 pt-4 pb-0 flex items-center gap-6">

        <div class="ml-auto flex items-center gap-2">
          <div class="text-[28px] font-extrabold mr-4">{{ monthTitle }}</div>
          <div class="bg-slate-200/70 rounded-xl p-1 inline-flex">
            <button class="px-3 py-1.5 text-sm rounded-lg transition"
              :class="view === 'week' ? 'bg-white shadow text-slate-900' : 'text-slate-600'"
              @click="view = 'week'">Semanal</button>
            <button class="px-3 py-1.5 text-sm rounded-lg transition"
              :class="view === 'month' ? 'bg-white shadow text-slate-900' : 'text-slate-600'"
              @click="view = 'month'">Mensal</button>
          </div>
        </div>
      </div>

      <div class="  overflow-y-auto p-4">
        <WeeklyView v-if="view === 'week'" :start-hour="startHour" :end-hour="endHour" :week-start="weekStart"
          :events="events" />
        <MonthlyPlaceholder v-else />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import WeeklyView from '../components/WeeklyView.vue'
import type { CalendarEvent } from '../components/calendar-types'
import MonthlyPlaceholder from '../components/MonthlyPlaceholder.vue'

const activeTab = ref<'agenda' | 'board'>('agenda')
const view = ref<'week' | 'month'>('week')
const completedPct = 79

const startHour = 8
const endHour = 20
const weekStart = new Date(2025, 7, 24) // 24–30 ago/2025 (como no print)

const monthTitle = computed(() =>
  weekStart.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    .replace(/^\w/, c => c.toUpperCase())
)

const events = ref<CalendarEvent[]>([
  { id: 'e1', dayIndex: 0, start: '09:00', end: '11:30', title: 'teste de titulo', color: 'blue' },
  { id: 'e2', dayIndex: 0, start: '14:00', end: '18:30', title: '---', color: 'green' },
  { id: 'e3', dayIndex: 2, start: '10:30', end: '15:30', title: '---', color: 'blue' },
  { id: 'e4', dayIndex: 5, start: '11:30', end: '13:00', title: '---', color: 'mint' },
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
