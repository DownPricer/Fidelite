import { beforeEach, describe, expect, it, vi } from "vitest";

const customerMembershipFindMany = vi.fn();
const customerPreferencesFindMany = vi.fn();
const campaignDeliveryCreateMany = vi.fn();
const campaignDeliveryFindMany = vi.fn();
const campaignDeliveryUpdate = vi.fn();
const campaignDeliveryCount = vi.fn();
const campaignUpdate = vi.fn();
const merchantFindUnique = vi.fn();
const userFindUnique = vi.fn();
const emailSuppressionFindUnique = vi.fn();
const inAppNotificationCreate = vi.fn();
const queryRaw = vi.fn();
const sendCampaignEmail = vi.fn();
const sendPushToUser = vi.fn();

vi.mock("../src/lib/prisma", () => ({
  prisma: {
    $queryRaw: (...args: unknown[]) => queryRaw(...args),
    customerMembership: { findMany: (...args: unknown[]) => customerMembershipFindMany(...args) },
    customerPreferences: { findMany: (...args: unknown[]) => customerPreferencesFindMany(...args) },
    campaignDelivery: {
      createMany: (...args: unknown[]) => campaignDeliveryCreateMany(...args),
      findMany: (...args: unknown[]) => campaignDeliveryFindMany(...args),
      update: (...args: unknown[]) => campaignDeliveryUpdate(...args),
      count: (...args: unknown[]) => campaignDeliveryCount(...args),
    },
    campaign: { update: (...args: unknown[]) => campaignUpdate(...args) },
    merchant: { findUnique: (...args: unknown[]) => merchantFindUnique(...args) },
    user: { findUnique: (...args: unknown[]) => userFindUnique(...args) },
    emailSuppression: { findUnique: (...args: unknown[]) => emailSuppressionFindUnique(...args) },
    inAppNotification: { create: (...args: unknown[]) => inAppNotificationCreate(...args) },
  },
}));

vi.mock("../src/lib/email", () => ({
  sendCampaignEmail: (...args: unknown[]) => sendCampaignEmail(...args),
  isValidEmailAddress: (v: string) => /@/.test(v),
}));

vi.mock("../src/lib/push", () => ({
  sendPushToUser: (...args: unknown[]) => sendPushToUser(...args),
}));

const {
  materializeDeliveries,
  sendOneDelivery,
  processPendingDeliveries,
  finalizeCampaignIfComplete,
  claimNextScheduledCampaign,
} = await import("../src/lib/campaign-worker");

const baseCampaign = {
  id: "camp_1",
  merchantId: "merchant_A",
  channel: "IN_APP_PUSH" as const,
  audienceType: "MERCHANT_MEMBERS" as const,
  title: "Offre",
  body: "Détails",
  imageUrl: null,
  actionLabel: null,
  actionUrl: null,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("claimNextScheduledCampaign", () => {
  it("réclame via UPDATE ... RETURNING (verrouillage atomique)", async () => {
    queryRaw.mockResolvedValueOnce([{ id: "camp_1" }]);
    const claimed = await claimNextScheduledCampaign();
    expect(claimed).toEqual({ id: "camp_1" });
    expect(queryRaw).toHaveBeenCalledTimes(1);
  });

  it("renvoie null quand rien n'est éligible", async () => {
    queryRaw.mockResolvedValueOnce([]);
    expect(await claimNextScheduledCampaign()).toBeNull();
  });
});

describe("materializeDeliveries — isolation et consentement", () => {
  it("membres : ne matérialise que les clients ayant consenti au canal in-app, avec push en bonus si autorisé", async () => {
    customerMembershipFindMany.mockResolvedValueOnce([
      { userId: "u1", user: { preferences: { notifyMerchantOffers: true, adsMerchantPush: true, adsMerchantEmail: false } } },
      { userId: "u2", user: { preferences: { notifyMerchantOffers: true, adsMerchantPush: false, adsMerchantEmail: false } } },
      { userId: "u3", user: { preferences: { notifyMerchantOffers: false, adsMerchantPush: true, adsMerchantEmail: false } } },
    ]);
    campaignDeliveryCreateMany.mockResolvedValueOnce({ count: 3 });

    await materializeDeliveries(baseCampaign as never, { city: null, postalCode: null });

    const rows = campaignDeliveryCreateMany.mock.calls[0]?.[0]?.data as { userId: string; channel: string }[];
    expect(rows).toEqual(
      expect.arrayContaining([
        { campaignId: "camp_1", userId: "u1", channel: "IN_APP", status: "PENDING" },
        { campaignId: "camp_1", userId: "u1", channel: "PUSH", status: "PENDING" },
        { campaignId: "camp_1", userId: "u2", channel: "IN_APP", status: "PENDING" },
      ]),
    );
    // u3 n'a pas consenti à l'in-app (notifyMerchantOffers=false) : jamais matérialisé, même pour du push.
    expect(rows.some((r) => r.userId === "u3")).toBe(false);
  });

  it("réseau : filtre par zone marketing déclarée, jamais de coordonnées inventées", async () => {
    customerPreferencesFindMany.mockResolvedValueOnce([
      { userId: "u1", notifyFifeLifeNews: true, adsNetworkPush: false, adsNetworkEmail: false },
    ]);
    campaignDeliveryCreateMany.mockResolvedValueOnce({ count: 1 });

    await materializeDeliveries({ ...baseCampaign, audienceType: "NETWORK_LOCAL" } as never, {
      city: "Lyon",
      postalCode: "69001",
    });

    expect(customerPreferencesFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: [{ marketingZonePostalCode: "69001" }, { marketingZoneCity: { equals: "Lyon", mode: "insensitive" } }],
        }),
      }),
    );
  });

  it("n'écrit rien sans adresse commerce exploitable (audience réseau)", async () => {
    const count = await materializeDeliveries({ ...baseCampaign, audienceType: "NETWORK_LOCAL" } as never, {
      city: null,
      postalCode: null,
    });
    expect(count).toBe(0);
    expect(campaignDeliveryCreateMany).not.toHaveBeenCalled();
  });
});

describe("sendOneDelivery", () => {
  it("IN_APP : crée une notification interne", async () => {
    inAppNotificationCreate.mockResolvedValueOnce({});
    const result = await sendOneDelivery(
      { channel: "IN_APP", userId: "u1" } as never,
      baseCampaign as never,
      { id: "merchant_A", name: "Café Demo", logoUrl: null, addressLine1: null, city: null } as never,
    );
    expect(result.status).toBe("SENT");
  });

  it("EMAIL : ignore une adresse en liste de suppression, sans jamais appeler le fournisseur", async () => {
    userFindUnique.mockResolvedValueOnce({ email: "bounced@example.com" });
    emailSuppressionFindUnique.mockResolvedValueOnce({ email: "bounced@example.com" });

    const result = await sendOneDelivery(
      { channel: "EMAIL", userId: "u1" } as never,
      baseCampaign as never,
      { id: "merchant_A", name: "Café Demo", logoUrl: null, addressLine1: null, city: null } as never,
    );

    expect(result.status).toBe("SKIPPED");
    expect(sendCampaignEmail).not.toHaveBeenCalled();
  });

  it("EMAIL : envoie avec un lien de désinscription et journalise l'échec du fournisseur sans lever", async () => {
    userFindUnique.mockResolvedValueOnce({ email: "client@example.com" });
    emailSuppressionFindUnique.mockResolvedValueOnce(null);
    sendCampaignEmail.mockResolvedValueOnce({ ok: false, error: "Fournisseur indisponible." });

    const result = await sendOneDelivery(
      { channel: "EMAIL", userId: "u1" } as never,
      baseCampaign as never,
      { id: "merchant_A", name: "Café Demo", logoUrl: null, addressLine1: null, city: null } as never,
    );

    expect(result.status).toBe("FAILED");
    expect(sendCampaignEmail).toHaveBeenCalledWith(expect.objectContaining({ unsubscribeUrl: expect.stringContaining("/desinscription?token=") }));
  });
});

describe("processPendingDeliveries — délai progressif", () => {
  it("remet en PENDING avec nextAttemptAt quand il reste des tentatives", async () => {
    merchantFindUnique.mockResolvedValueOnce({ id: "merchant_A", name: "Café Demo" });
    campaignDeliveryFindMany.mockResolvedValueOnce([
      { id: "d1", channel: "IN_APP", userId: "u1", attempts: 0 },
    ]);
    inAppNotificationCreate.mockRejectedValueOnce(new Error("db down"));

    await processPendingDeliveries(baseCampaign as never, 10);

    expect(campaignDeliveryUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: "PENDING", attempts: 1, nextAttemptAt: expect.any(Date) }),
      }),
    );
  });

  it("passe en FAILED définitif après épuisement des tentatives", async () => {
    merchantFindUnique.mockResolvedValueOnce({ id: "merchant_A", name: "Café Demo" });
    campaignDeliveryFindMany.mockResolvedValueOnce([
      { id: "d1", channel: "EMAIL", userId: "u1", attempts: 2 },
    ]);
    userFindUnique.mockResolvedValueOnce({ email: "client@example.com" });
    emailSuppressionFindUnique.mockResolvedValueOnce(null);
    sendCampaignEmail.mockResolvedValueOnce({ ok: false, error: "Échec définitif." });

    await processPendingDeliveries(baseCampaign as never, 10);

    expect(campaignDeliveryUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: "FAILED", attempts: 3, nextAttemptAt: null }) }),
    );
  });
});

describe("finalizeCampaignIfComplete", () => {
  it("ne clôture pas tant que des livraisons restent en attente", async () => {
    campaignDeliveryCount.mockResolvedValueOnce(2); // remaining PENDING
    const result = await finalizeCampaignIfComplete("camp_1");
    expect(result).toBeNull();
    expect(campaignUpdate).not.toHaveBeenCalled();
  });

  it("SENT quand toutes les livraisons ont réussi", async () => {
    campaignDeliveryCount
      .mockResolvedValueOnce(0) // remaining
      .mockResolvedValueOnce(5) // sent
      .mockResolvedValueOnce(5); // total
    const status = await finalizeCampaignIfComplete("camp_1");
    expect(status).toBe("SENT");
  });

  it("PARTIALLY_SENT quand certaines livraisons ont échoué", async () => {
    campaignDeliveryCount.mockResolvedValueOnce(0).mockResolvedValueOnce(3).mockResolvedValueOnce(5);
    const status = await finalizeCampaignIfComplete("camp_1");
    expect(status).toBe("PARTIALLY_SENT");
  });

  it("FAILED quand aucune livraison n'a réussi", async () => {
    campaignDeliveryCount.mockResolvedValueOnce(0).mockResolvedValueOnce(0).mockResolvedValueOnce(4);
    const status = await finalizeCampaignIfComplete("camp_1");
    expect(status).toBe("FAILED");
  });
});
