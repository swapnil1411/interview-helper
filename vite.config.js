import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' keeps every URL relative, so the build works at a domain root or a sub-path (e.g. GitHub Pages).
// host: true exposes the dev/preview server on your Wi-Fi so you can open it on your phone.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { host: true },
  preview: { host: true },
});
