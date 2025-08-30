<template>
  <div id="app" class="p-4">
    <h1 class="text-2xl font-bold mb-4">Aplicación VoiceBot Salud</h1>
    <VoiceBot />
  </div>
</template>

<script setup>
import VoiceBot from './components/VoiceBot.vue'
</script>

<style>
/* Puedes agregar estilos globales si quieres */
body {
  font-family: Arial, sans-serif;
  background-color: #f3f4f6;
}
</style>