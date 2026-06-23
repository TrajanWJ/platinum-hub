import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({ base: '/platinum-hub/', plugins: [react()], server: { host: true } })
