import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const sitesWorker = () => ({
  name: 'sites-worker-entry',
  apply: 'build',
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: 'server/index.js',
      source: `export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404 || request.method !== 'GET') return response;

    const url = new URL(request.url);
    url.pathname = '/index.html';
    return env.ASSETS.fetch(new Request(url, request));
  },
};\n`,
    });
  },
});

// base './' keeps every URL relative, so the build works at a domain root or a sub-path (e.g. GitHub Pages).
// host: true exposes the dev/preview server on your Wi-Fi so you can open it on your phone.
export default defineConfig({
  base: './',
  plugins: [react(), sitesWorker()],
  server: { host: true },
  preview: { host: true },
});
