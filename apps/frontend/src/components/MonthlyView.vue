<template>
  <div class="monthly-view">
    <div class="grid grid-cols-7 gap-1 text-xs text-brand-5f6060 dark:text-brand-e5e7eb mb-2">
      <div v-for="d in ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']" :key="d" class="text-center font-semibold">{{ d }}
      </div>
    </div>

    <div class="grid grid-cols-7 gap-2">
      <div v-for="cell in cells" :key="cell.key"
        class="min-h-24 p-2 border border-brand-e5e7eb dark:border-brand-0e9989 rounded-lg bg-white dark:bg-brand-0a0a0a transition-colors">
        <div class="text-sm font-semibold mb-1 text-brand-000 dark:text-white">{{ cell.label }}</div>
        <ul class="space-y-1">
          <li v-for="ev in cell.events" :key="ev.id"
            class="text-xs p-1 rounded bg-brand-f6f7f8 dark:bg-brand-0e9989 hover:bg-brand-e5e7eb dark:hover:bg-brand-0e9a97 cursor-pointer transition-colors"
            @click="$emit('event-click', ev)">
            <div class="truncate font-medium text-brand-000 dark:text-white">{{ ev.summary || ev.title }}</div>
            <div class="text-[11px] text-brand-5f6060 dark:text-brand-e5e7eb">{{ ev.timeLabel }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ monthStart: Date, eventsRaw: any[] }>()
const emit = defineEmits<{ (e: 'event-click', ev: any): void }>()

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}
function daysInMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
}

function normalizeEventDate(ev: any) {
  // ev.start may be ISO datetime or date-only 'YYYY-MM-DD'
  if (!ev || !ev.start) return null
  const s = String(ev.start)
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [y, m, day] = s.split('-').map(Number)
    return new Date(y, (m || 1) - 1, day || 1)
  }
  return new Date(s)
}

const cells = computed(() => {
  const ms = startOfMonth(new Date(props.monthStart))
  const total = daysInMonth(ms)
  const firstWeekday = ms.getDay() // 0..6
  const out: any[] = []

  // leading blanks
  for (let i = 0; i < firstWeekday; i++) {
    out.push({ key: `blank-${i}`, label: '', events: [] })
  }

  for (let day = 1; day <= total; day++) {
    const d = new Date(ms.getFullYear(), ms.getMonth(), day)
    const dayIso = d.toISOString().slice(0, 10)

    const evs = (props.eventsRaw || []).map((ev: any) => {
      const d0 = normalizeEventDate(ev)
      if (!d0) return null
      const same = d0.getFullYear() === d.getFullYear() && d0.getMonth() === d.getMonth() && d0.getDate() === d.getDate()
      if (!same) return null
      // derive time label
      let timeLabel = ''
      if (ev.start && typeof ev.start === 'string' && ev.start.includes('T')) {
        try { timeLabel = new Date(ev.start).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) } catch { }
      }
      return { ...ev, timeLabel }
    }).filter(Boolean)

    out.push({ key: dayIso, label: String(day), events: evs })
  }

  // fill to complete the last week (optional)
  while (out.length % 7 !== 0) out.push({ key: `blank-tail-${out.length}`, label: '', events: [] })

  return out
})
</script>

<style scoped>
.monthly-view {}

.min-h-24 {
  min-height: 6rem
}
</style>
