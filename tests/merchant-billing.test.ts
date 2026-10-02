import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeAdDb } from "./helpers/fake-ad-db";

/** Réglages et facturation : accès par commerce, transactions, factures, arrêt d'abonnement, config des paiements ponctuels. */

const h = vi.hoisted(() => ({
  merchant: "m1" as string | null,
  stripe: {
    invoicesByCustomer: {} as Record<string, unknown[]>,
    receipts: {} as Record<string, string>,
    retrieve: vi.fn(),
    schedule: vi.fn(),
    listCalls: [] as string[],
  },
}));
const fake = createFakeAdDb();
const { tables } = fake;

vi.mock("@/lib/prisma", () => ({ prisma: fake.prisma }));
vi.mock("@/lib/audit", () => ({ writeAudit: vi.fn() }));
vi.mock("@/lib/env", () => ({ env: { appUrl: "http://localhost:3000" } }));
vi.mock("@/lib/api-guard", () => ({
  requireMutatingRequest: async () => ({ error: null }),
  requireMerchantAdmin: async () =>
    h.merchant ? { error: null, user: { id: `u_${h.merchant}` }, membership: { merchantId: h.merchant } } : { error: new Response(null, { status: 403 }) },
}));
vi.mock("@/lib/stripe-mode", () => ({ getActiveStripeMode: () => "TEST" }));
vi.mock("@/lib/stripe", async () => {
  const actual = await vi.importActual<typeof import("../src/lib/stripe")>("../src/lib/stripe");
  return {
    ...actual,
    canReadStripeMode: () => true,
    listStripeInvoices: async (customerId: string, mode: string) => {
      h.stripe.listCalls.push(customerId);
      return (h.stripe.invoicesByCustomer[customerId] ?? []).map((i) => ({ ...(i as object), mode }));
    },
    receiptUrlForPaymentIntent: async (pi: string) => h.stripe.receipts[pi] ?? null,
    retrieveStripeSubscription: (...args: unknown[]) => h.stripe.retrieve(...args),
    scheduleStripeSubscriptionCancellation: (...args: unknown[]) => h.stripe.schedule(...args),
    createBillingPortalSession: async () => ({ url: "https://billing.stripe.test/p" }),
  };
});

const ctxReq = (path: string, method = "GET", body?: unknown) =>
  new Request(`http://localhost:3000${path}`, {
    method,
    headers: { "Content-Type": "application/json", origin: "http://localhost:3000" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

const PERIOD_END = new Date("2026-11-01T00:00:00.000Z");

function seedSubscription(merchantId: string, overrides: Record<string, unknown> = {}) {
  tables.merchantSubscription.push({
    id: `sub_${merchantId}`, merchantId, plan: "PRO", amount: 49, currency: "EUR", frequency: "MONTHLY", status: "ACTIVE",
    trialEndsAt: null, startsAt: new Date("2026-06-01"), endsAt: null, nextBillingAt: PERIOD_END, cancelledAt: null, autoRenew: true,
    insightEnabled: true, stripeSubscriptionId: null, stripeMode: null, cancelAtPeriodEnd: false, cancelEffectiveAt: null, cancelRequestedAt: null,
    ...overrides,
  });
}

function invoice(id: string, extra: Record<string, unknown> = {}) {
  return { id, number: `FID-${id}`, date: "2026-10-01T10:00:00.000Z", totalCents: 4900, currency: "EUR", status: "paid", kind: "SUBSCRIPTION", description: "Abonnement Pro", hostedUrl: `https://invoice.stripe.test/${id}`, pdfUrl: `https://pdf.stripe.test/${id}.pdf`, ...extra };
}

beforeEach(() => {
  for (const key of Object.keys(tables)) tables[key].length = 0;
  h.merchant = "m1";
  h.stripe.invoicesByCustomer = {};
  h.stripe.receipts = {};
  h.stripe.listCalls = [];
  h.stripe.retrieve.mockReset();
  h.stripe.schedule.mockReset();
  tables.merchantStripeCustomer.push(
    { id: "c1", merchantId: "m1", mode: "TEST", stripeCustomerId: "cus_m1" },
    { id: "c2", merchantId: "m2", mode: "TEST", stripeCustomerId: "cus_m2" },
  );
});

/* ------------------------------------------------------------------------------------------ */
describe("accès : chaque commerce ne voit que ses factures, ses transactions et son abonnement", () => {
  it("les factures viennent uniquement du client Stripe du commerce connecté", async () => {
    h.stripe.invoicesByCustomer = { cus_m1: [invoice("in_1"), invoice("in_2", { kind: "ONE_OFF", description: "Recharge du solde marketing Fideto" })], cus_m2: [invoice("in_other")] };
    const { GET } = await import("../src/app/api/merchant/facturation/factures/route");
    const asM1 = (await (await GET(ctxReq("/api/merchant/facturation/factures"))).json()) as { invoices: { id: string }[] };
    expect(asM1.invoices.map((i) => i.id).sort()).toEqual(["in_1", "in_2"]);
    expect(h.stripe.listCalls).toEqual(["cus_m1"]); // jamais cus_m2

    h.merchant = "m2";
    h.stripe.listCalls = [];
    const asM2 = (await (await GET(ctxReq("/api/merchant/facturation/factures"))).json()) as { invoices: { id: string }[] };
    expect(asM2.invoices.map((i) => i.id)).toEqual(["in_other"]);
    expect(h.stripe.listCalls).toEqual(["cus_m2"]);
  });

  it("aucun paramètre du navigateur ne peut désigner un autre commerce ou client Stripe", async () => {
    h.stripe.invoicesByCustomer = { cus_m1: [invoice("in_1")], cus_m2: [invoice("in_other")] };
    const { GET } = await import("../src/app/api/merchant/facturation/factures/route");
    const response = await GET(ctxReq("/api/merchant/facturation/factures?merchantId=m2&customer=cus_m2"));
    expect(((await response.json()) as { invoices: { id: string }[] }).invoices.map((i) => i.id)).toEqual(["in_1"]);
  });

  it("sans session administrateur : refus, et aucune donnée Stripe n'est lue", async () => {
    h.merchant = null;
    const { GET } = await import("../src/app/api/merchant/facturation/factures/route");
    expect((await GET(ctxReq("/api/merchant/facturation/factures"))).status).toBe(403);
    const { GET: overview } = await import("../src/app/api/merchant/facturation/route");
    expect((await overview(ctxReq("/api/merchant/facturation"))).status).toBe(403);
    expect(h.stripe.listCalls).toEqual([]);
  });

  it("commerce sans client Stripe (aucun paiement encore) : liste vide, pas d'invention de facture", async () => {
    tables.merchantStripeCustomer.length = 0;
    const { GET } = await import("../src/app/api/merchant/facturation/factures/route");
    expect(await (await GET(ctxReq("/api/merchant/facturation/factures"))).json()).toEqual({ invoices: [], unavailable: [] });
  });
});

/* ------------------------------------------------------------------------------------------ */
describe("transactions : encaissé Stripe ≠ débit du solde, reçu ≠ facture, test ≠ réel", () => {
  it("distingue clairement paiement encaissé, recharge, débit du solde et restitution — uniquement ceux du commerce", async () => {
    const t = (n: number) => new Date(2026, 9, n);
    tables.campaign.push({ id: "camp1", title: "Promo week-end", body: "x", channel: "SPONSORED_AD" });
    tables.campaignPayment.push({ id: "p1", merchantId: "m1", campaignId: "camp1", amountCents: 1500, mode: "LIVE", status: "PAID", paidAt: t(5), createdAt: t(5), stripePaymentIntentId: "pi_pay" });
    tables.campaignPayment.push({ id: "p2", merchantId: "m1", campaignId: "camp1", amountCents: 500, mode: "TEST", status: "PENDING", paidAt: null, createdAt: t(6), stripePaymentIntentId: null });
    tables.campaignPayment.push({ id: "p3", merchantId: "m2", campaignId: "camp1", amountCents: 999, mode: "LIVE", status: "PAID", paidAt: t(5), createdAt: t(5), stripePaymentIntentId: "pi_other" });
    tables.marketingLedgerEntry.push(
      { id: "l1", merchantId: "m1", mode: "LIVE", type: "TOPUP", status: "PAID", amountCents: 2000, description: "Recharge", createdAt: t(2), stripePaymentIntentId: "pi_topup" },
      { id: "l2", merchantId: "m1", mode: "LIVE", type: "DEBIT", status: "PAID", amountCents: 700, description: "Envoi — Offre du jour", createdAt: t(3), stripePaymentIntentId: null },
      { id: "l3", merchantId: "m1", mode: "LIVE", type: "REFUND", status: "PAID", amountCents: 700, description: "Annulation", createdAt: t(4), stripePaymentIntentId: null },
      { id: "l4", merchantId: "m2", mode: "LIVE", type: "TOPUP", status: "PAID", amountCents: 5000, description: "Recharge", createdAt: t(3), stripePaymentIntentId: "pi_m2" },
    );
    h.stripe.receipts = { pi_pay: "https://receipt.stripe.test/pay", pi_topup: "https://receipt.stripe.test/topup", pi_other: "https://receipt.stripe.test/other" };

    const { GET } = await import("../src/app/api/merchant/facturation/route");
    const { transactions } = (await (await GET(ctxReq("/api/merchant/facturation"))).json()) as {
      transactions: { id: string; kind: string; collectedByStripe: boolean; mode: string; receiptUrl: string | null; status: string; label: string }[];
    };
    const byKind = Object.fromEntries(transactions.map((x) => [x.id, x]));
    expect(transactions).toHaveLength(5); // 2 paiements + 3 écritures du solde de m1 (rien de m2)
    expect(transactions.map((x) => x.id)).not.toContain("pay_p3");
    expect(transactions.map((x) => x.id)).not.toContain("led_l4");

    expect(byKind.pay_p1).toMatchObject({ kind: "STRIPE_PAYMENT", collectedByStripe: true, mode: "LIVE", receiptUrl: "https://receipt.stripe.test/pay" });
    expect(byKind.pay_p2).toMatchObject({ collectedByStripe: false, mode: "TEST", status: "PENDING", receiptUrl: null });
    expect(byKind.led_l1).toMatchObject({ kind: "TOPUP", collectedByStripe: true, receiptUrl: "https://receipt.stripe.test/topup" });
    // Un débit du solde n'est PAS un paiement encaissé et n'a ni reçu ni facture.
    expect(byKind.led_l2).toMatchObject({ kind: "BALANCE_DEBIT", collectedByStripe: false, receiptUrl: null });
    expect(byKind.led_l3).toMatchObject({ kind: "REFUND", collectedByStripe: false });
    // Ordre chronologique décroissant.
    expect(transactions.map((x) => x.id)).toEqual(["pay_p2", "pay_p1", "led_l3", "led_l2", "led_l1"]);
    // Jamais présenté comme facture : aucun champ de facture sur une transaction.
    for (const row of transactions) expect(Object.keys(row)).not.toContain("pdfUrl");
  });

  it("le libellé de l'interface distingue « Reçu » de « Facture » et « Encaissé » du solde", async () => {
    const { readFileSync } = await import("fs");
    const ui = readFileSync("src/app/app/outils/facturation/ui.tsx", "utf8");
    expect(ui).toContain("Reçu");
    expect(ui).toContain("Solde marketing — pas un paiement");
    expect(ui).toContain("Encaissé (Stripe)");
    expect(ui).toContain("Un reçu Stripe n&apos;est pas une facture");
    // Les lignes de transaction n'affichent jamais « Facture » : seule la section Factures le fait.
    const txSection = ui.slice(ui.indexOf('aria-label="Transactions"'));
    expect(txSection).not.toMatch(/>\s*Facture\b/);
  });

  it("abonnement : prix réellement souscrit, essai, échéance et source ; aucun montant TTC/TVA inventé", async () => {
    seedSubscription("m1", { amount: 39.9, status: "TRIAL", trialEndsAt: new Date("2026-10-20T00:00:00.000Z") });
    const { GET } = await import("../src/app/api/merchant/facturation/route");
    const { subscription } = (await (await GET(ctxReq("/api/merchant/facturation"))).json()) as { subscription: Record<string, unknown> };
    expect(subscription).toMatchObject({ exists: true, planLabel: "Pro", amount: 39.9, currency: "EUR", frequency: "MONTHLY", statusLabel: "Période d'essai", insightEnabled: true, source: "MANUAL", canCancel: true });
    expect(subscription.trialEndsAt).toBe("2026-10-20T00:00:00.000Z");
    expect(JSON.stringify(subscription)).not.toMatch(/tva|ttc|tax/i);
  });
});

/* ------------------------------------------------------------------------------------------ */
describe("arrêt de l'abonnement", () => {
  async function preview() {
    const { GET } = await import("../src/app/api/merchant/facturation/abonnement/arret/route");
    const response = await GET(ctxReq("/api/merchant/facturation/abonnement/arret"));
    return { status: response.status, body: (await response.json()) as { effectiveAt?: string; error?: string; code?: string } };
  }
  async function confirm(effectiveAt: string) {
    const { POST } = await import("../src/app/api/merchant/facturation/abonnement/arret/route");
    const response = await POST(ctxReq("/api/merchant/facturation/abonnement/arret", "POST", { effectiveAt }));
    return { status: response.status, body: (await response.json()) as { error?: string; code?: string } };
  }
  const sub = (merchantId = "m1") => tables.merchantSubscription.find((s) => s.merchantId === merchantId)!;

  it("abonnement géré manuellement : arrêt programmé à la fin de la période, statut inchangé, aucune donnée supprimée", async () => {
    seedSubscription("m1");
    seedSubscription("m2", { nextBillingAt: new Date("2026-12-01") });
    tables.campaign.push({ id: "camp1", title: "garde-moi" });
    const p = await preview();
    expect(p.status).toBe(200);
    expect(p.body.effectiveAt).toBe(PERIOD_END.toISOString());

    const done = await confirm(p.body.effectiveAt!);
    expect(done.status).toBe(200);
    expect(sub()).toMatchObject({ cancelAtPeriodEnd: true, autoRenew: false, status: "ACTIVE" }); // toujours actif jusqu'à l'échéance
    expect((sub().cancelEffectiveAt as Date).toISOString()).toBe(PERIOD_END.toISOString());
    expect(sub().cancelRequestedAt).toBeInstanceOf(Date);
    // Pas de suppression de compte ni de données, et l'abonnement d'un autre commerce n'est pas touché.
    expect(tables.campaign).toHaveLength(1);
    expect(sub("m2")).toMatchObject({ cancelAtPeriodEnd: false, status: "ACTIVE" });
    expect(tables.staffNotification.map((n) => n.kind)).toContain("SUBSCRIPTION_CANCEL_SCHEDULED");
    // L'interface affichera « Arrêt prévu le… » : la vue le porte.
    const { GET } = await import("../src/app/api/merchant/facturation/route");
    const { subscription } = (await (await GET(ctxReq("/api/merchant/facturation"))).json()) as { subscription: Record<string, unknown> };
    expect(subscription).toMatchObject({ cancelAtPeriodEnd: true, canCancel: false, cancelEffectiveAt: PERIOD_END.toISOString() });
  });

  it("empêche la double demande (double clic, deux onglets) et une date obsolète", async () => {
    seedSubscription("m1");
    const effectiveAt = PERIOD_END.toISOString();
    const results = await Promise.all([confirm(effectiveAt), confirm(effectiveAt), confirm(effectiveAt)]);
    expect(results.filter((r) => r.status === 200)).toHaveLength(1);
    expect(results.filter((r) => r.status === 409)).toHaveLength(2);
    expect(tables.staffNotification.filter((n) => n.kind === "SUBSCRIPTION_CANCEL_SCHEDULED")).toHaveLength(1);
    expect((await confirm(effectiveAt)).body.code).toBe("ALREADY_REQUESTED");
    expect((await preview()).body.code).toBeUndefined(); // l'écran peut toujours afficher la date

    sub().cancelAtPeriodEnd = false;
    sub().cancelEffectiveAt = null;
    const stale = await confirm("2026-01-01T00:00:00.000Z");
    expect(stale.status).toBe(409);
    expect(stale.body.code).toBe("STALE_DATE");
  });

  it("sans date de fin de période connue : on n'invente rien, l'arrêt est refusé", async () => {
    seedSubscription("m1", { nextBillingAt: null, endsAt: null });
    const p = await preview();
    expect(p.status).toBe(409);
    expect(p.body.code).toBe("NO_PERIOD_END");
    const { GET } = await import("../src/app/api/merchant/facturation/route");
    const { subscription } = (await (await GET(ctxReq("/api/merchant/facturation"))).json()) as { subscription: { canCancel: boolean; cancelBlockedReason: string } };
    expect(subscription.canCancel).toBe(false);
    expect(subscription.cancelBlockedReason).toMatch(/date de fin/);
  });

  it("abonnement Stripe lié : Stripe programme l'arrêt (cancel_at_period_end) et reste la source de vérité resynchronisée", async () => {
    seedSubscription("m1", { stripeSubscriptionId: "sub_stripe_1", stripeMode: "TEST" });
    const stripeEnd = new Date("2026-11-03T00:00:00.000Z");
    h.stripe.retrieve.mockResolvedValue({ id: "sub_stripe_1", customerId: "cus_m1", status: "active", cancelAtPeriodEnd: false, currentPeriodEnd: stripeEnd, cancelAt: null });
    h.stripe.schedule.mockResolvedValue({ id: "sub_stripe_1", customerId: "cus_m1", status: "active", cancelAtPeriodEnd: true, currentPeriodEnd: stripeEnd, cancelAt: stripeEnd });

    const done = await confirm(PERIOD_END.toISOString());
    expect(done.status).toBe(200);
    expect(h.stripe.schedule).toHaveBeenCalledTimes(1);
    expect(h.stripe.schedule).toHaveBeenCalledWith("sub_stripe_1", "TEST");
    // Resynchronisé depuis Stripe : la date effective est celle de Stripe.
    expect(sub()).toMatchObject({ cancelAtPeriodEnd: true, status: "ACTIVE", autoRenew: false });
    expect((sub().cancelEffectiveAt as Date).toISOString()).toBe(stripeEnd.toISOString());
    // Une seconde demande ne rappelle pas Stripe.
    expect((await confirm(stripeEnd.toISOString())).status).toBe(409);
    expect(h.stripe.schedule).toHaveBeenCalledTimes(1);
  });

  it("abonnement Stripe d'un autre commerce, ou Stripe en échec : rien n'est programmé et la demande est annulée", async () => {
    seedSubscription("m1", { stripeSubscriptionId: "sub_stripe_1", stripeMode: "TEST" });
    h.stripe.retrieve.mockResolvedValue({ id: "sub_stripe_1", customerId: "cus_m2", status: "active", cancelAtPeriodEnd: false, currentPeriodEnd: PERIOD_END, cancelAt: null });
    const mismatch = await confirm(PERIOD_END.toISOString());
    expect(mismatch.status).toBe(403);
    expect(h.stripe.schedule).not.toHaveBeenCalled();
    expect(sub()).toMatchObject({ cancelAtPeriodEnd: false, autoRenew: true, cancelEffectiveAt: null });

    h.stripe.retrieve.mockResolvedValue({ id: "sub_stripe_1", customerId: "cus_m1", status: "active", cancelAtPeriodEnd: false, currentPeriodEnd: PERIOD_END, cancelAt: null });
    h.stripe.schedule.mockRejectedValue(new Error("stripe down"));
    const failed = await confirm(PERIOD_END.toISOString());
    expect(failed.status).toBe(502);
    expect(sub()).toMatchObject({ cancelAtPeriodEnd: false, cancelRequestedAt: null });
    // Après l'échec, l'utilisateur peut réessayer.
    h.stripe.schedule.mockResolvedValue({ id: "sub_stripe_1", customerId: "cus_m1", status: "active", cancelAtPeriodEnd: true, currentPeriodEnd: PERIOD_END, cancelAt: PERIOD_END });
    expect((await confirm(PERIOD_END.toISOString())).status).toBe(200);
  });

  it("le webhook Stripe resynchronise le statut (arrêt programmé, puis fin effective)", async () => {
    seedSubscription("m1", { stripeSubscriptionId: "sub_stripe_1", stripeMode: "TEST" });
    const { syncSubscriptionFromStripeView, mapStripeSubscriptionStatus } = await import("../src/lib/merchant-billing");
    expect(mapStripeSubscriptionStatus("trialing")).toBe("TRIAL");
    expect(mapStripeSubscriptionStatus("past_due")).toBe("PAST_DUE");
    expect(mapStripeSubscriptionStatus("canceled")).toBe("CANCELLED");

    await syncSubscriptionFromStripeView({ id: "sub_stripe_1", customerId: "cus_m1", status: "active", cancelAtPeriodEnd: true, currentPeriodEnd: PERIOD_END, cancelAt: PERIOD_END });
    expect(sub()).toMatchObject({ status: "ACTIVE", cancelAtPeriodEnd: true });
    await syncSubscriptionFromStripeView({ id: "sub_stripe_1", customerId: "cus_m1", status: "canceled", cancelAtPeriodEnd: false, currentPeriodEnd: PERIOD_END, cancelAt: null });
    expect(sub()).toMatchObject({ status: "CANCELLED" });
    expect(await syncSubscriptionFromStripeView({ id: "sub_inconnu", customerId: null, status: "active", cancelAtPeriodEnd: false, currentPeriodEnd: null, cancelAt: null })).toBeNull();
  });

  it("portail Stripe : seulement pour le client Stripe du commerce, message clair s'il n'existe pas encore", async () => {
    const { POST } = await import("../src/app/api/merchant/facturation/portail/route");
    const ok = await POST(ctxReq("/api/merchant/facturation/portail", "POST", {}));
    expect(await ok.json()).toEqual({ url: "https://billing.stripe.test/p" });
    tables.merchantStripeCustomer.length = 0;
    const none = await POST(ctxReq("/api/merchant/facturation/portail", "POST", {}));
    expect(none.status).toBe(409);
  });
});
