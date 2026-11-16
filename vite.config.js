import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { lookupLeetCode } from './server/leetcode-proxy.js';

const sitesWorker = () => ({
  name: 'sites-worker-entry',
  apply: 'build',
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: 'server/index.js',
      source: readFileSync(new URL('./server/leetcode-proxy.js', import.meta.url), 'utf8') + `
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/leetcode') return lookupLeetCode(url.searchParams.get('u'));
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404 || request.method !== 'GET') return response;

    url.pathname = '/index.html';
    return env.ASSETS.fetch(new Request(url, request));
  },
};\n`,
    });
  },
});

// Dev: answer /api/leetcode from the Vite server so the lookup works locally too.
const leetcodeDev = () => ({
  name: 'leetcode-dev-proxy',
  configureServer(server) {
    server.middlewares.use('/api/leetcode', async (req, res) => {
      const u = new URL(req.url, 'http://x').searchParams.get('u');
      const r = await lookupLeetCode(u);
      res.statusCode = r.status;
      res.setHeader('Content-Type', 'application/json');
      res.end(await r.text());
    });
  },
});

// base './' keeps every URL relative, so the build works at a domain root or a sub-path (e.g. GitHub Pages).
// host: true exposes the dev/preview server on your Wi-Fi so you can open it on your phone.
export default defineConfig({
  base: './',
  plugins: [react(), sitesWorker(), leetcodeDev()],
  server: { host: true },
  preview: { host: true },
});
