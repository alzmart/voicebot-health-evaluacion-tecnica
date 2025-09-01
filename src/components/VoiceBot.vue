<template>
  <div class="p-4 border rounded shadow max-w-md mx-auto">
    <h2 class="text-xl font-bold mb-2"> 🧑🏻‍🔬 Dr. Celer </h2>

    <div class="mb-2">
      <button
        @click="startListening"
        :disabled="listening"
        class="bg-blue-600 text-white px-4 py-2 rounded mr-2"
      >
        🎤 {{ listening ? "Escuchando..." : "Hablar" }}
      </button>

      <button
        @click="stopListening"
        :disabled="!listening"
        class="bg-red-600 text-white px-4 py-2 rounded"
      >
        ⏹ Detener
      </button>
    </div>

    <p><b>Usuario:</b> {{ transcript }}</p>
    <p><b>Bot:</b> {{ reply }}</p>
    <p v-if="error" class="text-red-600"><b>Error:</b> {{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const transcript = ref('')
const reply = ref('')
const listening = ref(false)
const error = ref('')

let recognition = null

// ✅ Función para hablar con voz del navegador
function speak(text) {
  if (!('speechSynthesis' in window)) return
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'es-ES'
  speechSynthesis.speak(utterance)
}

// ✅ Función para enviar prompt al backend
async function askBackend(message) {
  try {
    const response = await fetch('/api/llm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: message })
    })

    if (!response.ok) throw new Error('Error al contactar el backend')

    const data = await response.json()
    return data.reply
  } catch (e) {
    console.error('Error comunicándose con backend:', e)
    throw new Error('Error de comunicación')
  }
}

// ✅ Iniciar escucha
function startListening() {
  if (!recognition) return
  transcript.value = ''
  reply.value = ''
  error.value = ''
  listening.value = true
  recognition.start()
}

// ✅ Detener escucha
function stopListening() {
  if (!recognition) return
  recognition.stop()
  listening.value = false
}

// ✅ Configuración del reconocimiento de voz
onMounted(() => {
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    error.value = 'Tu navegador no soporta SpeechRecognition'
    return
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  recognition = new SpeechRecognition()
  recognition.lang = 'es-ES'
  recognition.continuous = false
  recognition.interimResults = false
  recognition.maxAlternatives = 1

  recognition.onresult = async (event) => {
    transcript.value = event.results[0][0].transcript
    try {
      const res = await askBackend(transcript.value)
      reply.value = res
      speak(res)
    } catch (e) {
      error.value = e.message
    }
  }

  recognition.onend = () => {
    listening.value = false
  }

  recognition.onerror = (e) => {
    listening.value = false
    error.value = `Error de reconocimiento: ${e.error}`
    console.error(e)
  }
})
</script>

<style scoped>
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>



