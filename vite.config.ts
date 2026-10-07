import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base './': la misma build anda en matitrova.github.io/autoshine/ y en autoshine.com.ar
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
