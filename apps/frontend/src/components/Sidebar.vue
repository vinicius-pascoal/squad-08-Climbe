<template>
  <aside class="relative min-h-screen flex sombraTexto" :class="{ collapsed }" role="navigation">
    <div class="h-full bg-secondary flex flex-col justify-between w-14 shadow-lg">
      <button v-if="collapsed">
        <img src="/img/logoCircular.svg" class="w-14 h-14 absolute left-20 top-3" alt="climbe" />
      </button>
      <button @click="toggleSidebar" class="p-3 hover:bg-white/10">
        <svg v-if="!collapsed" class="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        <svg v-else class="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5"></path>
        </svg>
      </button>
      <nav class="relative flex-1 mt-20">
        <ul class="menu px-2 ">
          <li v-for="(item, i) in items" :key="item.to" class=" relative ">
            <RouterLink :to="item.to"
              class=" flex items-center px-3 overflow-hidden text-center my-7 first-of-type:mt-0 h-14 relative -left-2  "
              :class="{ 'border-l-4 border-white ': isActive(item) }"
              :aria-current="isActive(item) ? 'page' : undefined">
              <div class="relative flex items-center justify-center w-8 h-8 ">
                <img :src="item.icon" alt="Ícone" class=" min-w-6 h-6" />
              </div>
            </RouterLink>
          </li>
        </ul>
      </nav>
      <div class=" hover:bg-white/10 flex justify-center mb-5 ">
        <button>
          <img src="/icones/config.svg" alt="">
        </button>
      </div>
    </div>

    <!-- Sidebar Expandida (Labels + Logo) -->
    <div v-if="!collapsed" class="bg-sidebar text-white duration-300 rounded-e-xl w-60 shadow-xl">
      <div class="px-7 py-5 overflow-hidden">
        <slot name="logo">
          <img src="/img/logoBranca.png" class="" alt="climbe" />
        </slot>
      </div>
      <div class="icon-bar p-2">
        <nav class="relative flex-1">
          <ul class="menu px-2 ">
            <li v-for="(item, i) in items" :key="item.to" class="menu-item group relative">
              <div class="h-3 bg-sidebar bordaT " :class="{ 'bordaT ': isActive(item) }"></div>
              <RouterLink :to="item.to"
                class="menu-link flex items-center gap-3 rounded-full px-3 py-3 overflow-hidden text-center h-16"
                :class="{ 'ativo': isActive(item) }" :aria-current="isActive(item) ? 'page' : undefined">
                <span v-if="!collapsed" class="nav-label font-bold text-xl whitespace-nowrap">
                  {{ item.label }}
                </span>
              </RouterLink>
              <div class="h-3 bg-sidebar bordaB " :class="{ 'bordaB ': isActive(item) }"></div>
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
import { ref } from 'vue'
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
}>(), {
  storageKey: 'sidebar:collapsed'
})

const route = useRoute()
const collapsed = ref(false)

function isActive(item: NavItem) {
  return route.path === item.to || (item.exact && route.path === item.to)
}

function toggleSidebar() {
  collapsed.value = !collapsed.value
  localStorage.setItem(props.storageKey!, collapsed.value ? '1' : '0')
}


const router = useRouter();

function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');

  router.replace('/');
}

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
  width: calc(100% + 1rem);
  color: #000;
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
  box-shadow: 3px 5px 10px -2px rgba(0, 0, 0, 0.75) inset;
  animation: largura 0.5s ease-in-out;
}

.menu-link:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.bordaT {
  border-bottom-right-radius: 50px;
  position: relative;
  top: 10px;
  height: 10px;
  width: calc(100% + 1rem);
}

.bordaB {
  border-top-right-radius: 50px;
  position: relative;
  bottom: 10px;
  height: 10px;
  width: calc(100% + 1rem);
}

.sombraTexto {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.53);
}

.sidebar.collapsed .collapse-thumb {
  right: -6px;
}

.collapse-thumb:hover {
  background: #f3f3f3;
}

.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
