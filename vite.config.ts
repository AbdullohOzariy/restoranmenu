import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// PWA plugin is temporarily disabled for debugging build issues.
// import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    outDir: './server/dist',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
