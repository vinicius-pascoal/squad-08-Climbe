import { ref, computed } from 'vue'

// contador para lidar com requisições simultâneas
const _count = ref(0)

// visibilidade real do loader (considera tempo mínimo)
const _visible = ref(false)

// tempo mínimo de exibição do loader (ms)
const MIN_DISPLAY_MS = 2000

// timestamp (ms) quando o loader foi mostrado pela primeira vez
let _shownAt: number | null = null

// timer para adiar o clear quando necessário
let _clearTimer: ReturnType<typeof setTimeout> | null = null

export function showLoading() {
  // se havia um timer pendente para esconder, cancelar — novo show interrompe o clear
  if (_clearTimer) {
    clearTimeout(_clearTimer)
    _clearTimer = null
  }

  if (_count.value === 0) {
    _shownAt = Date.now()
    _visible.value = true
  }

  _count.value += 1
}

export function hideLoading() {
  if (_count.value <= 0) return

  _count.value -= 1

  // quando o contador chega a zero, garantimos exibição mínima
  if (_count.value === 0) {
    const now = Date.now()
    const shownAt = _shownAt || now
    const elapsed = now - shownAt
    const remaining = MIN_DISPLAY_MS - elapsed

    if (remaining > 0) {
      // agendar para remover após o restante do tempo mínimo
      _clearTimer = setTimeout(() => {
        // só limpar se ninguém mostrou novamente
        if (_count.value === 0) {
          _shownAt = null
          _clearTimer = null
          _visible.value = false
        }
      }, remaining)
    } else {
      // já passou do mínimo
      _shownAt = null
      _visible.value = false
    }
  }
}

export const isLoading = computed(() => _visible.value)

// utilitário para envolver uma promise e garantir decremento no finally
export async function withLoading<T>(p: Promise<T>): Promise<T> {
  showLoading()
  try {
    return await p
  } finally {
    hideLoading()
  }
}
