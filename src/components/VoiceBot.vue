<template>
  <div class="p-4 border rounded shadow max-w-md mx-auto">
    <h2 class="text-xl font-bold mb-2"> 🧑🏻‍🔬 Dr. Celer </h2>

    <!-- Conversación completa con animación -->
    <div ref="chatBox" class="chat-container mb-3">
      <transition-group name="msg" tag="div">
        <div
          v-for="(msg, index) in historial"
          :key="index + '-' + msg.contenido"
          :class="msg.rol === 'usuario' ? 'bubble-user' : 'bubble-bot'"
        >
          <span class="bubble-icon">{{ msg.rol === 'usuario' ? '🗣️' : '🧑🏻‍🔬' }}</span>
          <span class="bubble-text">{{ msg.contenido }}</span>
        </div>
      </transition-group>

      <!-- Indicador de bot escribiendo con puntitos animados y parpadeo -->
      <div v-if="botGenerating" class="bubble-bot typing active">
        <span class="bubble-icon">🧑🏻‍🔬</span>
        <span class="bubble-text">Escribiendo<span class="dots"></span></span>
      </div>
    </div>

    <!-- Botones de control -->
    <div class="mb-2 flex gap-2">
      <button
        @click="startListening"
        :disabled="listening"
        class="bg-blue-600 text-white px-4 py-2 rounded flex-1"
      >
        🎤 {{ listening ? "Escuchando..." : "Hablar" }}
      </button>

      <button
        @click="stopListening"
        :disabled="!listening"
        class="bg-red-600 text-white px-4 py-2 rounded flex-1"
      >
        ⏹ Detener
      </button>
    </div>

    <!-- Botones rápidos -->
    <div class="mt-2 flex gap-2">
      <button @click="sendQuickMessage('Centros de salud', '/api/centros')" class="bg-green-600 text-white px-2 py-1 rounded flex-1">
        Centros de Salud
      </button>
      <button @click="sendQuickMessage('Agendar cita', '/api/citas')" class="bg-yellow-600 text-white px-2 py-1 rounded flex-1">
        Agendar Cita
      </button>
    </div>

    <!-- Error -->
    <p v-if="error" class="text-red-600 mt-2"><b>Error:</b> {{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'

const listening = ref(false)
const error = ref('')
const historial = ref([]) 
const chatBox = ref(null)  
const botGenerating = ref(false)
const botSpeaking = ref(false)

let recognition = null
let voces = []

// 🗣 Hablar con voz y devolver promesa
function speakAsync(text) {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) return resolve()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'es-ES'
    if (voces.length > 0) utterance.voice = voces[0]
    utterance.onend = resolve
    speechSynthesis.speak(utterance)
  })
}

// ✨ Animación de tipeo para el bot
function typeBotMessage(text) {
  return new Promise((resolve) => {
    let i = 0
    const tempMsg = { rol: 'asistente', contenido: '' }
    historial.value.push(tempMsg)

    const interval = setInterval(() => {
      tempMsg.contenido += text[i]
      i++
      if (i >= text.length) {
        clearInterval(interval)
        resolve()
      }
    }, 20)
  })
}

// 📡 Enviar prompt al backend con historial
async function askBackend(message, endpoint = '/api/llm') {
  try {
    historial.value.push({ rol: 'usuario', contenido: message })
    botGenerating.value = true

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ historial: historial.value })
    })

    if (!response.ok) throw new Error('Error al contactar el backend')

    const data = await response.json()
    await typeBotMessage(data.reply)
    botGenerating.value = false

    botSpeaking.value = true
    await speakAsync(data.reply)
    botSpeaking.value = false

    return data.reply
  } catch (e) {
    botGenerating.value = false
    botSpeaking.value = false
    console.error(e)
    throw new Error('Error de comunicación')
  }
}

// ⚡ Mensaje rápido desde botón
async function sendQuickMessage(message, endpoint) {
  try {
    await askBackend(message, endpoint)
  } catch (e) {
    error.value = e.message
  }
}

// 🎙 Iniciar escucha
function startListening() {
  if (!recognition) return
  error.value = ''
  listening.value = true
  recognition.start()
}

// ⏹ Detener escucha
function stopListening() {
  if (!recognition) return
  recognition.stop()
  listening.value = false
}

// 🛠 Configuración de reconocimiento de voz
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
    const transcript = event.results[0][0].transcript
    try {
      await askBackend(transcript)
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

// 🔄 Scroll automático al último mensaje
watch(historial, async () => {
  await nextTick()
  if (chatBox.value) {
    chatBox.value.scrollTo({
      top: chatBox.value.scrollHeight,
      behavior: 'smooth'
    })
  }
})
</script>

<style scoped>
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.chat-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 400px;
  overflow-y: auto;
  padding: 8px;
  background-color: #f8f8f8;
  border-radius: 12px;
}

.msg-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.msg-enter-active {
  transition: all 0.3s ease;
}
.msg-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.bubble-user {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  align-self: flex-end;
  background-color: #0b93f6;
  color: white;
  padding: 8px 12px;
  border-radius: 18px 18px 0 18px;
  max-width: 75%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  word-wrap: break-word;
}

.bubble-bot {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  align-self: flex-start;
  background-color: #e5e5ea;
  color: black;
  padding: 8px 12px;
  border-radius: 18px 18px 18px 0;
  max-width: 75%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
  word-wrap: break-word;
}

.bubble-icon {
  flex-shrink: 0;
}

.bubble-text {
  word-break: break-word;
}

.typing {
  font-style: italic;
  opacity: 0.7;
}

.active {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

.dots::after {
  content: '';
  display: inline-block;
  width: 1em;
  text-align: left;
  animation: ellipsis steps(3,end) 1s infinite;
}

@keyframes ellipsis {
  0% { content: ''; }
  33% { content: '.'; }
  66% { content: '..'; }
  100% { content: '...'; }
}
</style>

