import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Allow Cloudflare Tunnel and other hosts for client demos
    allowedHosts: [
      '.trycloudflare.com', // Allows all cloudflare tunnels
      'localhost',
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
