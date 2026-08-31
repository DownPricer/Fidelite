let cachedImage: string | null = null;
let inflight: Promise<string | null> | null = null;

export function getCachedQr() {
  return cachedImage;
}

export async function loadUniversalQr(slug: string): Promise<string | null> {
  if (cachedImage) return cachedImage;
  if (inflight) return inflight;

  inflight = (async () => {
    const response = await fetch("/api/customer/qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    if (!response.ok) {
      inflight = null;
      return null;
    }
    const data = (await response.json()) as { image?: string };
    if (data.image) cachedImage = data.image;
    inflight = null;
    return cachedImage;
  })();

  return inflight;
}
