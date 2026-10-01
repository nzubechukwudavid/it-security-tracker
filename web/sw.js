/**
 * Study Cockpit Service Worker - Offline Caching Engine (Stale-While-Revalidate)
 * <!-- DOE-VERSION: 2026.10.01 -->
 */

const CACHE_NAME = 'study-cockpit-cache-v1';

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/cockpit.css',
  './js/app.js',
  './js/state.js',
  './js/matrix.js',
  './js/player.js',
  './js/pip.js',
  './js/subnetting.js',
  './js/flashcards.js',
  './js/cheatsheet.js',
  './js/velocity.js',
  './js/roadmapData.js',
  './js/roadmapView.js',
  './js/jobsView.js',
  './js/drawer.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Bypass caching for media streaming or localhost media server
  if (url.port === '8080' || url.pathname.includes('/media/')) {
    return;
  }

  // Stale-While-Revalidate strategy for app shell
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
