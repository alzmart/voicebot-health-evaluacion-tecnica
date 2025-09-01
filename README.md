# SaludBot - VoiceBot Web  
![Vue](https://img.shields.io/badge/Vue-3.5.18-brightgreen) ![Vite](https://img.shields.io/badge/Vite-7.0.6-blue) ![Node](https://img.shields.io/badge/Node-%3E=20-ff69b4)

---

## Descripción

**Español:**  
SaludBot es un chatbot web funcional habilitado para voz, construido con **Vue 3 + Vite**.  
Permite interactuar con los usuarios mediante reconocimiento de voz, sintetiza respuestas habladas y permite simular consultas y registro de datos de salud.

**English:**  
SaludBot is a functional web-based voice-enabled chatbot built with **Vue 3 + Vite**.  
It interacts with users using voice recognition, synthesizes spoken responses, and allows simulated health queries and data registration.

Este proyecto utiliza **Vue 3 `<script setup>` SFCs**.  
This project uses **Vue 3 `<script setup>` SFCs**.  
Más información: [Vue Docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup)

---

## 🚀 Demo en línea / Live Demo
[👉 SaludBot en Vercel](https://voicebot-health-evaluacion-te-git-97469a-luzs-projects-04de6f26.vercel.app/?_vercel_share=nP67fKOkGj3xNZK7z5xIFGA3FziYogiE)  
✅ **Acceso inmediato sin necesidad de registrarse / Instant access, no signup required**

---

## 🔗 Repositorio / Repository
[GitHub - SaludBot VoiceBot](https://github.com/alzmart/voicebot-health-evaluacion-tecnica)

---

## Requisitos / Requirements

- Node.js >= 20  
- npm >= 9  
- Navegador moderno con soporte para Web Speech API / Modern browser with Web Speech API support  

---

## Configuración recomendada de IDE / Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (deshabilitar Vetur si está instalado / disable Vetur if installed)  
- Soporte IDE: [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support)

---

##  Funcionalidades principales / Main Features

- 🎙 Reconocimiento de voz con Web Speech API / Voice recognition with Web Speech API  
- 🔊 Síntesis de voz para respuestas del bot / Speech synthesis for bot responses  
- 🤖 Interacción con LLM simulado (puede integrarse con Gemini u otro LLM real) / Interaction with simulated LLM (can integrate with Gemini or other real LLM)  
- 📝 Registro simulado de datos de salud y bienestar / Simulated health and wellness data registration  
- 📱 UI responsive y recarga en caliente durante desarrollo / Responsive UI and hot-reload during development  

---

##  Cómo correr el proyecto localmente / Run locally

1. **Clonar el repositorio / Clone the repository**
   ```sh
   git clone https://github.com/alzmart/voicebot-health-evaluacion-tecnica.git
   cd voicebot-health-evaluacion-tecnica


### Instalar dependencias / Install dependencies | Ejecutar en modo desarrollo / Run in development | ### Compilar para producción / Build for production | Vista previa del build de producción / Preview production build
```sh
npm install
npm run dev
#Luego abre en tu navegador: http://localhost:5173
npm run build
npm run preview