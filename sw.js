const CACHE_NAME = 'siks-fasdik-pwa-v3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js',
  'https://cdn.jsdelivr.net/npm/jspdf-autotable@3.5.31/dist/jspdf.plugin.autotable.min.js',
  'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js',
  'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Fetch menggunakan 'no-cors' agar CDN eksternal mau disimpan ke cache
      return Promise.all(
        ASSETS_TO_CACHE.map(url => {
          return fetch(new Request(url, { mode: 'no-cors' }))
            .then(response => cache.put(url, response))
            .catch(error => console.error('Gagal cache:', url, error));
        })
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', event => {
  // Pengecualian: Jangan cache API dinamis
  if (event.request.url.includes('api.telegram.org') || 
      event.request.url.includes('worldtimeapi.org') || 
      event.request.url.includes('vercel.app')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return response;
      }).catch(() => {
        // Abaikan error saat offline total
      });
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => Promise.all(
      cacheNames.map(name => {
        if (name !== CACHE_NAME) return caches.delete(name);
      })
    ))
  );
  self.clients.claim();
});
