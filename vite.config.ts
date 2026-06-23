import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Pages serves under /platinum-hub/; Vercel (and default) serve at root.
const base = process.env.DEPLOY_TARGET === 'pages' ? '/platinum-hub/' : '/'
export default defineConfig({ base, plugins: [react()], server: { host: true } })
