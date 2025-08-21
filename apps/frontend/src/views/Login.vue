<template>
  <div class="flex items-center justify-center h-screen bg-cover bg-center">
    <video autoplay muted loop playsinline class="absolute inset-0 w-full h-full object-cover">
      <source src="../../public/videos/climbeVideo.mp4" type="video/mp4" />
    </video>
    <!-- Overlay para escurecer -->
    <div class="absolute inset-0 bg-black/50"></div>

    <!-- Card principal -->
    <div
      class="relative z-10 flex w-11/12 max-w-5xl rounded-2xl bg-white/10 backdrop-blur-md shadow-lg overflow-hidden">
      <!-- Coluna Login -->
      <div class="w-1/2 flex flex-col items-center justify-center px-10 py-12">
        <img src="../../public/img/climbe-logo.png" alt="climb" class="h-10 mb-6" />

        <h2 class="text-white text-xl font-medium mb-6">Portal do Sócio.</h2>
        <input type="email" placeholder="Digite seu email" v-model="email"
          class="w-full px-4 py-3 mb-4 rounded-lg border border-gray-300 bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400" />

        <input type="password" placeholder="Digite sua senha" v-model="password"
          class="w-full px-4 py-3 mb-6 rounded-lg border border-gray-300 bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400" />

        <button @click="login"
          class="w-full py-3 rounded-lg font-semibold text-white bg-cyan-600 hover:bg-cyan-700 transition">
          ACESSAR
        </button>

        <p class="text-white text-sm mt-4">
          É sócio e ainda não tem acesso?
          <a href="#" class="text-purple-400 hover:underline">Clique aqui</a>
        </p>
      </div>

      <!-- Divider gradiente -->
      <div class="w-[2px] bg-gradient-to-b from-cyan-400 via-transparent to-purple-400"></div>

      <!-- Coluna Texto com animação -->
      <div class="w-1/2 flex items-center justify-center p-10">
        <h2 class="text-white text-4xl font-bold leading-snug">
          {{ typedText }}
          <span class="border-r-2 border-white animate-blink ml-1"></span>
        </h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const email = ref("")
const password = ref("")

const login = () => {
  console.log("Email:", email.value, "Senha:", password.value)
  router.push("/dashboard")
}

// Texto animado
const fullText = "A melhor empresa precisa dos melhores orientadores"
const typedText = ref("")

onMounted(() => {
  let index = 0
  const typingInterval = setInterval(() => {
    if (index < fullText.length) {
      typedText.value += fullText[index]
      index++
    } else {
      clearInterval(typingInterval)
    }
  }, 50) // 50ms por letra, ajuste para mais rápido/lento
})
</script>

<style>
@keyframes blink {

  0%,
  50%,
  100% {
    opacity: 1;
  }

  25%,
  75% {
    opacity: 0;
  }
}

.animate-blink {
  animation: blink 1s infinite;
}
</style>
