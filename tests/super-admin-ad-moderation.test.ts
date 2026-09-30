import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const requireMutatingRequest = vi.fn();
const requireSuperAdmin = vi.fn();
const adRequestFindUnique = vi.fn();
const adRequestUpdate = vi.fn();
const campaignUpdate = vi.fn();
const writeAudit = vi.fn();

vi.mock("@/lib/api-guard", () => ({ requireMutatingRequest, requireSuperAdmin }));
vi.mock("@/lib/audit", () => ({ writeAudit }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    adRequest: {
      findUnique: (...args: unknown[]) => adRequestFindUnique(...args),
      update: (...args: unknown[]) => adRequestUpdate(...args),
    },
    auditLog: { findMany: vi.fn().mockResolvedValue([]) },
    adEvent: { findMany: vi.fn().mockResolvedValue([]) },
    $transaction: async (callback: (tx: unknown) => Promise<unknown>) =>
      callback({
        adRequest: { update: (...args: unknown[]) => adRequestUpdate(...args) },
        campaign: { update: (...args: unknown[]) => campaignUpdate(...args) },
      }),
  },
}));

function req(body: unknown) {
  return new NextRequest("http://localhost:3000/api/super-admin/ads/ad_1", {
    method: "PATCH",
    headers: { "Content-Type": "application/json", origin: "http://localhost:3000" },
    body: JSON.stringify(body),
  });
}

function baseAd(overrides: Record<string, unknown> = {}) {
  return {
    id: "ad_1",
    merchantId: "m1",
    campaignId: "camp_1",
    status: "PENDING_REVIEW",
    ctaUrl: "https://example.com",
    hourlySchedule: [{ date: "2026-10-01", hours: [9, 10, 11] }],
    hourlyIntervals: [{ start: "2026-10-01T07:00:00.000Z", end: "2026-10-01T10:00:00.000Z" }],
    startDate: new Date("2026-10-01T07:00:00.000Z"),
    endDate: new Date("2026-10-01T10:00:00.000Z"),
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  requireMutatingRequest.mockResolvedValue({ error: null });
  requireSuperAdmin.mockResolvedValue({ error: null, user: { id: "admin_1" } });
});

describe("PATCH /api/super-admin/ads/[id]", () => {
  it("request_changes : exige un motif et passe en NEEDS_CHANGES", async () => {
    adRequestFindUnique.mockResolvedValueOnce(baseAd());
    const { PATCH } = await import("../src/app/api/super-admin/ads/[id]/route");

    const missingReason = await PATCH(req({ action: "request_changes" }), { params: Promise.resolve({ id: "ad_1" }) });
    expect(missingReason.status).toBe(400);

    adRequestFindUnique.mockResolvedValueOnce(baseAd());
    const ok = await PATCH(req({ action: "request_changes", rejectionReason: "Le texte dépasse la limite." }), {
      params: Promise.resolve({ id: "ad_1" }),
    });
    expect(ok.status).toBe(200);
    expect(adRequestUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: "NEEDS_CHANGES" }) }),
    );
  });

  it("approve : refuse si aucun créneau valide", async () => {
    adRequestFindUnique.mockResolvedValueOnce(baseAd({ hourlySchedule: [] }));
    const { PATCH } = await import("../src/app/api/super-admin/ads/[id]/route");
    const response = await PATCH(req({ action: "approve", finalImageUrl: "/api/media/campaigns/m1/x.jpg" }), {
      params: Promise.resolve({ id: "ad_1" }),
    });
    expect(response.status).toBe(409);
  });

  it("approve : refuse un lien non http(s)", async () => {
    adRequestFindUnique.mockResolvedValueOnce(baseAd());
    const { PATCH } = await import("../src/app/api/super-admin/ads/[id]/route");
    const response = await PATCH(
      req({ action: "approve", finalImageUrl: "/api/media/campaigns/m1/x.jpg", ctaUrl: "javascript:alert(1)" }),
      { params: Promise.resolve({ id: "ad_1" }) },
    );
    expect(response.status).toBe(400);
  });

  it("suspend : uniquement depuis SCHEDULED ou LIVE", async () => {
    adRequestFindUnique.mockResolvedValueOnce(baseAd({ status: "PENDING_REVIEW" }));
    const { PATCH } = await import("../src/app/api/super-admin/ads/[id]/route");
    const refused = await PATCH(req({ action: "suspend" }), { params: Promise.resolve({ id: "ad_1" }) });
    expect(refused.status).toBe(409);

    adRequestFindUnique.mockResolvedValueOnce(baseAd({ status: "LIVE" }));
    const ok = await PATCH(req({ action: "suspend", rejectionReason: "Plainte client." }), {
      params: Promise.resolve({ id: "ad_1" }),
    });
    expect(ok.status).toBe(200);
    expect(adRequestUpdate).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ status: "SUSPENDED" }) }));
  });

  it("resume : relance une mise en avant suspendue vers SCHEDULED si des créneaux restent", async () => {
    adRequestFindUnique.mockResolvedValueOnce(
      baseAd({
        status: "SUSPENDED",
        hourlyIntervals: [{ start: "2099-01-01T07:00:00.000Z", end: "2099-01-01T10:00:00.000Z" }],
      }),
    );
    const { PATCH } = await import("../src/app/api/super-admin/ads/[id]/route");
    const response = await PATCH(req({ action: "resume" }), { params: Promise.resolve({ id: "ad_1" }) });
    expect(response.status).toBe(200);
    expect(adRequestUpdate).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ status: "SCHEDULED" }) }));
  });

  it("resume : bascule vers ENDED si tous les créneaux sont déjà passés", async () => {
    adRequestFindUnique.mockResolvedValueOnce(
      baseAd({
        status: "SUSPENDED",
        hourlyIntervals: [{ start: "2020-01-01T07:00:00.000Z", end: "2020-01-01T10:00:00.000Z" }],
      }),
    );
    const { PATCH } = await import("../src/app/api/super-admin/ads/[id]/route");
    const response = await PATCH(req({ action: "resume" }), { params: Promise.resolve({ id: "ad_1" }) });
    expect(response.status).toBe(200);
    expect(adRequestUpdate).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ status: "ENDED" }) }));
  });

  it("stop : arrête une mise en avant SCHEDULED/LIVE/SUSPENDED, refuse sinon", async () => {
    adRequestFindUnique.mockResolvedValueOnce(baseAd({ status: "ENDED" }));
    const { PATCH } = await import("../src/app/api/super-admin/ads/[id]/route");
    const refused = await PATCH(req({ action: "stop" }), { params: Promise.resolve({ id: "ad_1" }) });
    expect(refused.status).toBe(409);

    adRequestFindUnique.mockResolvedValueOnce(baseAd({ status: "SCHEDULED" }));
    const ok = await PATCH(req({ action: "stop" }), { params: Promise.resolve({ id: "ad_1" }) });
    expect(ok.status).toBe(200);
    expect(adRequestUpdate).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ status: "STOPPED" }) }));
  });
});
