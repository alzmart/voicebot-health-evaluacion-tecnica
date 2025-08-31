<script setup>
import { ref } from 'vue'

// Definición de props combinada
defineProps({
  msg: {
    type: String,
    required: true,
  },
})

// Variable reactiva
const count = ref(0)
</script>

<template>
  <div class="greetings">
    <!-- Mensaje principal -->
    <h1 class="green">{{ msg }}</h1>
    <h3>
      You’ve successfully created a project with
      <a href="https://vite.dev/" target="_blank" rel="noopener">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>.
    </h3>

    <!-- Contador interactivo -->
    <div class="card">
      <button type="button" @click="count++">
        count is {{ count }}
      </button>
      <p>
        Edit <code>components/HelloWorld.vue</code> to test HMR
      </p>
    </div>

    <!-- Enlaces informativos -->
    <p>
      Check out
      <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>,
      the official Vue + Vite starter
    </p>
    <p>
      Learn more about IDE Support for Vue in the
      <a href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support" target="_blank">
        Vue Docs Scaling up Guide
      </a>.
    </p>
    <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
  </div>
</template>

<style scoped>
/* Estilos combinados */
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}

.read-the-docs {
  color: #888;
}

.card {
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
}

button {
  background-color: #42b983;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #369870;
}
</style>

