import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/places': {
        target: 'https://places.googleapis.com',  // Base URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/places/, ''),
        secure: false, // No need for HTTPS
      }
    }
  }
});