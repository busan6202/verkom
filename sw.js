const CACHE_NAME = 'siks-fasdik-pwa-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  // Pengecualian: Jangan cache request ke API Telegram, Jam Dunia, atau Hari Libur
  if (event.request.url.includes('api.telegram.org') || 
      event.request.url.includes('worldtimeapi.org') || 
      event.request.url.includes('vercel.app')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // 1. Jika sudah ada di cache (offline), gunakan cache
      if (cachedResponse) return cachedResponse;
      
      // 2. Jika belum ada (online), download lalu simpan ke cache
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return response;
      }).catch(err => console.log('Mode Offline Aktif:', err));
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => Promise.all(
      cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
    ))
  );
  self.clients.claim();
});
