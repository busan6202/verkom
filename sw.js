const CACHE_NAME = 'siks-fasdik-pwa-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  // WAJIB CACHE SEMUA LIBRARY EXTERNAL AGAR BISA DIBUKA SAAT OFFLINE TOTAL
  'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js',
  'https://cdn.jsdelivr.net/npm/jspdf-autotable@3.5.31/dist/jspdf.plugin.autotable.min.js',
  'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js',
  'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Menyimpan file pendukung untuk mode offline...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', event => {
  // Pengecualian: Jangan pernah cache request ke API Telegram, Jam, atau Hari Libur
  if (event.request.url.includes('api.telegram.org') || 
      event.request.url.includes('worldtimeapi.org') || 
      event.request.url.includes('vercel.app')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // 1. Jika file ada di memori cache (offline), gunakan itu!
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // 2. Jika tidak ada di cache, coba download (jika sedang online)
      return fetch(event.request).then(response => {
        // Jangan simpan response yang error
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        
        // Simpan file baru ke cache untuk penggunaan offline berikutnya
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        
        return response;
      }).catch(err => {
        console.log('Mode Offline Murni: Gagal memuat file dari internet', err);
      });
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => Promise.all(
      cacheNames.map(name => {
        // Hapus cache versi lama jika ada update
        if (name !== CACHE_NAME) {
          console.log('Menghapus cache versi lama:', name);
          return caches.delete(name);
        }
      })
    ))
  );
  self.clients.claim();
});
