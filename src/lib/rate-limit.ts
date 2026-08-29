type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function cleanup(now: number) {
  if (buckets.size < 2000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
}

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  cleanup(now);
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true as const, remaining: limit - 1 };
  }
  if (current.count >= limit) {
    return {
      ok: false as const,
      retryAfterMs: current.resetAt - now,
    };
  }
  current.count += 1;
  return { ok: true as const, remaining: limit - current.count };
}

export const LIMITS = {
  login: { limit: 8, windowMs: 15 * 60 * 1000 },
  register: { limit: 5, windowMs: 15 * 60 * 1000 },
  scan: { limit: 40, windowMs: 60 * 1000 },
  qr: { limit: 40, windowMs: 60 * 1000 },
};
