<template>
  <div class="flex items-center justify-center h-full bg-cover bg-center">
    <video autoplay muted loop playsinline class="absolute inset-0 w-full h-full object-cover">
      <source src="/videos/climbeVideo.mp4" type="video/mp4" />
    </video>
    <div class="absolute inset-0 bg-black/50"></div>

    <div
      class="relative z-10 flex w-4/5 h-full max-w-5xl max-h-5xl rounded-2xl bg-neutral-600/50 border-2 border-neutral-700 backdrop-blur-sm shadow-lg overflow-hidden animate-fadeInUp justify-center align-middle">

      <div class=" flex flex-col items-center justify-center space-x-36-5 px-5 overlay-content ">

        <div>
          <img src="/img/climbe-logo.png" alt="climb" class="h-20 mb-6" />
          <h2 class="text-white text-3xl font-medium mb-6 mx-auto text-center">Cadastro.</h2>
        </div>

        <div class="flex items-center w-full">
          <div class="sm:w-1/2 flex flex-col items-center">

            <input type="text" placeholder="Digite seu nome" v-model="form.nomeCompleto"
              class="w-full h-15 px-4 py-3 mb-4 rounded-lg border text-xl border-gray-300 bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" />

            <input type="text" placeholder="Digite seu cpf" v-model="form.cpf"
              class="w-full h-15 px-4 py-3 mb-4 rounded-lg border text-xl border-gray-300 bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" />

            <input type="email" placeholder="Digite seu email" v-model="form.email"
              class="w-full h-15 px-4 py-3 mb-4 rounded-lg border text-xl border-gray-300 bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" />

            <input type="text" placeholder="Digite seu numero" v-model="form.contato"
              class="w-full h-15 px-4 py-3 mb-4 rounded-lg border text-xl border-gray-300 bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" />

            <input type="password" placeholder="Digite sua senha" v-model="form.senha"
              class="w-full h-15 px-4 py-3 mb-4 rounded-lg border text-xl border-gray-300 bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" />

            <select id="cargos" v-model="form.cargoId" :disabled="cargosLoading || cargos.length === 0"
              class="w-full h-15 px-4 py-3 mb-6 rounded-lg border text-xl border-gray-300 bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:text-primary">
              <option value="" disabled>Selecione seu cargo</option>
              <option v-for="c in cargos" :key="c.id" :value="c.id" class="text-black">
                {{ c.nomeCargo }}
              </option>
            </select>

            <p v-if="error" class="text-red-500 mb-2 text-xl font-bold  text-center">{{ error }}</p>

            <div class="flex items-center justify-between w-full mb-4 gap-2">
              <button @click="register" :disabled="loading"
                class="w-full h-15 py-3 rounded-lg border-2 text-xl border-primary font-semibold text-white bg-secondary hover:bg-neutral-500/20 hover:border-neutral-700 transition disabled:opacity-60">
                {{ loading ? 'Cadastrando...' : 'Cadastrar' }}
              </button>
            </div>

            <p class="text-white text-sm mt-4">
              É sócio e já tem acesso?
              <a href="/" class="text-purple-400 hover:underline">Clique aqui</a>
            </p>
          </div>

          <div
            class="w-[4px] h-4/5 bg-gradient-to-br from-primary via-transparent to-transparent mx-5 hidden sm:block ">
          </div>

          <div class="w-1/2 flex items-center justify-center p-10 hidden sm:block">
            <h2 class="text-white text-4xl font-bold w-full h-full text-center font-bold text-6xl">
              {{ typedText }}
              <span class="border-r-4 border-primary animate-blink ml-1"></span>
            </h2>
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


const form = ref({
  nomeCompleto: "",
  cargoId: "" as number | "",
  cpf: "",
  email: "",
  contato: "",
  senha: "",
})

const loading = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)


type Cargo = { id: number; nomeCargo: string }
const cargos = ref<Cargo[]>([])
const cargosLoading = ref(false)

async function loadCargos() {
  try {
    cargosLoading.value = true
    const res = await fetch("/api/cargos")
    if (!res.ok) throw new Error("Falha ao carregar cargos")
    const data = await res.json()
    cargos.value = Array.isArray(data) ? data : []
  } catch (e: any) {
    cargos.value = []
    console.warn("Cargos não carregados:", e?.message || e)
  } finally {
    cargosLoading.value = false
  }
}

async function register() {
  error.value = null
  success.value = null

  if (!form.value.nomeCompleto || !form.value.email || !form.value.senha || !form.value.cpf) {
    error.value = "Preencha nome, CPF, e-mail e senha."
    return
  }
  if (!form.value.cargoId) {
    error.value = "Selecione um cargo."
    return
  }

  loading.value = true
  try {
    const res = await fetch("/api/usuarios/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nomeCompleto: form.value.nomeCompleto,
        cargoId: Number(form.value.cargoId),
        cpf: form.value.cpf,
        email: form.value.email,
        contato: form.value.contato || null,
        senha: form.value.senha,
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data?.error || "Falha ao cadastrar")
    }

    success.value = "Cadastro enviado! Aguarde aprovação do administrador."

    setTimeout(() => router.replace("/"), 1200)
  } catch (e: any) {
    error.value = e?.message || "Erro ao cadastrar"
  } finally {
    loading.value = false
  }
}

const fullText = "A melhor empresa precisa dos melhores orientadores"
const typedText = ref("")
onMounted(() => {
  loadCargos()
  let index = 0
  const typingInterval = setInterval(() => {
    if (index < fullText.length) {
      typedText.value += fullText[index]
      index++
    } else {
      clearInterval(typingInterval)
    }
  }, 50)
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

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.5);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes shimmer {
  0% {
    left: -100%;
  }

  100% {
    left: 100%;
  }
}

.overlay-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: shimmer 3s infinite;
}

.animate-fadeInUp {
  animation: fadeInUp 2s ease-out forwards;
}

.animate-blink {
  animation: blink 1s infinite;
}
</style>
