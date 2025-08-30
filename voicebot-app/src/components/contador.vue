<!-- src/components/Contador.vue -->
<script setup>
import { ref, watch } from 'vue'

// 1) Definir props
const props = defineProps({
  inicial: { type: Number, default: 0 },
})

// 2) Definir eventos emitidos
const emit = defineEmits(['update'])

// 3) Estado y lógica
const count = ref(props.inicial)
function incrementar() {
  count.value++
  emit('update', count.value) // avisa al padre
}

// (opcional) observar cambios
watch(() => props.inicial, (nuevo) => { count.value = nuevo })
</script>

<template>
  <div class="card">
    <h2>Contador</h2>
    <p>Valor actual: {{ count }}</p>
    <button @click="incrementar">Sumar +1</button>
  </div>
</template>

<style scoped>
.card { border: 1px solid #ddd; padding: 1rem; border-radius: .75rem; max-width: 280px; }
button { padding: .5rem .75rem; border: none; border-radius: .5rem; cursor: pointer; }
</style>