import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
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
    }
  },
})

