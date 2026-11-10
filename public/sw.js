const CACHE_PREFIX = 'nexus-academy';
const CACHE_NAME = `${CACHE_PREFIX}-v1`;
const APP_SCOPE = new URL(self.registration.scope);
const APP_SHELL = [
  APP_SCOPE.href,
  new URL('manifest.webmanifest', APP_SCOPE).href,
  new URL('icons/nexus-192.png', APP_SCOPE).href,
  new URL('icons/nexus-512.png', APP_SCOPE).href,
  new URL('icons/nexus-maskable-512.png', APP_SCOPE).href,
  new URL('icons/nexus-180.png', APP_SCOPE).href,
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_SHELL);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames
        .filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
        .map((name) => caches.delete(name)),
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  const requestUrl = new URL(request.url);
  if (!requestUrl.pathname.startsWith(APP_SCOPE.pathname)) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    if (request.mode === 'navigate') {
      try {
        const response = await fetch(request);
        if (response.ok) await cache.put(request, response.clone());
        return response;
      } catch {
        return (await cache.match(request)) || (await cache.match(APP_SCOPE.href));
      }
    }

    const cached = await cache.match(request);
    if (cached) return cached;

    try {
      const response = await fetch(request);
      if (response.ok && response.type === 'basic') {
        await cache.put(request, response.clone());
      }
      return response;
    } catch {
      return cached || Response.error();
    }
  })());
});
