import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/piano-notes-trainer/',
  plugins: [react()],
})
