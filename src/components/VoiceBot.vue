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

    <div class="mt-2 flex gap-2">
      <button @click="sendToEndpoint('/api/centros')" class="bg-green-600 text-white px-2 py-1 rounded">Centros de Salud</button>
      <button @click="sendToEndpoint('/api/citas')" class="bg-yellow-600 text-white px-2 py-1 rounded">Agendar Cita</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const transcript = ref('')
const reply = ref('')
const listening = ref(false)
const error = ref('')
const historial = ref([]) // historial de conversación global

let recognition = null
let voces = []

// Función para hablar con voz masculina
function speak(text) {
  if (!('speechSynthesis' in window)) return
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'es-ES'
  if (voces.length > 0) utterance.voice = voces[0] // primera voz masculina disponible
  speechSynthesis.speak(utterance)
}

// Función para enviar prompt al backend con historial
async function askBackend(message, endpoint = '/api/llm') {
  try {
    historial.value.push({ role: 'user', content: message })

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ historial: historial.value })
    })

    if (!response.ok) throw new Error('Error al contactar el backend')

    const data = await response.json()
    historial.value.push({ role: 'assistant', content: data.reply })
    return data.reply
  } catch (e) {
    console.error('Error comunicándose con backend:', e)
    throw new Error('Error de comunicación')
  }
}

// Enviar mensaje a endpoint específico (Centros o Citas)
async function sendToEndpoint(endpoint) {
  if (!transcript.value) return
  try {
    const res = await askBackend(transcript.value, endpoint)
    reply.value = res
    speak(res)
  } catch (e) {
    error.value = e.message
  }
}

// Iniciar escucha
function startListening() {
  if (!recognition) return
  transcript.value = ''
  reply.value = ''
  error.value = ''
  listening.value = true
  recognition.start()
}

// Detener escucha
function stopListening() {
  if (!recognition) return
  recognition.stop()
  listening.value = false
}

// Configuración del reconocimiento de voz
onMounted(() => {
  voces = speechSynthesis.getVoices().filter(v => /male|hombre/i.test(v.name) || /es-/i.test(v.lang))

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
