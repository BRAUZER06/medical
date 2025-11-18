import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'fs'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  plugins: [
    react(),
    {
      name: 'copy-sw-and-manifest',
      closeBundle() {
        // Копируем service worker и manifest в build директорию
        copyFileSync(
          resolve(__dirname, 'public/service-worker.js'),
          resolve(__dirname, 'dist/service-worker.js')
        );
        copyFileSync(
          resolve(__dirname, 'public/manifest.json'),
          resolve(__dirname, 'dist/manifest.json')
        );
        copyFileSync(
          resolve(__dirname, 'public/offline.html'),
          resolve(__dirname, 'dist/offline.html')
        );
      }
    }
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    origin: 'https://only-doc.ru',
    hmr: {
      clientPort: 443,
      port: 5173,
      protocol: 'wss'
    },
    fs: {
      allow: ['.']
    }
  },
})

