import { logWalletQrClient } from "@/lib/wallet-qr-client-log";

const cache = new Map<string, string>();
const inflight = new Map<string, Promise<string | null>>();
const failedOnce = new Set<string>();

/** Source unique du QR client personnalisé (même token pour tout le wallet). */
export const PERSONALIZED_QR_KEY = "@customer";
const QR_API_PATH = "/api/customer/qr";

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
  failedOnce.clear();
}

export async function loadUniversalQr(
  slug: string,
  options?: { force?: boolean },
): Promise<string | null> {
  return loadPersonalizedQr(slug, options);
}

async function fetchCustomerQr(requestSlug: string): Promise<string | null> {
  logWalletQrClient("chargement commencé", { slug: requestSlug, path: QR_API_PATH });

  const response = await fetch(QR_API_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    credentials: "same-origin",
    body: JSON.stringify({ slug: requestSlug }),
  });

  if (!response.ok) {
    let errorMessage: string | undefined;
    const errorContentType = response.headers.get("content-type") ?? "";
    if (errorContentType.includes("application/json")) {
      try {
        const body = (await response.json()) as { error?: string };
        if (typeof body.error === "string") errorMessage = body.error;
      } catch {
        /* corps illisible */
      }
    }
    logWalletQrClient("échec HTTP", {
      slug: requestSlug,
      status: response.status,
      path: QR_API_PATH,
      contentType: errorContentType || undefined,
      ...(errorMessage ? { errorMessage } : {}),
    });
    return null;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    logWalletQrClient("réponse non JSON", {
      slug: requestSlug,
      status: response.status,
      path: QR_API_PATH,
      contentType,
    });
    return null;
  }

  const data = (await response.json()) as { image?: string };
  if (!data.image) {
    logWalletQrClient("échec HTTP", {
      slug: requestSlug,
      status: response.status,
      path: QR_API_PATH,
    });
    return null;
  }

  logWalletQrClient("QR chargé", { slug: requestSlug, path: QR_API_PATH });
  return data.image;
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
      let image = await fetchCustomerQr(requestSlug);

      if (!image && !options?.force && !failedOnce.has(inflightKey)) {
        failedOnce.add(inflightKey);
        image = await fetchCustomerQr(requestSlug);
      }

      if (image) {
        cache.set(PERSONALIZED_QR_KEY, image);
        cache.set(cacheKey(requestSlug), image);
        return image;
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
