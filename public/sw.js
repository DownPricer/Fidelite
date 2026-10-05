const CACHE = "fifelite-v2";
const PRECACHE = ["/", "/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

// Web Push (Partie 11) — n'est enregistré que si l'utilisateur a cliqué sur
// "Activer les notifications" (voir src/lib/push-client.ts) ; jamais demandé au chargement.
self.addEventListener("push", (event) => {
  if (!event.data) return;
  let payload = {};
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "Fideto", body: event.data.text() };
  }
  const title = payload.title || "Fideto";
  const options = {
    body: payload.body || "",
    icon: "/icon.svg",
    badge: "/icon.svg",
    image: payload.imageUrl || undefined,
    data: { url: payload.url || "/carte", campaignId: payload.campaignId || null },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/carte";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(url) && "focus" in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    }),
  );
});

/**
 * Navigation, formulaires bêta et payloads RSC Next.js ne sont jamais interceptés.
 * Les autres GET same-origin (assets) utilisent le réseau avec repli cache ; respondWith
 * renvoie toujours une Response (jamais undefined).
 */
function isNextNavigationOrRscRequest(request, url) {
  if (request.mode === "navigate") return true;
  if (request.headers.get("rsc") === "1") return true;
  if (request.headers.get("next-router-prefetch") === "1") return true;
  if (url.searchParams.has("_rsc")) return true;
  if (url.pathname === "/demarrer" || url.pathname.startsWith("/demarrer/")) return true;
  return false;
}

function networkFirstWithCacheFallback(request) {
  return fetch(request)
    .then((response) => {
      const copy = response.clone();
      const url = new URL(request.url);
      if (response.ok && url.origin === self.location.origin) {
        caches.open(CACHE).then((cache) => cache.put(request, copy));
      }
      return response;
    })
    .catch(async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      return Response.error();
    });
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.pathname.startsWith("/api/")) return;
  if (isNextNavigationOrRscRequest(request, url)) return;

  event.respondWith(networkFirstWithCacheFallback(request));
});
