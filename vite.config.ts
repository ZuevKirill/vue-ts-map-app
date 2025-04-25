
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/vue-ts-map-app/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
