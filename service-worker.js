const CACHE_NAME = 'pwa-cache-v1';
const URLS_TO_CACHE = [
    '/',
    '/index.html',
    '/browser-icon.png',
    '/students-react-app/web-app-manifest-192x192.png',
    '/students-react-app/web-app-manifest-512x512.png'
];

// Встановлення Service Worker і кешування ресурсів
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installed');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching resources');
            return cache.addAll(URLS_TO_CACHE);
        })
    );
});

// Активування нового SW та видалення старого кешу
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activated');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
});

// Перехоплення fetch-запитів і використання кешу
self.addEventListener('fetch', (event) => {
    console.log('[Service Worker] Fetching:', event.request.url);
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
