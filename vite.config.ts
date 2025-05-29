import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

export default defineConfig({
  server: {
    allowedHosts: ['only-doc.ru'],
    proxy: {
      '/api': {
        target: 'https://only-doc.ru/',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
