const CACHE_PREFIX = 'nexus-academy';
const BUILD_ID = new URL(self.location.href).searchParams.get('v') || 'unversioned';
const CACHE_NAME = `${CACHE_PREFIX}-${BUILD_ID}`;
const APP_SCOPE = new URL(self.registration.scope);
const APP_SHELL = [
  new URL('manifest.webmanifest', APP_SCOPE).href,
  new URL('icons/nexus-192.png', APP_SCOPE).href,
  new URL('icons/nexus-512.png', APP_SCOPE).href,
  new URL('icons/nexus-maskable-512.png', APP_SCOPE).href,
  new URL('icons/nexus-180.png', APP_SCOPE).href,
];

async function precacheCurrentBuild(cache) {
  const pageResponse = await fetch(APP_SCOPE.href, { cache: 'no-store' });
  if (!pageResponse.ok) throw new Error('Não foi possível obter o shell da aplicação.');

  const pageHtml = await pageResponse.clone().text();
  await cache.put(APP_SCOPE.href, pageResponse);

  const assetPattern = /(?:src|href)=["']([^"'#]+\.(?:js|css)(?:\?[^"']*)?)["']/gi;
  const assets = [...pageHtml.matchAll(assetPattern)]
    .map((match) => new URL(match[1], APP_SCOPE).href)
    .filter((url) => {
      const parsed = new URL(url);
      return parsed.origin === APP_SCOPE.origin && parsed.pathname.startsWith(APP_SCOPE.pathname);
    });

  await cache.addAll([...new Set([...APP_SHELL, ...assets])]);
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await precacheCurrentBuild(cache);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames
        .filter((name) => name.startsWith(`${CACHE_PREFIX}-`) && name !== CACHE_NAME)
        .map((name) => caches.delete(name)),
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const requestUrl = new URL(request.url);
  if (requestUrl.origin !== self.location.origin || !requestUrl.pathname.startsWith(APP_SCOPE.pathname)) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    if (request.mode === 'navigate') {
      try {
        const response = await fetch(request);
        if (response.ok) await cache.put(request, response.clone());
        return response;
      } catch {
        return (await cache.match(requestUrl.href, { ignoreVary: true }))
          || (await cache.match(APP_SCOPE.href, { ignoreVary: true }))
          || Response.error();
      }
    }

    const cached = await cache.match(requestUrl.href, { ignoreVary: true });
    if (cached) return cached;

    try {
      const response = await fetch(request);
      if (response.ok && response.type === 'basic') await cache.put(request, response.clone());
      return response;
    } catch {
      return Response.error();
    }
  })());
});
