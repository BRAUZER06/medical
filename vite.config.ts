import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  root: '.',
  plugins: [react()],
  server: {
    host: 'only-doc.ru',
    port: 5173,
    strictPort: true,
    origin: 'http://only-doc.ru:5173',
  },
})

