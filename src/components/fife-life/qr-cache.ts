const cache = new Map<string, string>();
const inflight = new Map<string, Promise<string | null>>();

/** Source unique du QR client personnalisé (même token pour tout le wallet). */
export const PERSONALIZED_QR_KEY = "@customer";

function cacheKey(slug: string) {
  return slug || PERSONALIZED_QR_KEY;
}

export function getCachedQr(slug = PERSONALIZED_QR_KEY) {
  return cache.get(cacheKey(slug)) ?? cache.get(PERSONALIZED_QR_KEY) ?? null;
}

export function getPersonalizedQr() {
  return getCachedQr(PERSONALIZED_QR_KEY);
}

export function resetQrCache() {
  cache.clear();
  inflight.clear();
}

export async function loadUniversalQr(
  slug: string,
  options?: { force?: boolean },
): Promise<string | null> {
  return loadPersonalizedQr(slug, options);
}

export async function loadPersonalizedQr(
  slugForMembership = PERSONALIZED_QR_KEY,
  options?: { force?: boolean },
): Promise<string | null> {
  const requestSlug =
    slugForMembership === PERSONALIZED_QR_KEY ? "fife-life" : slugForMembership;

  if (!options?.force && cache.has(PERSONALIZED_QR_KEY)) {
    return cache.get(PERSONALIZED_QR_KEY) ?? null;
  }

  const inflightKey = PERSONALIZED_QR_KEY;
  const existing = inflight.get(inflightKey);
  if (existing) return existing;

  const request = (async () => {
    try {
      const response = await fetch("/api/customer/qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        credentials: "same-origin",
        body: JSON.stringify({ slug: requestSlug }),
      });
      if (!response.ok) {
        return null;
      }
      const data = (await response.json()) as { image?: string };
      if (data.image) {
        cache.set(PERSONALIZED_QR_KEY, data.image);
        cache.set(cacheKey(requestSlug), data.image);
        return data.image;
      }
      return null;
    } finally {
      inflight.delete(inflightKey);
    }
  })();

  inflight.set(inflightKey, request);
  return request;
}

/** Précharge le QR universel dès l’ouverture du wallet. */
export function preloadWalletQr(slug = "fife-life") {
  if (typeof window === "undefined") return;
  if (getPersonalizedQr()) return;
  void loadPersonalizedQr(slug);
}
