// PrepHub service worker: makes the installed app open (and the diagrams work) offline.
// Pages: network-first, so a new deploy shows up on the next launch. Assets + fonts: stale-while-revalidate.
// Everything else (YouTube, LeetCode, articles) goes straight to the network.
const CACHE = 'prephub-v1';
const CORE = ['./', './manifest.webmanifest', './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png'];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(CORE);
    // Precache the hashed JS/CSS bundles that index.html points at, so offline works from the very first launch.
    try {
      const html = await (await fetch('./', { cache: 'no-cache' })).text();
      const assets = [...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g)].map((m) => m[1]).filter((u) => !u.startsWith('http'));
      await cache.addAll(assets);
    } catch { /* first online visit will fill the cache instead */ }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const res = await fetch(req);
        if (res.ok) cache.put('./', res.clone());
        return res;
      } catch {
        return (await cache.match('./')) || Response.error();
      }
    })());
    return;
  }

  if (url.origin !== self.location.origin && !FONT_HOSTS.includes(url.hostname)) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req);
    const net = fetch(req)
      .then((res) => { if (res.ok) cache.put(req, res.clone()); return res; })
      .catch(() => hit || Response.error());
    return hit || net;
  })());
});
