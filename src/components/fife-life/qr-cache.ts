const cache = new Map<string, string>();
const inflight = new Map<string, Promise<string | null>>();

/** Clé de cache par slug de requête (QR universel par session utilisateur). */
function cacheKey(slug: string) {
  return slug || "fife-life";
}

export function getCachedQr(slug = "fife-life") {
  return cache.get(cacheKey(slug)) ?? null;
}

export function resetQrCache() {
  cache.clear();
  inflight.clear();
}

export async function loadUniversalQr(
  slug: string,
  options?: { force?: boolean },
): Promise<string | null> {
  const key = cacheKey(slug);
  if (!options?.force && cache.has(key)) {
    return cache.get(key) ?? null;
  }

  const existing = inflight.get(key);
  if (existing) return existing;

  const request = (async () => {
    try {
      const response = await fetch("/api/customer/qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      if (!response.ok) {
        return null;
      }
      const data = (await response.json()) as { image?: string };
      if (data.image) {
        cache.set(key, data.image);
        return data.image;
      }
      return null;
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, request);
  return request;
}

/** Précharge le QR universel dès l’ouverture du wallet. */
export function preloadWalletQr(slug = "fife-life") {
  if (typeof window === "undefined") return;
  if (getCachedQr(slug)) return;
  void loadUniversalQr(slug);
}
