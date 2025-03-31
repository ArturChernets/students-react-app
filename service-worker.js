const CACHE_NAME = 'pwa-cache-v1';
const BASE_URL = '/students-react-app/'; // Ваш base URL
const URLS_TO_CACHE = [
    `${BASE_URL}`,
    `${BASE_URL}index.html`,
    `${BASE_URL}service-worker.js`, // Тепер він у корені
    `${BASE_URL}icons/icon-192x192.png`,
    `${BASE_URL}icons/icon-512x512.png`
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