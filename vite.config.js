import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    cors: true
  },
  root: './', // Specify root directory
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
