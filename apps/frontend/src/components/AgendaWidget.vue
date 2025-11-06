<template>
  <div class="widget-card">
    <h3 class="text-base font-semibold text-slate-800 mb-3">Agenda</h3>

    <div v-if="loading" class="space-y-2">
      <div v-for="n in 5" :key="n" class="h-12 rounded-lg bg-slate-100 animate-pulse"></div>
    </div>

    <div v-else-if="eventos.length === 0" class="text-center py-8 text-sm text-slate-500">
      Nenhum evento agendado
    </div>

    <div v-else class="space-y-2 overflow-y-auto agenda-scroll">
      <button v-for="ev in eventos" :key="ev.id" @click="onEventClick(ev)"
        class="w-full text-left p-3 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-sidebar transition-colors"
        :class="{ 'border-l-4 border-l-sidebar': ev.source === 'flow' }">
        <div class="flex items-start justify-between gap-2">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-slate-800 truncate">{{ ev.summary }}</p>
            <p v-if="ev.start" class="text-xs text-slate-500 mt-0.5">
              {{ formatDate(ev.start) }}
            </p>
            <p v-else-if="ev.source === 'flow'" class="text-xs text-slate-500 mt-0.5 italic">
              Pendente - aguardando agendamento
            </p>
            <p v-if="ev.description" class="text-xs text-slate-600 mt-1 line-clamp-2">{{ ev.description }}</p>
          </div>
          <span v-if="ev.source === 'flow'" class="text-xs font-semibold text-sidebar">Fluxo</span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { listUserEvents } from '../services/calendar'

type Evento = {
  id: string
  source: string
  summary: string
  description?: string
  start?: string
  flowId?: number
  stepId?: number
  stepType?: string
}

const emit = defineEmits<{
  (e: 'eventClick', ev: Evento): void
}>()

const eventos = ref<Evento[]>([])
const loading = ref(false)

function formatDate(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
  } catch {
    return iso
  }
}

function onEventClick(ev: Evento) {
  emit('eventClick', ev)
}

async function loadEvents() {
  try {
    loading.value = true
    const items = await listUserEvents()
    eventos.value = (items || [])
      .filter((ev: any) => ev.source === 'flow' || ev.start) // eventos de fluxo sempre aparecem, outros precisam de data
      .sort((a: any, b: any) => {
        // Eventos sem data (fluxo) vêm primeiro, depois ordenar por data
        if (!a.start && !b.start) return 0
        if (!a.start) return -1
        if (!b.start) return 1
        return new Date(a.start).getTime() - new Date(b.start).getTime()
      })
      .map((ev: any) => ({
        id: ev.id,
        source: ev.source || 'calendar',
        summary: ev.summary || 'Evento',
        description: ev.description || '',
        start: ev.start,
        flowId: ev.flowId,
        stepId: ev.stepId,
        stepType: ev.stepType,
      }))
  } catch (e) {
    console.error('Erro ao carregar eventos da agenda:', e)
  } finally {
    loading.value = false
  }
}

onMounted(loadEvents)

defineExpose({ loadEvents })
</script>

<style scoped>
.widget-card {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.agenda-scroll {
  max-height: 280px;
  /* Aproximadamente 3 itens (cada item ~80-90px) */
  overflow-y: auto;
  padding-right: 0.25rem;
}

.agenda-scroll::-webkit-scrollbar {
  width: 6px;
}

.agenda-scroll::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.agenda-scroll::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.agenda-scroll::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
