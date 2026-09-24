import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const requireMutatingRequest = vi.fn();
const requireSuperAdmin = vi.fn();
const campaignFindUnique = vi.fn();
const campaignUpdate = vi.fn();
const campaignPaymentUpdate = vi.fn();
const refundIncludedQuota = vi.fn();
const refundCampaignPayment = vi.fn();
const writeAudit = vi.fn();
const refundCampaignDebit = vi.fn();

vi.mock("@/lib/api-guard", () => ({ requireMutatingRequest, requireSuperAdmin }));
vi.mock("@/lib/audit", () => ({ writeAudit }));
vi.mock("@/lib/campaign-quota", () => ({ refundIncludedQuota: (...args: unknown[]) => refundIncludedQuota(...args) }));
vi.mock("@/lib/marketing-balance", () => ({ refundCampaignDebit: (...args: unknown[]) => refundCampaignDebit(...args) }));
vi.mock("@/lib/stripe", () => ({ refundCampaignPayment: (...args: unknown[]) => refundCampaignPayment(...args) }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    campaign: {
      findUnique: (...args: unknown[]) => campaignFindUnique(...args),
      update: (...args: unknown[]) => campaignUpdate(...args),
    },
    $transaction: async (callback: (tx: unknown) => Promise<unknown>) =>
      callback({
        campaign: { update: (...args: unknown[]) => campaignUpdate(...args) },
        campaignPayment: { update: (...args: unknown[]) => campaignPaymentUpdate(...args) },
      }),
  },
}));

function req(body: unknown) {
  return new NextRequest("http://localhost:3000/api/super-admin/campaigns/camp_1/moderate", {
    method: "POST",
    headers: { "Content-Type": "application/json", origin: "http://localhost:3000" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  requireMutatingRequest.mockResolvedValue({ error: null });
  requireSuperAdmin.mockResolvedValue({ error: null, user: { id: "admin_1" } });
});

describe("POST /api/super-admin/campaigns/[id]/moderate", () => {
  it("approuve : passe la campagne réseau en SCHEDULED", async () => {
    campaignFindUnique.mockResolvedValueOnce({
      id: "camp_1",
      merchantId: "m1",
      status: "PENDING_REVIEW",
      quotaKind: null,
      payment: null,
    });
    const { POST } = await import("../src/app/api/super-admin/campaigns/[id]/moderate/route");
    const response = await POST(req({ action: "approve" }), { params: Promise.resolve({ id: "camp_1" }) });
    expect(response.status).toBe(200);
    expect(campaignUpdate).toHaveBeenCalledWith({ where: { id: "camp_1" }, data: { status: "SCHEDULED" } });
  });

  it("refuse : rembourse le paiement Stripe ET journalise le remboursement", async () => {
    campaignFindUnique.mockResolvedValueOnce({
      id: "camp_1",
      merchantId: "m1",
      status: "PENDING_REVIEW",
      quotaKind: null,
      quotaPeriodKey: null,
      quotaConsumedAt: null,
      payment: { id: "pay_1", status: "PAID", stripePaymentIntentId: "pi_1" },
    });
    refundCampaignPayment.mockResolvedValueOnce({});

    const { POST } = await import("../src/app/api/super-admin/campaigns/[id]/moderate/route");
    const response = await POST(req({ action: "reject", rejectionReason: "Contenu non conforme." }), {
      params: Promise.resolve({ id: "camp_1" }),
    });

    expect(response.status).toBe(200);
    expect(campaignUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: "REJECTED" }) }),
    );
    expect(campaignPaymentUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: "REFUNDED" }) }),
    );
    expect(refundCampaignPayment).toHaveBeenCalledWith("pi_1");
  });

  it("refuse : restitue le quota consommé si aucun paiement Stripe n'existait", async () => {
    campaignFindUnique.mockResolvedValueOnce({
      id: "camp_1",
      merchantId: "m1",
      status: "PENDING_REVIEW",
      quotaKind: "MEMBER_NOTIFICATION",
      quotaPeriodKey: "2026-09",
      quotaConsumedAt: new Date(),
      payment: null,
    });

    const { POST } = await import("../src/app/api/super-admin/campaigns/[id]/moderate/route");
    await POST(req({ action: "reject" }), { params: Promise.resolve({ id: "camp_1" }) });

    expect(refundIncludedQuota).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ merchantId: "m1", kind: "MEMBER_NOTIFICATION", periodKey: "2026-09" }),
    );
    expect(refundCampaignPayment).not.toHaveBeenCalled();
    // Refus avant diffusion : restitution du débit du solde marketing (idempotent), s'il y en a un.
    expect(refundCampaignDebit).toHaveBeenCalledWith(expect.anything(), "camp_1", expect.any(String));
  });

  it("refuse de modérer deux fois la même campagne", async () => {
    campaignFindUnique.mockResolvedValueOnce({ id: "camp_1", merchantId: "m1", status: "SCHEDULED" });
    const { POST } = await import("../src/app/api/super-admin/campaigns/[id]/moderate/route");
    const response = await POST(req({ action: "approve" }), { params: Promise.resolve({ id: "camp_1" }) });
    expect(response.status).toBe(409);
  });
});
