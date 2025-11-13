<template>
  <!-- Copiado do index.html e adaptado para Vue + funcionalidades existentes -->
  <aside class="sidebar flex-shrink-0 flex flex-col justify-between p-4 h-screen overflow-hidden w-64"
    role="navigation">
    <div class="flex-1 overflow-y-auto">
      <div class="mb-10 text-center">
        <!-- usar a logo branca do projeto -->
        <img src="/img/logoBranca.png" alt="climbe" class="mx-auto w-48 h-auto" />
      </div>

      <nav id="sidebar-nav" class="space-y-3">
        <ul class="flex flex-col gap-3">
          <li v-for="item in items" :key="item.to">
            <RouterLink :to="item.to"
              :class="['flex items-center px-4 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors', isActive(item) ? 'active' : '']"
              :aria-current="isActive(item) ? 'page' : undefined">
              <!-- label maior e com mais espaçamento vertical -->
              <span class="text-lg truncate">{{ item.label }}</span>
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>

    <div class="space-y-2">
      <button @click="logout" class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 w-full">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"></path>
        </svg>
        <span>Log Out</span>
      </button>
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
  homeAliases?: string[]
}>(), {
  homeAliases: ['/', '/home']
})

const route = useRoute()
const router = useRouter()

const headerEl = ref<HTMLElement | null>(null)
const leftPad = ref(0)
const CAP_TOP = 10

function measureHeader() {
  const h = headerEl.value?.offsetHeight ?? 0
  leftPad.value = h + CAP_TOP
}

onMounted(async () => {
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

// removed collapse/toggle behavior per design: sidebar is always fixed width

function logout() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('user')
  router.replace('/')
}

watch(() => route.path, () => nextTick().then(measureHeader))
</script>

<style scoped>
/* estilos copiados/compatíveis com index.html */
.sidebar {
  /* Use CSS variables so the sidebar follows theme variables (with sensible fallbacks)
     but keep text white by default so sidebar text remains white in light mode.
     Dark mode rules (with !important) will override this when `.dark` is set. */
  background: linear-gradient(180deg, var(--sidebar, #0b9a6f) 0%, var(--sidebarSecondary, rgb(24, 176, 155)) 100%);
  color: #ffffff;
  transition: background-color .2s ease, color .2s ease;
}

.sidebar a:hover,
.sidebar a.active {
  background-color: rgba(255, 255, 255, 0.12);
  transition: background-color .15s ease;
}

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
  background-color: var(--panel, #ffffff);
  /* keep active label readable in light mode too */
  color: #ffffff;
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
:deep(.dark) .sidebar {
  /* Dark sidebar gradient using theme variables */
  background: linear-gradient(180deg, var(--sidebar, #1E2436) 0%, var(--sidebarSecondary, #485780) 100%) !important;
  color: var(--text) !important;
}

:deep(.dark) .sidebar a:hover,
:deep(.dark) .sidebar a.active {
  background-color: rgba(255, 255, 255, 0.04) !important;
}

:deep(.dark) .sidebar a.active {
  color: var(--text) !important;
  background-color: rgba(255, 255, 255, 0.05) !important;
  box-shadow: none !important;
  border-left: 4px solid var(--accent) !important;
}

:deep(.dark) .sidebar button {
  color: var(--text) !important;
}

:deep(.dark) .sidebar img {
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.6));
}
</style>
