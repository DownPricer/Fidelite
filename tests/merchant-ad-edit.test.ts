import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const requireMutatingRequest = vi.fn();
const requireMerchantAdmin = vi.fn();
const adRequestFindFirst = vi.fn();
const adRequestUpdate = vi.fn();
const campaignUpdate = vi.fn();
const writeAudit = vi.fn();

vi.mock("@/lib/api-guard", () => ({ requireMutatingRequest, requireMerchantAdmin }));
vi.mock("@/lib/audit", () => ({ writeAudit }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    adRequest: {
      findFirst: (...args: unknown[]) => adRequestFindFirst(...args),
      update: (...args: unknown[]) => adRequestUpdate(...args),
    },
    campaign: { update: (...args: unknown[]) => campaignUpdate(...args) },
  },
}));

function req(body: unknown) {
  return new NextRequest("http://localhost:3000/api/merchant/ads/ad_1", {
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
    status: "APPROVED",
    visualMode: "FIDETO",
    requestedText: "Ancien texte",
    ctaLabel: null,
    ctaUrl: null,
    objective: null,
    requestedImageUrl: null,
    finalImageUrl: "/api/media/campaigns/m1/old.jpg",
    hourlySchedule: [{ date: "2026-10-01", hours: [9, 10, 11] }],
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  requireMutatingRequest.mockResolvedValue({ error: null });
  requireMerchantAdmin.mockResolvedValue({ error: null, user: { id: "u1" }, membership: { merchantId: "m1" } });
  adRequestUpdate.mockImplementation(async ({ data }: { data: unknown }) => ({ id: "ad_1", ...(data as object) }));
});

describe("PATCH /api/merchant/ads/[id]", () => {
  it("modifier une demande APPROVED annule l'approbation et repart en PENDING_REVIEW", async () => {
    adRequestFindFirst.mockResolvedValueOnce(baseAd({ status: "APPROVED" }));
    const { PATCH } = await import("../src/app/api/merchant/ads/[id]/route");
    const response = await PATCH(req({ requestedText: "Nouveau texte plus long" }), { params: Promise.resolve({ id: "ad_1" }) });
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.approvalRevoked).toBe(true);
    expect(adRequestUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: "PENDING_REVIEW", finalImageUrl: null, reviewedBy: null }),
      }),
    );
  });

  it("modifier les horaires recalcule le prix et les intervalles côté serveur", async () => {
    adRequestFindFirst.mockResolvedValueOnce(baseAd({ status: "PENDING_REVIEW" }));
    const { PATCH } = await import("../src/app/api/merchant/ads/[id]/route");
    const response = await PATCH(
      req({ hourlySchedule: [{ date: "2026-10-05", hours: [9, 10, 11, 12] }] }),
      { params: Promise.resolve({ id: "ad_1" }) },
    );
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.pricing.totalHours).toBe(4);
    expect(body.pricing.totalCents).toBeGreaterThan(0);
    expect(adRequestUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ hourlySchedule: [{ date: "2026-10-05", hours: [9, 10, 11, 12] }] }) }),
    );
  });

  it("refuse la modification d'une demande déjà programmée ou diffusée", async () => {
    adRequestFindFirst.mockResolvedValueOnce(baseAd({ status: "SCHEDULED" }));
    const { PATCH } = await import("../src/app/api/merchant/ads/[id]/route");
    const response = await PATCH(req({ requestedText: "Essai" }), { params: Promise.resolve({ id: "ad_1" }) });
    expect(response.status).toBe(409);
    expect(adRequestUpdate).not.toHaveBeenCalled();
  });

  it("refuse un planning sous le minimum de 3h/jour", async () => {
    adRequestFindFirst.mockResolvedValueOnce(baseAd({ status: "PENDING_REVIEW" }));
    const { PATCH } = await import("../src/app/api/merchant/ads/[id]/route");
    const response = await PATCH(req({ hourlySchedule: [{ date: "2026-10-05", hours: [9, 10] }] }), {
      params: Promise.resolve({ id: "ad_1" }),
    });
    expect(response.status).toBe(400);
    expect(adRequestUpdate).not.toHaveBeenCalled();
  });
});
