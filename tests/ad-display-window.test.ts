import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const adRequestFindUnique = vi.fn();
const adEventCreate = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    adRequest: { findUnique: (...args: unknown[]) => adRequestFindUnique(...args) },
    adEvent: { create: (...args: unknown[]) => adEventCreate(...args) },
  },
}));
vi.mock("@/lib/rate-limit", () => ({
  LIMITS: { qr: { limit: 100, windowMs: 60000 } },
  rateLimit: () => ({ ok: true }),
}));
vi.mock("@/lib/env", () => ({ env: { appUrl: "http://localhost:3000" } }));

function ad(overrides: Record<string, unknown> = {}) {
  return {
    id: "ad_1",
    status: "SCHEDULED",
    fundingMode: null,
    startDate: new Date("2026-10-01T00:00:00.000Z"),
    endDate: new Date("2026-10-02T00:00:00.000Z"),
    hourlyIntervals: [{ start: "2026-10-01T09:00:00.000Z", end: "2026-10-01T10:00:00.000Z" }],
    ctaUrl: "https://example.com/offre",
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("POST /api/public/ads/[id]/impression", () => {
  it("compte une impression pendant le créneau réellement acheté", async () => {
    vi.setSystemTime(new Date("2026-10-01T09:30:00.000Z"));
    adRequestFindUnique.mockResolvedValueOnce(ad());
    const { POST } = await import("../src/app/api/public/ads/[id]/impression/route");
    const response = await POST(new Request("http://x"), { params: Promise.resolve({ id: "ad_1" }) });
    expect(response.status).toBe(200);
    expect(adEventCreate).toHaveBeenCalledWith({ data: { adRequestId: "ad_1", type: "IMPRESSION" } });
  });

  it("refuse hors créneau même si la date du jour (startDate/endDate) est encore valide", async () => {
    // 14h : toujours dans startDate/endDate (le jour entier) mais hors du créneau horaire acheté (9h-10h).
    vi.setSystemTime(new Date("2026-10-01T14:00:00.000Z"));
    adRequestFindUnique.mockResolvedValueOnce(ad());
    const { POST } = await import("../src/app/api/public/ads/[id]/impression/route");
    const response = await POST(new Request("http://x"), { params: Promise.resolve({ id: "ad_1" }) });
    expect(response.status).toBe(404);
    expect(adEventCreate).not.toHaveBeenCalled();
  });
});

describe("GET /api/public/ads/[id]/click", () => {
  it("redirige vers ctaUrl et compte le clic pendant le créneau", async () => {
    vi.setSystemTime(new Date("2026-10-01T09:15:00.000Z"));
    adRequestFindUnique.mockResolvedValueOnce(ad());
    const { GET } = await import("../src/app/api/public/ads/[id]/click/route");
    const response = await GET(new Request("http://x"), { params: Promise.resolve({ id: "ad_1" }) });
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://example.com/offre");
    expect(adEventCreate).toHaveBeenCalledWith({ data: { adRequestId: "ad_1", type: "CLICK" } });
  });

  it("redirige vers /decouvrir (sans compter) hors créneau", async () => {
    vi.setSystemTime(new Date("2026-10-01T14:00:00.000Z"));
    adRequestFindUnique.mockResolvedValueOnce(ad());
    const { GET } = await import("../src/app/api/public/ads/[id]/click/route");
    const response = await GET(new Request("http://x"), { params: Promise.resolve({ id: "ad_1" }) });
    expect(response.headers.get("location")).toContain("/decouvrir");
    expect(adEventCreate).not.toHaveBeenCalled();
  });

  it("refuse un lien ctaUrl non http(s) (défense en profondeur)", async () => {
    vi.setSystemTime(new Date("2026-10-01T09:15:00.000Z"));
    adRequestFindUnique.mockResolvedValueOnce(ad({ ctaUrl: "javascript:alert(1)" }));
    const { GET } = await import("../src/app/api/public/ads/[id]/click/route");
    const response = await GET(new Request("http://x"), { params: Promise.resolve({ id: "ad_1" }) });
    expect(response.headers.get("location")).toContain("/decouvrir");
  });
});
