// Nome della cache
const CACHE_NAME = 'polis-counter-v3.1';
// File da mettere in cache
const urlsToCache = [
  './index.html',
  './manifest.json',
  './dist/tailwind.css',
  'logo-stakick.png',
  './favicon-48x48.png',
  './gol.png',
  './fischio.mp3',
  'https://html2canvas.hertzen.com/dist/html2canvas.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap'
];

// Evento di installazione: mette in cache i file statici
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aperta');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Errore nella cache:', error);
      })
  );
});

// Evento di fetch: serve i file dalla cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Ritorna la risposta dalla cache se esiste
        if (response) {
          return response;
        }
        // Altrimenti, fa una richiesta di rete
        return fetch(event.request);
      })
  );
});

// Evento di attivazione: pulisce le vecchie cache
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

