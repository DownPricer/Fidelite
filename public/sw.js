const CACHE = "fifelite-v1";
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
 * Une requête de navigation/RSC Next.js (clic sur un <Link>, prefetch, ou chargement de page)
 * n'est jamais interceptée : la mettre en cache par URL exacte renverrait un payload RSC périmé
 * ou propre à une autre route sur une URL différente, et surtout, si le fetch réseau échoue pour
 * N'IMPORTE QUELLE raison (redirection cross-domaine bloquée par CORS, coupure réseau, etc.), le
 * `catch` ci-dessous retombait sur le cache de la page d'accueil ("/") — remplaçant SILENCIEUSEMENT le contenu
 * demandé par la page d'accueil mise en cache, sans la moindre erreur visible. C'est cette
 * substitution qui donnait l'impression qu'un clic "redirigeait vers l'accueil" : en réalité, la
 * requête avait juste échoué et le service worker masquait l'échec. On laisse donc le navigateur
 * gérer nativement toute requête de navigation ou de fetch RSC (en-têtes RSC/Next-Router-Prefetch,
 * paramètre _rsc, ou mode "navigate") — ce service worker ne met en cache que les autres requêtes
 * GET same-origin (assets statiques), et sans jamais masquer un échec derrière la page d'accueil.
 */
function isNextNavigationOrRscRequest(request, url) {
  if (request.mode === "navigate") return true;
  if (request.headers.get("rsc") === "1") return true;
  if (request.headers.get("next-router-prefetch") === "1") return true;
  if (url.searchParams.has("_rsc")) return true;
  return false;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.pathname.startsWith("/api/")) return;
  if (isNextNavigationOrRscRequest(request, url)) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        if (response.ok && url.origin === self.location.origin) {
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request)),
  );
});
