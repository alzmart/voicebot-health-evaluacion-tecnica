// vite.config.js
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // enable only in development or when env explicitly sets it
  const enableDevTools = mode === 'development' || env.VITE_ENABLE_VUETOOLS === 'true'

  return {
    plugins: [
      vue(),
      enableDevTools ? vueDevTools() : null
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      proxy: {
        '/api': 'http://localhost:3000'  // 👈 Aquí hacemos que /api vaya al backend
      }
    }
  }
})

