// 오프라인 캐시 및 파일별 다운로드 진행률 메시지를 처리하는 Service Worker

const CACHE = 'tama-v1';
const MANIFEST = self.__WB_MANIFEST; // Workbox 빌드 시 precache 목록 배열로 대체됨

self.addEventListener('install', event => {
  const total = MANIFEST.length;
  let done = 0;

  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);

    for (const entry of MANIFEST) {
      const url = typeof entry === 'string' ? entry : entry.url;
      try {
        await cache.add(new Request(url, { cache: 'reload' }));
      } catch {
        console.warn('[SW] 캐시 실패:', url);
      }
      done++;
      // 진행률을 페이지(미제어 클라이언트 포함)에 브로드캐스트
      const clients = await self.clients.matchAll({ includeUncontrolled: true });
      clients.forEach(c => c.postMessage({ type: 'SW_PROGRESS', done, total }));
    }

    self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  // 이전 버전 캐시 정리 후 즉시 페이지 제어 획득
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  // 페이지 HTML(navigate)은 네트워크 우선 → 온라인이면 항상 최신, 오프라인이면 캐시 폴백
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          caches.open(CACHE).then(c => c.put(event.request, res.clone()));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // JS·CSS·이미지 등 해시 포함 자산은 캐시 우선 (오프라인 동작 보장)
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
