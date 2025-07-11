import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ No tailwindcss import needed
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
  },
})
