import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const requireMutatingRequest = vi.fn();
const requireMerchantAdmin = vi.fn();
const campaignFindFirst = vi.fn();
const campaignUpdate = vi.fn();
const campaignCreate = vi.fn();
const campaignFindMany = vi.fn();
const writeAudit = vi.fn();

vi.mock("@/lib/api-guard", () => ({ requireMutatingRequest, requireMerchantAdmin }));
vi.mock("@/lib/audit", () => ({ writeAudit }));
const refundCampaignDebit = vi.fn();
vi.mock("@/lib/marketing-balance", () => ({
  refundCampaignDebit: (...args: unknown[]) => refundCampaignDebit(...args),
  getMarketingBalanceCents: vi.fn(async () => 0),
}));
vi.mock("@/lib/campaign-quota", () => ({
  calendarPeriodKeyEuropeParis: () => "2026-09",
  getQuotaUsage: vi.fn(async () => 0),
  includedQuotaFor: (tier: string, kind: string) =>
    tier === "insight" ? { MEMBER_NOTIFICATION: 3, MEMBER_EMAIL: 3, SPONSORED_DAY: 3 }[kind] ?? 0 : { MEMBER_NOTIFICATION: 1, MEMBER_EMAIL: 1 }[kind] ?? 0,
  resolvePlanTier: vi.fn(async () => "normal"),
}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    campaign: {
      findFirst: (...args: unknown[]) => campaignFindFirst(...args),
      findMany: (...args: unknown[]) => campaignFindMany(...args),
      update: (...args: unknown[]) => campaignUpdate(...args),
      create: (...args: unknown[]) => campaignCreate(...args),
    },
    $transaction: async (callback: (client: unknown) => Promise<unknown>) =>
      callback({ campaign: { update: (...args: unknown[]) => campaignUpdate(...args) } }),
  },
}));

function req(method: string, body?: unknown) {
  return new NextRequest("http://localhost:3000/api/merchant/campaigns", {
    method,
    headers: { "Content-Type": "application/json", origin: "http://localhost:3000" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  requireMutatingRequest.mockResolvedValue({ error: null });
  requireMerchantAdmin.mockResolvedValue({
    error: null,
    user: { id: "staff_1" },
    membership: { merchantId: "merchant_A" },
  });
});

describe("GET/POST /api/merchant/campaigns", () => {
  it("liste uniquement les campagnes du commerce authentifié", async () => {
    campaignFindMany.mockResolvedValueOnce([]);
    const { GET } = await import("../src/app/api/merchant/campaigns/route");
    await GET(req("GET"));
    expect(campaignFindMany).toHaveBeenCalledWith(expect.objectContaining({ where: { merchantId: "merchant_A" } }));
  });

  it("crée un brouillon rattaché au commerçant authentifié, pas à un merchantId du body", async () => {
    campaignCreate.mockResolvedValueOnce({
      id: "camp_new",
      merchantId: "merchant_A",
      channel: "EMAIL",
      audienceType: "MERCHANT_MEMBERS",
      status: "DRAFT",
      title: "",
      body: "",
    });
    const { POST } = await import("../src/app/api/merchant/campaigns/route");
    const response = await POST(
      req("POST", { channel: "EMAIL", audienceType: "MERCHANT_MEMBERS", merchantId: "merchant_ATTACKER" }),
    );
    expect(response.status).toBe(200);
    expect(campaignCreate).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ merchantId: "merchant_A" }) }),
    );
  });
});

describe("GET/PATCH/DELETE /api/merchant/campaigns/[id] — isolation entre commerces", () => {
  it("GET : 404 si la campagne appartient à un autre commerce", async () => {
    campaignFindFirst.mockResolvedValueOnce(null);
    const { GET } = await import("../src/app/api/merchant/campaigns/[id]/route");
    const response = await GET(req("GET"), { params: Promise.resolve({ id: "camp_other" }) });
    expect(response.status).toBe(404);
    expect(campaignFindFirst).toHaveBeenCalledWith({ where: { id: "camp_other", merchantId: "merchant_A" } });
  });

  it("PATCH : refuse de modifier une campagne qui n'est plus en brouillon", async () => {
    campaignFindFirst.mockResolvedValueOnce({ id: "camp_1", merchantId: "merchant_A", status: "SCHEDULED" });
    const { PATCH } = await import("../src/app/api/merchant/campaigns/[id]/route");
    const response = await PATCH(req("PATCH", { title: "x", body: "y" }), {
      params: Promise.resolve({ id: "camp_1" }),
    });
    expect(response.status).toBe(409);
    expect(campaignUpdate).not.toHaveBeenCalled();
  });

  it("DELETE : refuse d'annuler une campagne déjà en cours d'envoi", async () => {
    campaignFindFirst.mockResolvedValueOnce({ id: "camp_1", merchantId: "merchant_A", status: "SENDING" });
    const { DELETE } = await import("../src/app/api/merchant/campaigns/[id]/route");
    const response = await DELETE(req("DELETE"), { params: Promise.resolve({ id: "camp_1" }) });
    expect(response.status).toBe(409);
  });

  it("DELETE : annule une campagne encore programmée", async () => {
    campaignFindFirst.mockResolvedValueOnce({ id: "camp_1", merchantId: "merchant_A", status: "SCHEDULED" });
    const { DELETE } = await import("../src/app/api/merchant/campaigns/[id]/route");
    const response = await DELETE(req("DELETE"), { params: Promise.resolve({ id: "camp_1" }) });
    expect(response.status).toBe(200);
    expect(campaignUpdate).toHaveBeenCalledWith({ where: { id: "camp_1" }, data: { status: "CANCELLED" } });
    // Avant diffusion : le débit du solde marketing éventuel est restitué (idempotent côté lib).
    expect(refundCampaignDebit).toHaveBeenCalledWith(expect.anything(), "camp_1", expect.any(String));
  });
});
