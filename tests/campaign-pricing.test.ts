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

  it("payant à 500 centimes quand le quota membres est épuisé (notification)", () => {
    const result = priceMemberOrNetworkCampaign({
      channel: "IN_APP_PUSH",
      audienceType: "MERCHANT_MEMBERS",
      includedRemaining: 0,
    });
    expect(result.priceCents).toBe(500);
    expect(result.requiresPayment).toBe(true);
  });

  it("payant à 300 centimes quand le quota membres est épuisé (e-mail)", () => {
    const result = priceMemberOrNetworkCampaign({
      channel: "EMAIL",
      audienceType: "MERCHANT_MEMBERS",
      includedRemaining: 0,
    });
    expect(result.priceCents).toBe(300);
  });

  it("les campagnes réseau sont TOUJOURS payantes, même avec du quota inclus restant", () => {
    const withQuota = priceMemberOrNetworkCampaign({
      channel: "IN_APP_PUSH",
      audienceType: "NETWORK_LOCAL",
      includedRemaining: 5, // ne devrait jamais arriver (limit réseau = 0), mais même si on le force
    });
    expect(withQuota.isNetwork).toBe(true);
    expect(withQuota.requiresPayment).toBe(true);
    expect(withQuota.priceCents).toBe(1500);

    const email = priceMemberOrNetworkCampaign({
      channel: "EMAIL",
      audienceType: "NETWORK_LOCAL",
      includedRemaining: 5,
    });
    expect(email.priceCents).toBe(1200);
    expect(email.requiresPayment).toBe(true);
  });
});

describe("priceSponsoredAd", () => {
  it("entièrement couvert par le quota Insight restant", () => {
    const result = priceSponsoredAd({ days: 3, includedDaysRemaining: 3 });
    expect(result).toEqual({ priceCents: 0, requiresPayment: false, daysFromQuota: 3, daysToPay: 0 });
  });

  it("7 jours payants sans quota : 1900 centimes", () => {
    const result = priceSponsoredAd({ days: 7, includedDaysRemaining: 0 });
    expect(result.priceCents).toBe(1900);
    expect(result.daysToPay).toBe(7);
  });

  it("10 jours payants : 1900 + 3×300 = 2800 centimes", () => {
    const result = priceSponsoredAd({ days: 10, includedDaysRemaining: 0 });
    expect(result.priceCents).toBe(1900 + 3 * 300);
  });

  it("mixe quota + jours payants (2 jours de quota Insight, 5 jours à payer)", () => {
    const result = priceSponsoredAd({ days: 7, includedDaysRemaining: 2 });
    expect(result.daysFromQuota).toBe(2);
    expect(result.daysToPay).toBe(5);
    expect(result.priceCents).toBe(1900); // 5 jours restants → base 7 jours (jamais négatif/prorata inventé)
  });
});
