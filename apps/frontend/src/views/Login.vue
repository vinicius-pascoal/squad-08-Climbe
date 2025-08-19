<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center h-screen bg-[#011015]">
      <div class="relative flex items-center justify-center perspective-[800px]">
        <div class="absolute w-48 h-48 rounded-full border-b-8 border-white animate-[rotate1_2s_linear_infinite]"></div>
        <div class="absolute w-48 h-48 rounded-full border-r-8 border-teal-400 animate-[rotate2_2s_linear_infinite]">
        </div>
        <div class="absolute w-48 h-48 rounded-full border-r-8 border-pink-600 animate-[rotate3_2s_linear_infinite]">
        </div>
        <span class="text-white mt-56">Carregando...</span>
      </div>
    </div>

    <!-- Tela de login -->
    <div v-else class="relative w-screen h-screen overflow-hidden">
      <video autoplay muted loop playsinline
        class="absolute inset-0 w-full h-full object-cover brightness-50 blur-[1px]">
        <source src="/apps/frontend/public/videos/climbeVideo.mp4" type="video/mp4" />
      </video>

      <div class="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/50"></div>

      <div class="relative z-10 flex items-center justify-center h-full p-6">
        <div
          class="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 sm:p-12 max-w-4xl w-full flex flex-col items-center gap-6 shadow-2xl overflow-hidden">
          <!-- Logo -->
          <img src="/apps/frontend/public/img/climbe-logo.png" alt="Logo"
            class="max-w-[140px] drop-shadow-lg hover:scale-105 transition" />

          <p class="text-2xl sm:text-3xl font-semibold text-white drop-shadow-md">Portal do Sócio.</p>

          <div class="flex flex-col sm:flex-row items-center gap-8 w-full max-w-3xl">
            <!-- Formulário -->
            <form class="flex flex-col gap-4 w-full max-w-sm" @submit.prevent="showSignup ? signup() : login()">
              <input v-if="showSignup" v-model="fullName" type="text" placeholder="Digite seu nome"
                class="w-full px-4 py-3 rounded-lg border border-white/40 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-teal-400"
                required />
              <input v-model="email" type="email" placeholder="Digite seu email"
                class="w-full px-4 py-3 rounded-lg border border-white/40 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-teal-400"
                required />
              <input v-model="password" type="password" placeholder="Digite sua senha"
                class="w-full px-4 py-3 rounded-lg border border-white/40 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-teal-400"
                required />

              <!-- Botão -->
              <button type="submit" class="relative py-3 rounded-lg font-semibold text-white shadow-md transition min-w-[160px]
                disabled:opacity-60 disabled:cursor-not-allowed
                " :class="{
                  'bg-teal-500 hover:bg-teal-600': btnStatus === 'idle',
                  'bg-gray-500 cursor-wait': btnStatus === 'loading',
                  'bg-green-500': btnStatus === 'success',
                  'bg-red-500': btnStatus === 'error'
                }" :disabled="btnStatus === 'loading'">
                <span v-if="btnStatus === 'idle'">{{ showSignup ? 'Cadastrar' : 'Acessar' }}</span>
                <span v-else-if="btnStatus === 'loading'" class="flex items-center justify-center gap-2">
                  Carregando...
                  <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                </span>
                <span v-else-if="btnStatus === 'success'">✔️ Concluído</span>
                <span v-else-if="btnStatus === 'error'">❌ Algo deu errado</span>
              </button>

              <span v-if="!showSignup" class="text-white text-sm">
                É sócio e ainda não tem acesso?
                <a href="#" @click.prevent="showSignup = true" class="text-teal-400 hover:underline">Clique aqui</a>
              </span>
              <span v-else class="text-white text-sm">
                Já tem uma conta?
                <a href="#" @click.prevent="showSignup = false" class="text-teal-400 hover:underline">Faça login</a>
              </span>
            </form>

            <!-- Divider -->
            <div
              class="hidden sm:flex h-60 w-px bg-gradient-to-b from-transparent via-teal-400 to-transparent animate-pulse">
            </div>

            <!-- Texto animado -->
            <div class="flex-1 flex items-center justify-center min-h-[80px]">
              <p class="text-2xl sm:text-3xl font-semibold text-white drop-shadow-md relative text-left max-w-xs">
                {{ displayText }}<span class="text-teal-400 animate-pulse">|</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

// States
const loading = ref(false)
const email = ref("")
const password = ref("")
const fullName = ref("")
const showSignup = ref(false)
const btnStatus = ref<"idle" | "loading" | "success" | "error">("idle")

// Typewriter
const displayText = ref("")
const fullText = "A melhor empresa precisa dos melhores orientadores"
let typeIndex = 0
const typeSpeed = 80

const startTypewriter = () => {
  const typeNext = () => {
    if (typeIndex < fullText.length) {
      displayText.value += fullText.charAt(typeIndex)
      typeIndex++
      setTimeout(typeNext, typeSpeed)
    }
  }
  setTimeout(typeNext, 1000)
}

onMounted(startTypewriter)

// Funções
const login = async () => {
  loading.value = true
  btnStatus.value = "loading"
  try {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.value, password: password.value }),
    })

    if (res.status === 403) {
      btnStatus.value = "error"
      return
    }
    if (!res.ok) throw new Error(`Erro ${res.status}`)

    const { token } = await res.json()
    localStorage.setItem("token", token)
    btnStatus.value = "success"
    setTimeout(() => router.push("/main"), 1500)
  } catch (err) {
    console.error("Login falhou:", err)
    btnStatus.value = "error"
  } finally {
    loading.value = false
    setTimeout(() => (btnStatus.value = "idle"), 4000)
  }
}

const signup = async () => {
  loading.value = true
  btnStatus.value = "loading"
  try {
    const res = await fetch("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: fullName.value, email: email.value, password: password.value }),
    })
    if (!res.ok) throw new Error(`Status ${res.status}`)
    btnStatus.value = "success"
    setTimeout(() => (showSignup.value = false), 2000)
  } catch (err) {
    console.error("Signup falhou:", err)
    btnStatus.value = "error"
  } finally {
    loading.value = false
    setTimeout(() => (btnStatus.value = "idle"), 4000)
  }
}
</script>

<style scoped>
@keyframes rotate1 {
  0% {
    transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg)
  }

  100% {
    transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg)
  }
}

@keyframes rotate2 {
  0% {
    transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg)
  }

  100% {
    transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg)
  }
}

@keyframes rotate3 {
  0% {
    transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg)
  }

  100% {
    transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg)
  }
}
</style>
