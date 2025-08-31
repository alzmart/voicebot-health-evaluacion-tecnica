<template>
  <div id="app">
    <header class="header">
      <h1>SaludBot</h1>
    </header>

    <main class="main">
      <VoiceBot />
    </main>
  </div>
</template>

<script setup>
import VoiceBot from './components/VoiceBot.vue'
</script>

<style>
/* Estilos globales para App.vue */
#app {
  font-family: Arial, sans-serif;
  background-color: #f3f4f6;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #42b983;
  color: white;
  padding: 1.5rem;
  text-align: center;
}

.header h1 {
  margin: 0;
  font-size: 2rem;
}

.main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
}
</style>
