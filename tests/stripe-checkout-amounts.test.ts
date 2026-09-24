import { beforeEach, describe, expect, it, vi } from "vitest";

const sessionsCreate = vi.fn();

vi.mock("@/lib/env", () => ({
  env: { stripeSecretKey: "sk_test_placeholder", stripeWebhookSecret: "whsec_placeholder", appUrl: "http://localhost:3000" },
  isStripeConfigured: () => true,
}));
vi.mock("stripe", () => ({
  default: class {
    checkout = { sessions: { create: (...args: unknown[]) => sessionsCreate(...args) } };
  },
}));

beforeEach(() => {
  sessionsCreate.mockReset();
  sessionsCreate.mockResolvedValue({ id: "cs_1", url: "https://checkout.stripe.test/cs_1" });
});

type Params = {
  mode: string;
  expires_at: number;
  line_items: { price_data: { unit_amount: number; currency: string }; quantity: number }[];
  metadata: Record<string, string>;
};

describe("montants réellement envoyés à Stripe Checkout", () => {
  it("mise en avant : unit_amount × quantity = 5 € × jours (identique au prix affiché)", async () => {
    const { createCampaignCheckoutSession } = await import("../src/lib/stripe");
    const { CAMPAIGN_PRICE_CENTS } = await import("../src/lib/campaign-prices");
    const { priceSponsoredAd } = await import("../src/lib/campaign-pricing");

    for (const days of [1, 2, 7, 30]) {
      sessionsCreate.mockClear();
      const { priceCents } = priceSponsoredAd({ days, includedDaysRemaining: 0 });
      await createCampaignCheckoutSession({
        campaignId: "c1",
        merchantId: "m1",
        campaignType: "SPONSORED_AD",
        amountCents: priceCents,
        quantity: days,
        description: "Mise en avant",
        successUrl: "http://localhost:3000/ok",
        cancelUrl: "http://localhost:3000/ko",
      });
      const params = sessionsCreate.mock.calls[0][0] as Params;
      const item = params.line_items[0];
      expect(params.mode).toBe("payment");
      expect(item.price_data.currency).toBe("eur");
      expect(item.price_data.unit_amount).toBe(CAMPAIGN_PRICE_CENTS.SPONSORED_AD_PER_DAY);
      expect(item.quantity).toBe(days);
      expect(item.price_data.unit_amount * item.quantity).toBe(days * 500);
    }
  });

  it("recharge : le montant Stripe est exactement le montant validé, session qui expire sous 30 min", async () => {
    const { createMarketingTopupCheckoutSession } = await import("../src/lib/stripe");
    for (const amountCents of [500, 1000, 2000, 2550]) {
      sessionsCreate.mockClear();
      await createMarketingTopupCheckoutSession({
        merchantId: "m1",
        ledgerEntryId: "led_1",
        amountCents,
        successUrl: "http://localhost:3000/ok",
        cancelUrl: "http://localhost:3000/ko",
      });
      const params = sessionsCreate.mock.calls[0][0] as Params;
      expect(params.line_items).toEqual([expect.objectContaining({ quantity: 1, price_data: expect.objectContaining({ unit_amount: amountCents, currency: "eur" }) })]);
      expect(params.metadata).toEqual({ kind: "MARKETING_TOPUP", merchantId: "m1", ledgerEntryId: "led_1" });
      const ttl = params.expires_at - Math.floor(Date.now() / 1000);
      expect(ttl).toBeGreaterThan(29 * 60);
      expect(ttl).toBeLessThanOrEqual(30 * 60);
    }
  });

  it("les prix fixes par envoi sont ceux convenus (0,99 / 1,99 / 0,50 / 1,20 € et 5 €/jour)", async () => {
    const { CAMPAIGN_PRICE_CENTS } = await import("../src/lib/campaign-prices");
    expect(CAMPAIGN_PRICE_CENTS).toEqual({
      MEMBER_NOTIFICATION: 99,
      NETWORK_NOTIFICATION: 199,
      MEMBER_EMAIL: 50,
      NETWORK_EMAIL: 120,
      SPONSORED_AD_PER_DAY: 500,
    });
  });
});
