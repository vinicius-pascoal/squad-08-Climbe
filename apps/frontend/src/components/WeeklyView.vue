<template>
  <div class="w-full">
    <!-- Cabeçalho: dias + pílulas de data -->
    <div class="grid grid-cols-8 items-end text-center text-sm font-semibold text-slate-600 mb-2">
      <div></div>
      <div v-for="d in weekDays" :key="d.date" class="pb-1">
        <div class="uppercase tracking-wide">{{ d.label }}</div>
        <div
          class="mt-2 inline-flex items-center justify-center bg-white shadow px-4 py-1 rounded-xl border text-slate-900">
          {{ d.date }}
        </div>
      </div>
    </div>

    <!-- Grade -->
    <div class="grid grid-cols-8">
      <!-- Trilho de horas -->
      <div class="pr-2">
        <div class="relative" :style="{ height: colHeight + 'px' }">
          <div v-for="h in hours" :key="h" class="h-16 text-right pr-2 text-[11px] text-slate-500">
            {{ String(h).padStart(2, '0') }}:00
          </div>
        </div>
      </div>

      <!-- Colunas dos dias -->
      <div v-for="day in 7" :key="day" class="border-l border-slate-200/80">
        <div class="relative bg-white" :style="{
          height: colHeight + 'px',
          backgroundImage: 'linear-gradient(to bottom, rgba(226,232,240,0.7) 1px, transparent 1px)',
          backgroundSize: '100% ' + pxPerHour + 'px'
        }">
          <!-- Eventos -->
          <div v-for="e in shapedEvents.filter(ev => ev.dayIndex === (day - 1))" :key="e.id"
            class="absolute left-2 right-2 rounded-2xl shadow-md px-4 py-3 text-sm font-semibold select-none"
            :class="colorClass(e.color)" :style="{ top: e.top + 'px', height: e.height + 'px' }" :title="e.title">
            <div class="leading-4">---</div>
            <div class="opacity-60 text-[11px] mt-1">{{ e.start }}–{{ e.end }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CalendarEvent } from './calendar-types'


const props = defineProps<{
  startHour: number
  endHour: number
  weekStart: Date | string
  events: CalendarEvent[]
}>()

const weekStartDate = computed(() => new Date(props.weekStart))

const hours = computed(() => {
  const out: number[] = []
  for (let h = props.startHour; h < props.endHour; h++) out.push(h)
  return out
})

const weekDays = computed(() => {
  const base = new Date(weekStartDate.value)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base); d.setDate(base.getDate() + i)
    return {
      label: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'][i],
      date: d.getDate()
    }
  })
})

const pxPerHour = 64
const colHeight = computed(() => (props.endHour - props.startHour) * pxPerHour)

function parseHM(hm: string) {
  const [h, m] = hm.split(':').map(Number)
  return { h, m }
}
function yFromTime(hm: string) {
  const { h, m } = parseHM(hm)
  return Math.max(0, (h - props.startHour) * pxPerHour + (m / 60) * pxPerHour)
}

const shapedEvents = computed(() =>
  props.events.map(ev => {
    const top = yFromTime(ev.start)
    const height = Math.max(24, yFromTime(ev.end) - top)
    return { ...ev, top, height }
  })
)

function colorClass(c: CalendarEvent['color']) {
  if (c === 'blue') return 'bg-[#93c5fd] text-slate-800'
  if (c === 'green') return 'bg-[#22c55e] text-white'
  return 'bg-[#bbf7d0] text-slate-800'
}

</script>
