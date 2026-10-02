import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeAdDb } from "./helpers/fake-ad-db";

/** Paiements ponctuels (campagne, recharge) : client Stripe du commerce + facture générée par Stripe, sans TVA inventée. */

const fake = createFakeAdDb();
const created: Record<string, unknown>[] = [];

vi.mock("@/lib/prisma", () => ({ prisma: fake.prisma }));
vi.mock("@/lib/env", () => ({
  env: { stripeMode: "test", stripeTestSecretKey: "sk_test_x", stripeTestWebhookSecret: "whsec_x", stripeLiveSecretKey: "", stripeLiveWebhookSecret: "", stripeTestMerchantIds: "", appUrl: "http://localhost:3000" },
}));
vi.mock("stripe", () => ({
  default: class {
    customers = { create: async (params: Record<string, unknown>) => ({ id: "cus_new", ...params }) };
    checkout = { sessions: { create: async (params: Record<string, unknown>) => (created.push(params), { id: "cs_1", url: "https://x" }) } };
  },
}));

beforeEach(() => {
  created.length = 0;
  fake.tables.merchantStripeCustomer.length = 0;
});

describe("configuration de facturation des paiements ponctuels Stripe", () => {
  it("campagne et recharge : rattachés au client Stripe du commerce, facture générée par Stripe, aucune TVA inventée", async () => {
    const { createCampaignCheckoutSession, createMarketingTopupCheckoutSession } = await import("../src/lib/stripe");

    await createCampaignCheckoutSession({
      campaignId: "camp1", merchantId: "m1", campaignType: "SPONSORED_AD", amountCents: 1500, description: "Mise en avant Fideto — 1 jour",
      successUrl: "http://x/ok", cancelUrl: "http://x/ko", customer: { name: "Boulangerie Soleil", email: "pro@soleil.fr" },
    });
    await createMarketingTopupCheckoutSession({ merchantId: "m1", ledgerEntryId: "led1", amountCents: 2000, successUrl: "http://x/ok", cancelUrl: "http://x/ko", customer: { name: "Boulangerie Soleil" } });

    expect(created).toHaveLength(2);
    for (const params of created) {
      expect(params.customer).toBe("cus_new");
      expect(params.invoice_creation).toMatchObject({ enabled: true });
      expect(JSON.stringify(params)).not.toMatch(/automatic_tax|tax_rates|tax_behavior/);
    }
    expect((created[0].invoice_creation as { invoice_data: { description: string; metadata: Record<string, string> } }).invoice_data).toMatchObject({
      description: "Mise en avant Fideto — 1 jour",
      metadata: { campaignId: "camp1", merchantId: "m1" },
    });
    // Un seul client Stripe créé, mémorisé pour ce commerce et ce mode, réutilisé au paiement suivant.
    expect(fake.tables.merchantStripeCustomer).toEqual([expect.objectContaining({ merchantId: "m1", mode: "TEST", stripeCustomerId: "cus_new" })]);
  });

  it("sans identité de facturation fournie : Stripe crée quand même le client pour pouvoir facturer", async () => {
    const { createMarketingTopupCheckoutSession } = await import("../src/lib/stripe");
    await createMarketingTopupCheckoutSession({ merchantId: "m1", ledgerEntryId: "led2", amountCents: 500, successUrl: "http://x/ok", cancelUrl: "http://x/ko" });
    expect(created[0]).toMatchObject({ customer_creation: "always", invoice_creation: { enabled: true } });
    expect(created[0].customer).toBeUndefined();
  });
});
