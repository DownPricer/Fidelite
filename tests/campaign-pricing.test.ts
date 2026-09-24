import { describe, expect, it } from "vitest";
import {
  priceMemberOrNetworkCampaign,
  priceSponsoredAd,
  quotaKindFor,
} from "../src/lib/campaign-pricing";

describe("quotaKindFor", () => {
  it("mappe canal + audience vers le bon type de quota", () => {
    expect(quotaKindFor("IN_APP_PUSH", "MERCHANT_MEMBERS")).toBe("MEMBER_NOTIFICATION");
    expect(quotaKindFor("EMAIL", "MERCHANT_MEMBERS")).toBe("MEMBER_EMAIL");
    expect(quotaKindFor("IN_APP_PUSH", "NETWORK_LOCAL")).toBe("NETWORK_NOTIFICATION");
    expect(quotaKindFor("EMAIL", "NETWORK_LOCAL")).toBe("NETWORK_EMAIL");
    expect(quotaKindFor("SPONSORED_AD", null)).toBe("SPONSORED_DAY");
  });
});

describe("priceMemberOrNetworkCampaign", () => {
  it("gratuit quand il reste du quota inclus (membres)", () => {
    const result = priceMemberOrNetworkCampaign({
      channel: "IN_APP_PUSH",
      audienceType: "MERCHANT_MEMBERS",
      includedRemaining: 1,
    });
    expect(result).toEqual({
      quotaKind: "MEMBER_NOTIFICATION",
      isNetwork: false,
      priceCents: 0,
      requiresPayment: false,
    });
  });

  it("payant à 99 centimes quand le quota membres est épuisé (notification)", () => {
    const result = priceMemberOrNetworkCampaign({
      channel: "IN_APP_PUSH",
      audienceType: "MERCHANT_MEMBERS",
      includedRemaining: 0,
    });
    expect(result.priceCents).toBe(99);
    expect(result.requiresPayment).toBe(true);
  });

  it("payant à 50 centimes quand le quota membres est épuisé (e-mail)", () => {
    const result = priceMemberOrNetworkCampaign({
      channel: "EMAIL",
      audienceType: "MERCHANT_MEMBERS",
      includedRemaining: 0,
    });
    expect(result.priceCents).toBe(50);
  });

  it("les campagnes réseau sont TOUJOURS payantes, même avec du quota inclus restant", () => {
    const withQuota = priceMemberOrNetworkCampaign({
      channel: "IN_APP_PUSH",
      audienceType: "NETWORK_LOCAL",
      includedRemaining: 5, // ne devrait jamais arriver (limit réseau = 0), mais même si on le force
    });
    expect(withQuota.isNetwork).toBe(true);
    expect(withQuota.requiresPayment).toBe(true);
    expect(withQuota.priceCents).toBe(199);

    const email = priceMemberOrNetworkCampaign({
      channel: "EMAIL",
      audienceType: "NETWORK_LOCAL",
      includedRemaining: 5,
    });
    expect(email.priceCents).toBe(120);
    expect(email.requiresPayment).toBe(true);
  });
});

describe("priceSponsoredAd", () => {
  it("entièrement couvert par le quota Insight restant", () => {
    expect(priceSponsoredAd({ days: 3, includedDaysRemaining: 3 })).toEqual({
      priceCents: 0,
      requiresPayment: false,
      days: 3,
    });
  });

  it("5 € par jour, sans quota", () => {
    expect(priceSponsoredAd({ days: 1, includedDaysRemaining: 0 }).priceCents).toBe(500);
    expect(priceSponsoredAd({ days: 7, includedDaysRemaining: 0 }).priceCents).toBe(3500);
    expect(priceSponsoredAd({ days: 10, includedDaysRemaining: 0 }).priceCents).toBe(5000);
  });

  it("quota partiel : toute la durée est payante (pas de consommation partielle du quota)", () => {
    const result = priceSponsoredAd({ days: 7, includedDaysRemaining: 2 });
    expect(result).toEqual({ priceCents: 3500, requiresPayment: true, days: 7 });
  });

  it("durée invalide ramenée à au moins 1 jour", () => {
    expect(priceSponsoredAd({ days: 0, includedDaysRemaining: 0 }).priceCents).toBe(500);
  });
});
