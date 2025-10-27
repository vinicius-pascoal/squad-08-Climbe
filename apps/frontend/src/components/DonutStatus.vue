<template>
  <div class="bg-white rounded-2xl shadow-lg p-4 flex justify-center items-center gap-6">
    <div class="space-y-4 text-slate-800">
      <div class="flex items-center gap-3">
        <span class="inline-grid place-items-center size-5 rounded-full ring-2 ring-green-600"
          :style="{ background: greenFill }"></span>
        <span class="font-semibold">{{ pAprovado }}%</span>
        <span class="font-semibold">Aprovado</span>
      </div>

      <div class="flex items-center gap-3">
        <span class="inline-grid place-items-center size-5 rounded-full ring-2 ring-amber-600"
          :style="{ background: amberFill }"></span>
        <span class="font-semibold">{{ pRevisao }}%</span>
        <span class="font-semibold">Em Revisão</span>
      </div>

      <div class="flex items-center gap-3">
        <span class="inline-grid place-items-center size-5 rounded-full ring-2 ring-red-600"
          :style="{ background: redFill }"></span>
        <span class="font-semibold">{{ pReprovado }}%</span>
        <span class="font-semibold">Reprovados</span>
      </div>
    </div>
    <div class="relative size-36 rounded-full shadow-md ring-1 ring-black/5 grid place-items-center"
      :style="{ background: donutBg }" role="img" :aria-label="ariaLabel">
      <div class="absolute inset-5 bg-white rounded-full shadow-inner"></div>
      <div class="absolute size-3 rounded-full bg-white border border-slate-300"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  aprovado: number
  revisao: number
  reprovado: number
  totalsArePercent?: boolean
}>(), { totalsArePercent: true })

const greenFill = 'var(--color-c8f0d3)'
const amberFill = 'var(--color-f8e0b5)'
const redFill = 'var(--color-efc2c2)'
const sepColor = 'var(--color-e5e7eb)'

const clamp0 = (n: number) => Math.max(0, Number.isFinite(n) ? n : 0)

const pct = computed(() => {
  let a = clamp0(props.aprovado)
  let r = clamp0(props.revisao)
  let d = clamp0(props.reprovado)
  const sum = a + r + d

  if (!props.totalsArePercent) {
    if (sum > 0) { a = a / sum * 100; r = r / sum * 100; d = d / sum * 100 }
    else { a = r = d = 0 }
  } else {
    if (sum > 0) { a = a / sum * 100; r = r / sum * 100; d = d / sum * 100 }
  }

  const round = (x: number) => Math.round(x)
  return { a: round(a), r: round(r), d: round(d) }
})

const pAprovado = computed(() => pct.value.a)
const pRevisao = computed(() => pct.value.r)
const pReprovado = computed(() => pct.value.d)

const donutBg = computed(() => {
  const aEnd = pAprovado.value
  const rEnd = aEnd + pRevisao.value
  const dEnd = 100

  const sep = 0.6
  const aSepStart = Math.max(0, aEnd - sep)
  const rSepStart = Math.max(aEnd, rEnd - sep)

  const slices = `conic-gradient(
    ${greenFill} 0% ${aSepStart}%,
    ${sepColor} ${aSepStart}% ${aEnd}%,
    ${amberFill} ${aEnd}% ${rSepStart}%,
    ${sepColor} ${rSepStart}% ${rEnd}%,
    ${redFill} ${rEnd}% ${dEnd}%
  )`
  return slices
})

const ariaLabel = computed(
  () => `Aprovado ${pAprovado.value}%, Em revisão ${pRevisao.value}%, Reprovados ${pReprovado.value}%`
)
</script>
