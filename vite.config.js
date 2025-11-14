import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: false,
    host: 'localhost',
    open: false,
    cors: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 3000,
      overlay: true
    },
    watch: {
      usePolling: true,
      interval: 100
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion']
  }
})
