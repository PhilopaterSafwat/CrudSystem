import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://crudsystemapp.eu-4.evennode.com",
        changeOrigin: true
      }
    }
  }
})
