import { beforeEach, describe, expect, it, vi } from "vitest";

const queryRaw = vi.fn();
const campaignUpdate = vi.fn();
const campaignDeliveryCreateMany = vi.fn();
const customerMembershipFindMany = vi.fn();
const customerPreferencesFindMany = vi.fn();
const merchantFindUnique = vi.fn();
const inAppNotificationCreate = vi.fn();
const userFindUnique = vi.fn();
const sendCampaignEmail = vi.fn();
const sendPushToUser = vi.fn();
const adRequestFindMany = vi.fn();
const adRequestFindUnique = vi.fn();
const adEventCreate = vi.fn();

vi.mock("../src/lib/prisma", () => ({
  prisma: {
    $queryRaw: (...args: unknown[]) => queryRaw(...args),
    campaign: { update: (...args: unknown[]) => campaignUpdate(...args) },
    campaignDelivery: {
      createMany: (...args: unknown[]) => campaignDeliveryCreateMany(...args),
      findMany: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    customerMembership: { findMany: (...args: unknown[]) => customerMembershipFindMany(...args) },
    customerPreferences: { findMany: (...args: unknown[]) => customerPreferencesFindMany(...args) },
    merchant: { findUnique: (...args: unknown[]) => merchantFindUnique(...args), findMany: vi.fn(async () => []) },
    inAppNotification: { create: (...args: unknown[]) => inAppNotificationCreate(...args) },
    user: { findUnique: (...args: unknown[]) => userFindUnique(...args) },
    emailSuppression: { findUnique: vi.fn() },
    adRequest: {
      findMany: (...args: unknown[]) => adRequestFindMany(...args),
      findUnique: (...args: unknown[]) => adRequestFindUnique(...args),
    },
    adEvent: { create: (...args: unknown[]) => adEventCreate(...args) },
  },
}));
vi.mock("../src/lib/email", () => ({
  sendCampaignEmail: (...args: unknown[]) => sendCampaignEmail(...args),
  isValidEmailAddress: () => true,
}));
vi.mock("../src/lib/push", () => ({ sendPushToUser: (...args: unknown[]) => sendPushToUser(...args) }));
vi.mock("../src/lib/unsubscribe-token", () => ({
  signUnsubscribeToken: vi.fn(async () => "tok"),
  unsubscribeUrl: () => "http://x/u",
}));
vi.mock("@/lib/rate-limit", () => ({
  LIMITS: { qr: { limit: 100, windowMs: 1000 }, scan: { limit: 100, windowMs: 1000 } },
  rateLimit: () => ({ ok: true as const, remaining: 1 }),
}));

const testCampaign = {
  id: "camp_test",
  merchantId: "m1",
  channel: "IN_APP_PUSH",
  audienceType: "MERCHANT_MEMBERS",
  status: "SENDING",
  title: "Promo",
  body: "Msg",
  fundingMode: "TEST",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("campagne payée en mode test : aucune diffusion réelle", () => {
  it("le worker la marque envoyée (simulation) sans créer de livraison ni lire les destinataires", async () => {
    queryRaw.mockResolvedValueOnce([testCampaign]);
    const { runWorkerTick } = await import("../src/lib/campaign-worker");
    const result = await runWorkerTick(10);

    expect(result).toMatchObject({ claimed: true, simulated: true, processed: 0, finalStatus: "SENT" });
    expect(campaignUpdate).toHaveBeenCalledWith({
      where: { id: "camp_test" },
      data: { status: "SENT", sentAt: expect.any(Date) },
    });
    expect(customerMembershipFindMany).not.toHaveBeenCalled();
    expect(customerPreferencesFindMany).not.toHaveBeenCalled();
    expect(campaignDeliveryCreateMany).not.toHaveBeenCalled();
    expect(inAppNotificationCreate).not.toHaveBeenCalled();
    expect(sendPushToUser).not.toHaveBeenCalled();
    expect(sendCampaignEmail).not.toHaveBeenCalled();
  });

  it("garde-fou : même appelée directement, une livraison test (in-app, push, e-mail) n'envoie rien", async () => {
    const { sendOneDelivery } = await import("../src/lib/campaign-worker");
    for (const channel of ["IN_APP", "PUSH", "EMAIL"] as const) {
      const outcome = await sendOneDelivery(
        { id: "d1", userId: "u1", channel, attempts: 0 } as never,
        testCampaign as never,
        { id: "m1", name: "M" } as never,
      );
      expect(outcome.status).toBe("SKIPPED");
    }
    expect(inAppNotificationCreate).not.toHaveBeenCalled();
    expect(sendPushToUser).not.toHaveBeenCalled();
    expect(sendCampaignEmail).not.toHaveBeenCalled();
  });

  it("materializeDeliveries ne matérialise aucun destinataire pour une campagne test", async () => {
    const { materializeDeliveries } = await import("../src/lib/campaign-worker");
    expect(await materializeDeliveries(testCampaign as never, { city: "Lyon", postalCode: "69001" })).toBe(0);
    expect(customerMembershipFindMany).not.toHaveBeenCalled();
    expect(campaignDeliveryCreateMany).not.toHaveBeenCalled();
  });

  it("une campagne gratuite (quota) ou réelle est toujours diffusée normalement", async () => {
    const { materializeDeliveries } = await import("../src/lib/campaign-worker");
    for (const fundingMode of [null, "LIVE"]) {
      customerMembershipFindMany.mockResolvedValueOnce([
        { userId: "u1", user: { preferences: { notifyMerchantOffers: true, adsMerchantPush: false } } },
      ]);
      campaignDeliveryCreateMany.mockResolvedValueOnce({ count: 1 });
      const count = await materializeDeliveries({ ...testCampaign, fundingMode } as never, { city: null, postalCode: null });
      expect(count).toBe(1);
    }
  });
});

describe("mise en avant payée en mode test : jamais publiée", () => {
  it("l'annuaire public ne diffuse plus aucune mise en avant (servies par /api/customer/sponsored, qui exclut le TEST)", async () => {
    adRequestFindMany.mockResolvedValue([]);
    const { GET } = await import("../src/app/api/public/merchants/route");
    await GET(new Request("http://localhost:3000/api/public/merchants"));
    expect(adRequestFindMany).not.toHaveBeenCalled();
    const { readFileSync } = await import("fs");
    expect(readFileSync("src/lib/sponsored-selection.ts", "utf8")).toContain('OR: [{ fundingMode: null }, { fundingMode: "LIVE" }]');
  });

  it("impression et clic sur une annonce test sont refusés (pas d'événement, pas de redirection vers la cible)", async () => {
    const start = new Date(Date.now() - 1000);
    const end = new Date(Date.now() + 86_400_000);
    adRequestFindUnique.mockResolvedValue({
      id: "ad1",
      status: "SCHEDULED",
      fundingMode: "TEST",
      startDate: start,
      endDate: end,
      ctaUrl: "https://cible.test",
    });

    const imp = await import("../src/app/api/public/ads/[id]/impression/route");
    const impMethod = (imp as Record<string, unknown>).POST ?? (imp as Record<string, unknown>).GET;
    const impResponse = await (impMethod as (r: Request, c: unknown) => Promise<Response>)(
      new Request("http://localhost:3000/x", { method: "POST" }),
      { params: Promise.resolve({ id: "ad1" }) },
    );
    expect(impResponse.status).toBe(404);

    const click = await import("../src/app/api/public/ads/[id]/click/route");
    const clickResponse = await click.GET(new Request("http://localhost:3000/x"), {
      params: Promise.resolve({ id: "ad1" }),
    });
    expect(clickResponse.headers.get("location") ?? "").not.toContain("cible.test");
    expect(adEventCreate).not.toHaveBeenCalled();
  });

  it("une annonce réelle reste publiée", async () => {
    const start = new Date(Date.now() - 1000);
    const end = new Date(Date.now() + 86_400_000);
    adRequestFindUnique.mockResolvedValue({ id: "ad1", status: "SCHEDULED", fundingMode: "LIVE", startDate: start, endDate: end });
    const imp = await import("../src/app/api/public/ads/[id]/impression/route");
    const impMethod = (imp as Record<string, unknown>).POST ?? (imp as Record<string, unknown>).GET;
    const response = await (impMethod as (r: Request, c: unknown) => Promise<Response>)(
      new Request("http://localhost:3000/x", { method: "POST" }),
      { params: Promise.resolve({ id: "ad1" }) },
    );
    expect(response.status).toBe(200);
    expect(adEventCreate).toHaveBeenCalled();
  });
});
