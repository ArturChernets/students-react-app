const CACHE_NAME = 'pwa-cache-v1';
const URLS_TO_CACHE = [
    self.location.href, // Кешуємо поточну сторінку
    `${self.location.origin}${import.meta.env.BASE_URL}index.html`,
    `${self.location.origin}${import.meta.env.BASE_URL}assets/*`,
    `${self.location.origin}${import.meta.env.BASE_URL}icons/icon-192x192.png`,
    `${self.location.origin}${import.meta.env.BASE_URL}icons/icon-512x512.png`
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))
        )
    );
});

self.addEventListener('message', (event) => {
    if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => response || fetch(event.request))
    );
});

// Додайте для коректної роботи з VitePWA
self.addEventListener('message', (event) => {
    if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});