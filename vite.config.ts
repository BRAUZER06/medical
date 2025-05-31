import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: '.',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    origin: 'https://only-doc.ru',
    hmr: {
      clientPort: 443,
      port: 5173
    },
    fs: {
      allow: ['.']
    }
  },
})

