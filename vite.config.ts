import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      pako: path.resolve(__dirname, 'node_modules/pako'),
    },
  },
  optimizeDeps: {
    include: ['@react-pdf/renderer', 'pako'],
  },
});
