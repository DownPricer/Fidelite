import { beforeEach, describe, expect, it, vi } from "vitest";
import Stripe from "stripe";

const envMock = vi.hoisted(() => ({
  stripeMode: "test",
  stripeTestSecretKey: "sk_test_AAA",
  stripeTestWebhookSecret: "whsec_test_AAA",
  stripeLiveSecretKey: "sk_live_BBB",
  stripeLiveWebhookSecret: "whsec_live_BBB",
  stripeTestMerchantIds: "m_test",
  appUrl: "http://localhost:3000",
}));
vi.mock("@/lib/env", () => ({ env: envMock }));

const constructorKeys: string[] = [];
const sessionsCreate = vi.fn(async () => ({ id: "cs_1", url: "https://checkout.stripe.test/cs_1" }));
const refundsCreate = vi.fn(async () => ({ id: "re_1" }));
vi.mock("stripe", async () => {
  const actual = await vi.importActual<{ default: typeof Stripe }>("stripe");
  class FakeStripe {
    static webhooks = actual.default.webhooks;
    checkout = { sessions: { create: sessionsCreate } };
    refunds = { create: refundsCreate };
    constructor(key: string) {
      constructorKeys.push(key);
    }
  }
  return { default: FakeStripe };
});

beforeEach(() => {
  vi.resetModules();
  envMock.stripeMode = "test";
  envMock.stripeTestSecretKey = "sk_test_AAA";
  envMock.stripeTestWebhookSecret = "whsec_test_AAA";
  envMock.stripeLiveSecretKey = "sk_live_BBB";
  envMock.stripeLiveWebhookSecret = "whsec_live_BBB";
  envMock.stripeTestMerchantIds = "m_test";
  constructorKeys.length = 0;
  sessionsCreate.mockClear();
  refundsCreate.mockClear();
});

function signed(secret: string, livemode: boolean, id = "evt_1") {
  const payload = JSON.stringify({ id, object: "event", type: "checkout.session.completed", livemode, data: { object: {} } });
  const header = Stripe.webhooks.generateTestHeaderString({ payload, secret });
  return { payload, header };
}

describe("STRIPE_MODE", () => {
  it("test par défaut, live si demandé, invalide → aucun paiement possible", async () => {
    const { getActiveStripeMode, isStripeConfigured } = await import("../src/lib/stripe-mode");
    envMock.stripeMode = "";
    expect(getActiveStripeMode()).toBe("TEST");
    envMock.stripeMode = "LIVE";
    expect(getActiveStripeMode()).toBe("LIVE");
    envMock.stripeMode = "prod";
    expect(getActiveStripeMode()).toBeNull();
    expect(isStripeConfigured()).toBe(false);
  });

  it("garde-fou : une clé live dans la variable test (ou l'inverse) est refusée", async () => {
    const { stripeSecretKeyFor, isStripeConfigured } = await import("../src/lib/stripe-mode");
    envMock.stripeTestSecretKey = "sk_live_OOPS";
    expect(stripeSecretKeyFor("TEST")).toBe("");
    expect(isStripeConfigured()).toBe(false);
    envMock.stripeMode = "live";
    envMock.stripeLiveSecretKey = "sk_test_OOPS";
    expect(stripeSecretKeyFor("LIVE")).toBe("");
    expect(isStripeConfigured()).toBe(false);
  });

  it("mode actif sans secret webhook : non configuré", async () => {
    const { isStripeConfigured } = await import("../src/lib/stripe-mode");
    envMock.stripeTestWebhookSecret = "";
    expect(isStripeConfigured()).toBe(false);
  });

  it("test : seuls les commerces de STRIPE_TEST_MERCHANT_IDS peuvent payer ; réel : tous", async () => {
    const { isPaymentAllowedForMerchant } = await import("../src/lib/stripe-mode");
    expect(isPaymentAllowedForMerchant("m_test")).toBe(true);
    expect(isPaymentAllowedForMerchant("m_other")).toBe(false);
    envMock.stripeTestMerchantIds = "";
    expect(isPaymentAllowedForMerchant("m_test")).toBe(false);
    envMock.stripeMode = "live";
    expect(isPaymentAllowedForMerchant("m_other")).toBe(true);
    envMock.stripeMode = "prod";
    expect(isPaymentAllowedForMerchant("m_test")).toBe(false);
  });
});

describe("création de paiements : uniquement la clé du mode actif", () => {
  const input = {
    merchantId: "m1",
    ledgerEntryId: "led_1",
    amountCents: 1000,
    successUrl: "http://x/ok",
    cancelUrl: "http://x/ko",
  };

  it("mode test → clé test", async () => {
    const { createMarketingTopupCheckoutSession } = await import("../src/lib/stripe");
    await createMarketingTopupCheckoutSession(input);
    expect(constructorKeys).toEqual(["sk_test_AAA"]);
  });

  it("basculement en live (simple changement d'environnement) → clé live, jamais la clé test", async () => {
    const { createMarketingTopupCheckoutSession } = await import("../src/lib/stripe");
    await createMarketingTopupCheckoutSession(input);
    envMock.stripeMode = "live";
    await createMarketingTopupCheckoutSession(input);
    expect(constructorKeys).toEqual(["sk_test_AAA", "sk_live_BBB"]);
  });

  it("mode live sans clé live : StripeNotConfiguredError, la clé test n'est jamais utilisée en repli", async () => {
    const { createMarketingTopupCheckoutSession, StripeNotConfiguredError } = await import("../src/lib/stripe");
    envMock.stripeMode = "live";
    envMock.stripeLiveSecretKey = "";
    await expect(createMarketingTopupCheckoutSession(input)).rejects.toBeInstanceOf(StripeNotConfiguredError);
    expect(constructorKeys).toEqual([]);
    expect(sessionsCreate).not.toHaveBeenCalled();
  });

  it("le remboursement utilise la clé du mode du paiement d'origine, pas du mode actif", async () => {
    const { refundCampaignPayment } = await import("../src/lib/stripe");
    envMock.stripeMode = "live";
    await refundCampaignPayment("pi_1", "TEST");
    expect(constructorKeys).toEqual(["sk_test_AAA"]);
    expect(refundsCreate).toHaveBeenCalledWith({ payment_intent: "pi_1" });
  });
});

describe("webhook : signature et mode de l'événement", () => {
  it("accepte un événement test signé avec le secret test", async () => {
    const { constructStripeWebhookEvent } = await import("../src/lib/stripe");
    const { payload, header } = signed("whsec_test_AAA", false);
    expect(constructStripeWebhookEvent(payload, header).livemode).toBe(false);
  });

  it("accepte un événement live signé avec le secret live", async () => {
    const { constructStripeWebhookEvent } = await import("../src/lib/stripe");
    const { payload, header } = signed("whsec_live_BBB", true);
    expect(constructStripeWebhookEvent(payload, header).livemode).toBe(true);
  });

  it("accepte un événement test retardé alors que le mode actif est déjà live", async () => {
    const { constructStripeWebhookEvent } = await import("../src/lib/stripe");
    envMock.stripeMode = "live";
    const { payload, header } = signed("whsec_test_AAA", false, "evt_late");
    expect(constructStripeWebhookEvent(payload, header).id).toBe("evt_late");
  });

  it("rejette un événement dont livemode ne correspond pas au secret de signature", async () => {
    const { constructStripeWebhookEvent } = await import("../src/lib/stripe");
    const forgedTest = signed("whsec_test_AAA", true);
    expect(() => constructStripeWebhookEvent(forgedTest.payload, forgedTest.header)).toThrow();
    const forgedLive = signed("whsec_live_BBB", false);
    expect(() => constructStripeWebhookEvent(forgedLive.payload, forgedLive.header)).toThrow();
  });

  it("rejette une signature inconnue ou altérée", async () => {
    const { constructStripeWebhookEvent } = await import("../src/lib/stripe");
    const bad = signed("whsec_autre", false);
    expect(() => constructStripeWebhookEvent(bad.payload, bad.header)).toThrow();
    const ok = signed("whsec_test_AAA", false);
    expect(() => constructStripeWebhookEvent(ok.payload + " ", ok.header)).toThrow();
  });

  it("secret d'un mode non configuré : ses événements sont rejetés", async () => {
    const { constructStripeWebhookEvent } = await import("../src/lib/stripe");
    envMock.stripeLiveWebhookSecret = "";
    const live = signed("whsec_live_BBB", true);
    expect(() => constructStripeWebhookEvent(live.payload, live.header)).toThrow();
  });

  it("aucun secret configuré : StripeNotConfiguredError", async () => {
    const { constructStripeWebhookEvent, StripeNotConfiguredError } = await import("../src/lib/stripe");
    envMock.stripeTestWebhookSecret = "";
    envMock.stripeLiveWebhookSecret = "";
    const { payload, header } = signed("whsec_test_AAA", false);
    expect(() => constructStripeWebhookEvent(payload, header)).toThrow(StripeNotConfiguredError);
  });
});
