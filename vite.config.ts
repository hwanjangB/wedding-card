import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { generateIcsPlugin } from './vite-plugin-ics'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), generateIcsPlugin()],
  base: '/wedding/baeleem/',
})
