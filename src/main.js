import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

// Obtener la API Key desde .env
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
console.log("API Key:", apiKey); // Esto solo en desarrollo

const app = createApp(App)
app.config.devtools = true
app.mount('#app')
