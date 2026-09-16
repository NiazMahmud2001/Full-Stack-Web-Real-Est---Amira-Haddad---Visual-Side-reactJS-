import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Lets you write `@/components/...` from anywhere instead of `../../..`.
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  worker: {
    // MapLibre starts its tile worker as an ES module worker, so production
    // builds must emit workers in that same format (see src/lib/maplibre.js).
    format: 'es',
  },
})
