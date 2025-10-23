<template>
  <aside class="relative min-h-screen flex sombraTexto fundosidebar" :class="{ collapsed }" role="navigation">
    <!-- COLUNA ESQUERDA (ÍCONES) -->
    <div class="h-full bg-secondary flex flex-col justify-between w-14 shadow-lg">
      <button v-if="collapsed" @click="toggleSidebar" class="relative">
        <img src="/img/logoCircular.svg" class="w-14 h-14 absolute left-20 top-3" alt="climbe" />
      </button>

      <nav class="relative flex-1" :style="{ paddingTop: leftPad + 'px' }">
        <!-- espaçamento e altura padronizados -->
        <ul class="menu px-2 flex flex-col gap-2">
          <li v-for="item in items" :key="item.to" class="relative">
            <RouterLink :to="item.to"
              class="flex items-center justify-center overflow-hidden text-center h-12 relative -left-2 rounded-md"
              :class="{ 'border-l-4 border-white': isActive(item) }"
              :aria-current="isActive(item) ? 'page' : undefined">
              <div class="relative grid place-items-center w-8 h-8">
                <img :src="item.icon" alt="Ícone" class="min-w-6 h-6" />
              </div>
            </RouterLink>
          </li>
        </ul>
      </nav>

      <div class="hover:bg-white/10 flex justify-center mb-5">
        <button>
          <img src="/icones/config.svg" alt="configurações">
        </button>
      </div>
    </div>

    <!-- COLUNA DIREITA (LABELS) -->
    <div v-if="!collapsed" class="bg-sidebar text-white duration-300 rounded-e-xl w-60 shadow-xl overflow-visible">
      <div ref="headerEl" class="px-7 py-5 overflow-hidden cursor-pointer" @click="toggleSidebar">
        <slot name="logo">
          <!-- Light mode -->
          <img src="/img/logoPreta.png" alt="climbe" class="block dark:hidden" />
          <!-- Dark mode -->
          <img src="/img/climbe-logo.png" alt="climbe" class="hidden dark:block" />
        </slot>
      </div>

      <div class="icon-bar px-2 mt-2">
        <nav class="relative flex-1">
          <!-- mesmo espaçamento da coluna esquerda -->
          <ul class="menu px-1 flex flex-col gap-2">
            <li v-for="item in items" :key="item.to" class="menu-item group relative overflow-visible">
              <RouterLink :to="item.to"
                class="menu-link flex items-center gap-3 rounded-full px-3 h-12 overflow-hidden text-center w-full"
                :class="{ 'ativo': isActive(item) }" :aria-current="isActive(item) ? 'page' : undefined">
                <span class="nav-label font-bold text-xl whitespace-nowrap">
                  {{ item.label }}
                </span>
              </RouterLink>
            </li>
          </ul>
        </nav>
      </div>

      <div class="mb-4 flex items-center gap-3 px-3 footer">
        <button @click="logout" class="flex items-center gap-3 w-full py-2 px-3 hover:bg-white/20 rounded-xl">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"></path>
          </svg>
          <span class="font-bold text-lg">Logout</span>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type NavItem = {
  label: string
  to: string
  icon?: any
  exact?: boolean
}

const props = withDefaults(defineProps<{
  items: NavItem[]
  storageKey?: string
  homeAliases?: string[]
}>(), {
  storageKey: 'sidebar:collapsed',
  homeAliases: ['/', '/home']
})

const route = useRoute()
const router = useRouter()
const collapsed = ref(false)

const headerEl = ref<HTMLElement | null>(null)
const leftPad = ref(0)
const CAP_TOP = 10

function measureHeader() {
  const h = headerEl.value?.offsetHeight ?? 0
  leftPad.value = h + CAP_TOP
}

onMounted(async () => {
  const saved = localStorage.getItem(props.storageKey!)
  if (saved === '1') collapsed.value = true

  await nextTick()
  measureHeader()
  window.addEventListener('resize', measureHeader)
  setTimeout(measureHeader, 0)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', measureHeader)
})

function normalize(path: string) {
  if (path === '/') return '/'
  return path.replace(/\/+$/, '')
}

function isHomePath(path: string) {
  const p = normalize(path)
  return props.homeAliases!.map(normalize).includes(p)
}

function isActive(item: NavItem) {
  const current = normalize(route.path)
  const target = normalize(item.to)
  if (isHomePath(target)) return isHomePath(current)
  if (item.exact) return current === target
  return current === target
}

function toggleSidebar() {
  collapsed.value = !collapsed.value
  localStorage.setItem(props.storageKey!, collapsed.value ? '1' : '0')
  nextTick().then(measureHeader)
}

function logout() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('user')
  router.replace('/')
}

watch(() => route.path, () => nextTick().then(measureHeader))
</script>

<style scoped>
@keyframes largura {
  from {
    width: 0;
    opacity: .1;
  }

  to {
    width: 100%;
    opacity: 1;
  }
}

.menu-link.ativo {
  background-color: rgb(255, 255, 255);
  color: #000;
  box-shadow: 3px 5px 10px -2px rgba(0, 0, 0, 0.75) inset;
  animation: largura 0.5s ease-in-out;
}

.menu-link:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.sombraTexto {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.53);
}

.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
}

/* dark mode */
:deep(.dark) .menu-link.ativo {
  background-color: var(--panel) !important;
  color: var(--text) !important;
  box-shadow: none !important;
  border-left: 4px solid var(--accent) !important;
}

:deep(.dark) .menu-link:hover {
  background-color: rgba(255, 255, 255, 0.03) !important;
}

:deep(.dark) .bg-sidebar {
  background-color: var(--sidebar) !important;
}

:deep(.dark) .bg-secondary {
  background-color: var(--secondary) !important;
}

:deep(.dark) .hover\:bg-white\/20:hover {
  background-color: rgba(255, 255, 255, 0.03) !important;
}

.dark .fundosidebar {
  background-color: var(--sidebar) !important;
}
</style>
