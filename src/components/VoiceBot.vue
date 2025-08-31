<template>
  <div class="p-4 border rounded shadow max-w-md mx-auto">
    <h2 class="text-xl font-bold mb-2"> 🧑🏻‍🔬Dr. Celer </h2>

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
    <p><b>Bot:</b> {{ respuesta }}</p>
    <p v-if="error" class="text-red-600"><b>Error:</b> {{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Recibir la API Key desde App.vue
const props = defineProps({
  apiKey: {
    type: String,
    required: true
  }
})

// Variables reactivas
const transcript = ref('')
const respuesta = ref('')
const listening = ref(false)
const error = ref('')

// Referencia a SpeechRecognition
let recognition = null

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
      const reply = await askGemini(transcript.value)
      respuesta.value = reply
      speak(reply)
    } catch (e) {
      error.value = 'Error al comunicarse con Gemini'
      console.error(e)
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

// Función para iniciar la escucha
function startListening() {
  if (!recognition) return
  transcript.value = ''
  respuesta.value = ''
  error.value = ''
  listening.value = true
  recognition.start()
}

// Función para detener la escucha
function stopListening() {
  if (!recognition) return
  recognition.stop()
  listening.value = false
}

// Función para sintetizar voz
function speak(text) {
  if (!('speechSynthesis' in window)) return
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'es-ES'
  speechSynthesis.speak(utterance)
}

// Función para llamar al LLM Gemini usando la API Key
async function askGemini(prompt) {
  const res = await fetch('https://api.gemini.com/llm', { // Cambia a tu endpoint real
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${props.apiKey}`
    },
    body: JSON.stringify({ prompt })
  })
  const data = await res.json()
  return data.reply
}
</script>

<style scoped>
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

