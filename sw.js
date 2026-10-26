const CACHE_NAME = 'dlf-player-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Installation & Pre-Caching
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Alten/Fremden Cache aufräumen
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Netzanfragen abfangen (Audio & API nicht cachen)
self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  
  if (url.includes('sslstream.dlf.de') || url.includes('api/nightingale')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
