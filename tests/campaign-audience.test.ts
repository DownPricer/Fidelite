import { beforeEach, describe, expect, it, vi } from "vitest";

const customerMembershipFindMany = vi.fn();
const customerPreferencesFindMany = vi.fn();

vi.mock("../src/lib/prisma", () => ({
  prisma: {
    customerMembership: { findMany: (...args: unknown[]) => customerMembershipFindMany(...args) },
    customerPreferences: { findMany: (...args: unknown[]) => customerPreferencesFindMany(...args) },
  },
}));

const { estimateMerchantMembersAudience, estimateNetworkLocalAudience } = await import(
  "../src/lib/campaign-audience"
);

function member(prefs: { notifyMerchantOffers?: boolean; adsMerchantPush?: boolean; adsMerchantEmail?: boolean } | null) {
  return { user: { id: Math.random().toString(), preferences: prefs } };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("estimateMerchantMembersAudience", () => {
  it("ne compte joignables que les clients ayant explicitement consenti à ce canal", async () => {
    customerMembershipFindMany.mockResolvedValueOnce([
      member({ notifyMerchantOffers: true, adsMerchantPush: true, adsMerchantEmail: false }),
      member({ notifyMerchantOffers: true, adsMerchantPush: false, adsMerchantEmail: true }),
      member({ notifyMerchantOffers: false, adsMerchantPush: false, adsMerchantEmail: false }),
      member(null),
    ]);

    const inApp = await estimateMerchantMembersAudience("m1", "IN_APP_PUSH");
    expect(inApp.totalInAudience).toBe(4);
    expect(inApp.inAppConsented).toBe(2);
    expect(inApp.estimatedRecipients).toBe(2);

    customerMembershipFindMany.mockResolvedValueOnce([
      member({ notifyMerchantOffers: true, adsMerchantPush: true, adsMerchantEmail: false }),
      member({ notifyMerchantOffers: true, adsMerchantPush: false, adsMerchantEmail: true }),
    ]);
    const email = await estimateMerchantMembersAudience("m1", "EMAIL");
    expect(email.emailConsented).toBe(1);
    expect(email.estimatedRecipients).toBe(1);
  });

  it("ne filtre que sur ce commerce (isolation) — la requête est scopée par merchantId", async () => {
    customerMembershipFindMany.mockResolvedValueOnce([]);
    await estimateMerchantMembersAudience("merchant_A", "EMAIL");
    expect(customerMembershipFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ merchantId: "merchant_A", removedAt: null }) }),
    );
  });
});

describe("estimateNetworkLocalAudience", () => {
  it("zéro audience sans adresse commerce exploitable (jamais de coordonnées inventées)", async () => {
    const result = await estimateNetworkLocalAudience({ id: "m1", city: null, postalCode: null }, "IN_APP_PUSH");
    expect(result.totalInAudience).toBe(0);
    expect(customerPreferencesFindMany).not.toHaveBeenCalled();
  });

  it("ne compte que les clients ayant accepté les bons plans réseau dans la zone déclarée", async () => {
    customerPreferencesFindMany.mockResolvedValueOnce([
      { notifyFifeLifeNews: true, adsNetworkPush: true, adsNetworkEmail: false },
      { notifyFifeLifeNews: false, adsNetworkPush: false, adsNetworkEmail: true },
    ]);
    const result = await estimateNetworkLocalAudience({ id: "m1", city: "Lyon", postalCode: "69001" }, "EMAIL");
    expect(result.emailConsented).toBe(1);
    expect(result.estimatedRecipients).toBe(1);
    expect(customerPreferencesFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: [{ marketingZonePostalCode: "69001" }, { marketingZoneCity: { equals: "Lyon", mode: "insensitive" } }],
        }),
      }),
    );
  });

  it("e-mail réseau = prospects : exclut les clients qui possèdent déjà la carte du commerce", async () => {
    customerPreferencesFindMany.mockResolvedValueOnce([]);
    await estimateNetworkLocalAudience({ id: "m1", city: "Lyon", postalCode: "69001" }, "EMAIL");
    expect(customerPreferencesFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          user: { isActive: true, customerMemberships: { none: { merchantId: "m1", removedAt: null } } },
        }),
      }),
    );
  });

  it("notification secteur : clients avec ou sans la carte (aucune exclusion)", async () => {
    customerPreferencesFindMany.mockResolvedValueOnce([]);
    await estimateNetworkLocalAudience({ id: "m1", city: "Lyon", postalCode: "69001" }, "IN_APP_PUSH");
    expect(customerPreferencesFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ user: { isActive: true } }) }),
    );
  });
});
