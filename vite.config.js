import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import devApi from './server/devApi.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '') // '' = also load non-VITE_ vars (server-only secrets)
  return {
    plugins: [react(), devApi(env)],
  }
})