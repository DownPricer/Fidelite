import { mkdtempSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import sharp from "sharp";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import {
  MIN_HOURS_PER_DAY,
  elapsedHoursCount,
  isDaySelectable,
  selectableHoursForDay,
  todayParisDate,
  validateSponsoredSchedule,
} from "../src/lib/sponsored-hours-pricing";
import { createFakeAdDb, merchantInfo } from "./helpers/fake-ad-db";

/**
 * Correctifs campagnes : (1) choix solde / Stripe sans double paiement, (2) diffusion réelle vs test et
 * diagnostic, (4) dates et heures passées (Europe/Paris, client et serveur). La croix de fermeture (3)
 * et les impressions visibles sont testées côté composant (tests/sponsored-slot.test.tsx).
 */

const h = vi.hoisted(() => ({
  uploads: "",
  session: { merchant: "m1" as string | null, admin: false, customer: null as string | null },
  stripeMode: "LIVE" as "TEST" | "LIVE",
  tier: "normal",
  stripeConfigured: true,
}));
const fake = createFakeAdDb();
const { tables } = fake;

vi.mock("@/lib/media-storage", () => ({ getUploadsRoot: () => h.uploads }));
vi.mock("@/lib/prisma", () => ({ prisma: fake.prisma }));
vi.mock("@/lib/audit", () => ({ writeAudit: vi.fn() }));
vi.mock("@/lib/env", () => ({ env: { appUrl: "http://localhost:3000" } }));
vi.mock("@/lib/api-guard", () => ({
  requireMutatingRequest: async () => ({ error: null }),
  requireUser: async () =>
    h.session.customer ? { error: null, user: { id: h.session.customer } } : { error: new Response(null, { status: 401 }), user: null },
  requireSuperAdmin: async () => (h.session.admin ? { error: null, user: { id: "admin_1" } } : { error: new Response(null, { status: 401 }), user: null }),
  requireMerchantAdmin: async (_r: Request, merchantId?: string) =>
    !h.session.merchant || (merchantId && merchantId !== h.session.merchant)
      ? { error: new Response(null, { status: 403 }) }
      : { error: null, user: { id: "user_m1" }, membership: { merchantId: h.session.merchant } },
}));
vi.mock("@/lib/stripe-mode", () => ({
  getActiveStripeMode: () => h.stripeMode,
  isPaymentAllowedForMerchant: () => true,
  isStripeConfigured: () => h.stripeConfigured,
}));
vi.mock("@/lib/stripe", () => ({
  StripeNotConfiguredError: class extends Error {},
  createCampaignCheckoutSession: async () => ({ id: `cs_${Math.random()}`, url: "https://checkout.stripe.test/cs" }),
  constructStripeWebhookEvent: (payload: string) => JSON.parse(payload),
}));
vi.mock("@/lib/campaign-quota", async () => {
  const actual = await vi.importActual<typeof import("../src/lib/campaign-quota")>("../src/lib/campaign-quota");
  return { ...actual, getQuotaUsage: async () => 0, resolvePlanTier: async () => h.tier };
});

const jsonReq = (path: string, method: string, body?: unknown) =>
  new Request(`http://localhost:3000${path}`, {
    method,
    headers: { "Content-Type": "application/json", origin: "http://localhost:3000" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
const ctx = (id: string) => ({ params: Promise.resolve({ id }) });
const asMerchant = () => (h.session = { merchant: "m1", admin: false, customer: null });
const asAdmin = () => (h.session = { merchant: null, admin: true, customer: null });
const asCustomer = (id = "c1") => (h.session = { merchant: null, admin: false, customer: id });

async function dataUrl(w: number, hh: number) {
  const buf = await sharp({ create: { width: w, height: hh, channels: 3, background: "#cc3355" } }).png().toBuffer();
  return `data:image/png;base64,${buf.toString("base64")}`;
}

function futureSchedule(hours = [10, 11, 12]) {
  return [{ date: new Date(Date.now() + 3 * 86_400_000).toISOString().slice(0, 10), hours }];
}

/** Crée une mise en avant approuvée (prête à payer) pour le commerce m1. */
async function approvedAd(opts: { schedule?: { date: string; hours: number[] }[] } = {}) {
  asMerchant();
  const { POST: stage } = await import("../src/app/api/merchant/visuels/televerser/route");
  const staged = (await (await stage(jsonReq("/api/merchant/visuels/televerser", "POST", { dataUrl: await dataUrl(800, 800), kind: "banniere" }))).json()) as { url: string };
  const { POST } = await import("../src/app/api/merchant/ads/route");
  const created = (await (
    await POST(jsonReq("/api/merchant/ads", "POST", { requestedText: "Pain frais", visualMode: "SELF", requestedImageUrl: staged.url, hourlySchedule: opts.schedule ?? futureSchedule() }))
  ).json()) as { adRequest: { id: string }; campaign: { id: string } };
  asAdmin();
  const { PATCH } = await import("../src/app/api/super-admin/visuels/[id]/route");
  expect((await PATCH(jsonReq(`/api/super-admin/visuels/${created.adRequest.id}`, "PATCH", { action: "approve" }), ctx(created.adRequest.id))).status).toBe(200);
  asMerchant();
  return { adId: created.adRequest.id, campaignId: created.campaign.id };
}

async function preview(adId: string) {
  const { GET } = await import("../src/app/api/merchant/visuels/[id]/paiement/route");
  return (await (await GET(jsonReq(`/api/merchant/visuels/${adId}/paiement`, "GET"), ctx(adId))).json()) as Record<string, unknown>;
}

async function pay(adId: string, method?: "BALANCE" | "STRIPE") {
  const { POST } = await import("../src/app/api/merchant/visuels/[id]/paiement/route");
  const response = await POST(jsonReq(`/api/merchant/visuels/${adId}/paiement`, "POST", method ? { method } : {}), ctx(adId));
  return { status: response.status, body: (await response.json()) as Record<string, unknown> };
}

const ad = (id: string) => tables.adRequest.find((a) => a.id === id)!;
const balanceOf = (mode = "LIVE") => (tables.marketingBalance.find((b) => b.merchantId === "m1" && b.mode === mode)?.balanceCents as number | undefined) ?? 0;
const setBalance = (cents: number, mode = "LIVE") => {
  tables.marketingBalance.length = 0;
  tables.marketingBalance.push({ id: "bal1", merchantId: "m1", mode, balanceCents: cents });
};

beforeEach(() => {
  vi.useRealTimers();
  h.uploads = mkdtempSync(join(tmpdir(), "fideto-fixes-"));
  for (const key of Object.keys(tables)) tables[key].length = 0;
  h.stripeMode = "LIVE";
  h.tier = "normal";
  h.stripeConfigured = true;
  Object.assign(merchantInfo, { city: "Lyon", postalCode: "69001", isActive: true, status: "ACTIVE" });
  tables.user.push({ id: "c1", isActive: true }, { id: "admin_1", firstName: "Super", isActive: true });
  tables.customerPreferences.push({ id: "p1", userId: "c1", notifyFifeLifeNews: true, marketingZoneCity: "Lyon", marketingZonePostalCode: "69001" });
  asMerchant();
});

afterAll(() => rmSync(h.uploads, { recursive: true, force: true }));

/* ------------------------------------------------------------------------------------------ */
describe("1. choix du paiement : solde marketing ou Stripe", () => {
  it("l'aperçu affiche le montant, le solde disponible et si le solde suffit — sans rien débiter", async () => {
    const { adId } = await approvedAd();
    setBalance(1000);
    const p = await preview(adId);
    expect(p).toMatchObject({ requiresPayment: true, priceCents: 1500, balanceCents: 1000, balanceSufficient: false, stripeAvailable: true, simulated: false });
    setBalance(5000);
    expect(await preview(adId)).toMatchObject({ balanceSufficient: true });
    expect(balanceOf()).toBe(5000);
    expect(ad(adId).status).toBe("APPROVED");
  });

  it("solde suffisant : débit atomique du montant exact, campagne programmée, aucun paiement Stripe", async () => {
    const { adId, campaignId } = await approvedAd();
    setBalance(5000);
    const result = await pay(adId, "BALANCE");
    expect(result.status).toBe(200);
    expect(result.body).toMatchObject({ method: "BALANCE", amountCents: 1500, balanceAfterCents: 3500 });
    expect(balanceOf()).toBe(3500);
    expect(ad(adId)).toMatchObject({ status: "SCHEDULED", fundingMode: "LIVE" });
    expect(tables.marketingLedgerEntry).toEqual([expect.objectContaining({ type: "DEBIT", status: "PAID", amountCents: 1500, campaignId })]);
    expect(tables.campaignPayment).toHaveLength(0); // aucune session Stripe
    expect(tables.staffNotification.map((n) => n.kind)).toContain("CAMPAIGN_SCHEDULED");
  });

  it("solde insuffisant : 402, rien n'est débité ni programmé ; le paiement direct reste possible", async () => {
    const { adId } = await approvedAd();
    setBalance(500);
    const result = await pay(adId, "BALANCE");
    expect(result.status).toBe(402);
    expect(result.body).toMatchObject({ code: "INSUFFICIENT_BALANCE", balanceCents: 500, requiredCents: 1500 });
    expect(balanceOf()).toBe(500);
    expect(ad(adId).status).toBe("APPROVED");
    expect(tables.marketingLedgerEntry).toHaveLength(0);
    const direct = await pay(adId, "STRIPE");
    expect(direct.status).toBe(200);
    expect(direct.body).toMatchObject({ method: "STRIPE", amountCents: 1500 });
  });

  it("jamais débitée ni payée deux fois : double clic, deux onglets, puis paiement par l'autre moyen", async () => {
    const { adId } = await approvedAd();
    setBalance(10_000);
    const results = await Promise.all([pay(adId, "BALANCE"), pay(adId, "BALANCE"), pay(adId, "BALANCE")]);
    expect(results.filter((r) => r.status === 200)).toHaveLength(1);
    expect(results.filter((r) => r.status === 409)).toHaveLength(2);
    expect(balanceOf()).toBe(8500); // débité une seule fois
    expect(tables.marketingLedgerEntry).toHaveLength(1);
    // Une fois payée par le solde, ni Stripe ni un nouveau débit.
    expect((await pay(adId, "STRIPE")).status).toBe(409);
    expect((await pay(adId, "BALANCE")).status).toBe(409);
    expect(tables.campaignPayment).toHaveLength(0);
    expect(balanceOf()).toBe(8500);
  });

  it("un paiement Stripe en cours bloque le paiement par solde (pas de double règlement)", async () => {
    const { adId } = await approvedAd();
    setBalance(10_000);
    expect((await pay(adId, "STRIPE")).status).toBe(200); // session Checkout ouverte
    const blocked = await pay(adId, "BALANCE");
    expect(blocked.status).toBe(409);
    expect(blocked.body.code).toBe("PAYMENT_IN_PROGRESS");
    expect(balanceOf()).toBe(10_000);
    expect(tables.marketingLedgerEntry).toHaveLength(0);
    expect(await preview(adId)).toMatchObject({ checkoutInProgress: true });
  });

  it("le retour de Checkout sans webhook n'active rien ; seul le webhook confirmé programme la campagne", async () => {
    const { adId, campaignId } = await approvedAd();
    expect((await pay(adId, "STRIPE")).status).toBe(200);
    // Retour sur la fiche (?paid=1) : la page ne fait que relire l'état — rien n'est activé sans événement signé.
    const { GET } = await import("../src/app/api/merchant/visuels/[id]/route");
    await GET(jsonReq(`/api/merchant/visuels/${adId}?paid=1`, "GET"), ctx(adId));
    expect(ad(adId).status).toBe("APPROVED");
    expect(tables.campaign.find((c) => c.id === campaignId)!.status).toBe("PAYMENT_REQUIRED");
    expect(tables.campaignPayment[0].status).toBe("PENDING");
    // Webhook payé → programmée.
    const payment = tables.campaignPayment[0];
    const { POST } = await import("../src/app/api/stripe/webhook/route");
    const event = (id: string) => ({ id, type: "checkout.session.completed", livemode: true, data: { object: { id: payment.stripeCheckoutSessionId, payment_status: "paid", amount_total: payment.amountCents, payment_intent: "pi_1", metadata: { campaignId } } } });
    expect((await POST(new Request("http://x", { method: "POST", headers: { "stripe-signature": "t" }, body: JSON.stringify(event("evt_1")) }))).status).toBe(200);
    expect(ad(adId).status).toBe("SCHEDULED");
  });

  it("webhook d'une session devenue inutile (campagne déjà réglée par le solde) : rien n'est activé en double, l'encaissement est tracé", async () => {
    const { adId, campaignId } = await approvedAd();
    expect((await pay(adId, "STRIPE")).status).toBe(200);
    const payment = tables.campaignPayment[0];
    payment.status = "CANCELLED"; // session annulée par un règlement par le solde
    ad(adId).status = "SCHEDULED";
    const { POST } = await import("../src/app/api/stripe/webhook/route");
    const event = { id: "evt_dup", type: "checkout.session.completed", livemode: true, data: { object: { id: payment.stripeCheckoutSessionId, payment_status: "paid", amount_total: payment.amountCents, metadata: { campaignId } } } };
    expect((await POST(new Request("http://x", { method: "POST", headers: { "stripe-signature": "t" }, body: JSON.stringify(event) }))).status).toBe(200);
    expect(payment.status).toBe("CANCELLED");
    expect(tables.campaignPayment[0].status).not.toBe("PAID");
  });

  it("couverte par un quota gratuit : reste gratuite (aucun débit ni Stripe), et pas rejouable", async () => {
    h.tier = "insight"; // quota sponsorisé inclus
    const { adId } = await approvedAd();
    setBalance(5000);
    const p = await preview(adId);
    expect(p).toMatchObject({ requiresPayment: false, priceCents: 0 });
    const first = await pay(adId);
    expect(first.status).toBe(200);
    expect(first.body).toMatchObject({ requiresPayment: false });
    expect(balanceOf()).toBe(5000);
    expect(tables.marketingLedgerEntry).toHaveLength(0);
    expect(tables.campaignPayment).toHaveLength(0);
    expect(ad(adId).status).toBe("SCHEDULED");
    expect((await pay(adId)).status).toBe(409);
  });

  it("mode test : le paiement par solde TEST est explicitement simulé (fundingMode TEST), indépendant du solde réel", async () => {
    h.stripeMode = "TEST";
    const { adId } = await approvedAd();
    setBalance(5000, "LIVE"); // un solde réel ne finance jamais une campagne test
    expect(await preview(adId)).toMatchObject({ mode: "TEST", simulated: true, balanceCents: 0, balanceSufficient: false });
    expect((await pay(adId, "BALANCE")).status).toBe(402);
    setBalance(5000, "TEST");
    expect((await pay(adId, "BALANCE")).status).toBe(200);
    expect(ad(adId).fundingMode).toBe("TEST");
    expect(balanceOf("LIVE")).toBe(0 + 0); // l'ancien solde LIVE a été remplacé par setBalance ; seul le TEST est débité
    expect(balanceOf("TEST")).toBe(3500);
  });
});

/* ------------------------------------------------------------------------------------------ */
describe("2. campagnes invisibles : simulation, diagnostic et diffusion réelle", () => {
  async function scheduledAd(mode: "LIVE" | "TEST") {
    h.stripeMode = mode;
    const { adId } = await approvedAd();
    setBalance(5000, mode);
    expect((await pay(adId, "BALANCE")).status).toBe(200);
    return adId;
  }

  async function customerCard(placement = "WALLET_HOME", user = "c1") {
    asCustomer(user);
    const { selectSponsoredWithReason, passesOccasionalGate } = await import("../src/lib/sponsored-selection");
    const intervals = ad(tables.adRequest[0].id).hourlyIntervals as { start: string; end: string }[];
    vi.useFakeTimers({ toFake: ["Date"] });
    try {
      for (let k = 0; k < 12; k += 1) {
        const at = new Date(new Date(intervals[0].start).getTime() + 60_000 + k * 600_000);
        if (!passesOccasionalGate(user, placement as "WALLET_HOME", at)) continue;
        vi.setSystemTime(at);
        return await selectSponsoredWithReason({ userId: user, placement: placement as "WALLET_HOME", now: at });
      }
      return { card: null, reason: "gate" };
    } finally {
      vi.useRealTimers();
    }
  }

  it("campagne payée en mode test : simulée (jamais diffusée) et clairement signalée dans le diagnostic super-admin", async () => {
    const adId = await scheduledAd("TEST");
    expect(ad(adId).fundingMode).toBe("TEST");
    const { diagnoseAdDelivery } = await import("../src/lib/sponsored-selection");
    const diagnostic = await diagnoseAdDelivery(adId, new Date(new Date((ad(adId).hourlyIntervals as { start: string }[])[0].start).getTime() + 60_000));
    expect(diagnostic).toMatchObject({ simulated: true, mode: "TEST", deliverable: false });
    expect(diagnostic!.checks.find((c) => c.key === "mode")).toMatchObject({ ok: false });
    expect(diagnostic!.checks.find((c) => c.key === "mode")!.detail).toMatch(/TEST/);
    expect((await customerCard()).card).toBeNull();
    // La fiche super-admin renvoie ce diagnostic.
    asAdmin();
    const { GET } = await import("../src/app/api/super-admin/visuels/[id]/route");
    const fiche = (await (await GET(jsonReq(`/api/super-admin/visuels/${adId}`, "GET"), ctx(adId))).json()) as { delivery: { simulated: boolean } };
    expect(fiche.delivery.simulated).toBe(true);
  });

  it("campagne réelle payée par le solde marketing : apparaît à un client éligible sur les trois emplacements", async () => {
    const adId = await scheduledAd("LIVE");
    for (const placement of ["WALLET_HOME", "SEARCH", "NOTIFICATIONS"]) {
      const result = await customerCard(placement);
      expect(result.reason).toBe("ok");
      expect(result.card?.id).toBe(adId);
    }
  });

  it("explique pourquoi un client ne voit rien : consentement, zone, secteur différent", async () => {
    await scheduledAd("LIVE");
    tables.customerPreferences[0].notifyFifeLifeNews = false;
    expect((await customerCard()).reason).toMatch(/bons plans/);
    tables.customerPreferences[0].notifyFifeLifeNews = true;
    tables.customerPreferences[0].marketingZoneCity = null;
    tables.customerPreferences[0].marketingZonePostalCode = null;
    expect((await customerCard()).reason).toMatch(/ville ni code postal/);
    tables.customerPreferences[0].marketingZoneCity = "Paris";
    tables.customerPreferences[0].marketingZonePostalCode = "75001";
    expect((await customerCard()).reason).toMatch(/aucune campagne diffusable/);
  });

  it("diagnostic : décompte des clients éligibles et campagne diffusable seulement si tout est réuni", async () => {
    const adId = await scheduledAd("LIVE");
    const { diagnoseAdDelivery } = await import("../src/lib/sponsored-selection");
    const inSlot = new Date(new Date((ad(adId).hourlyIntervals as { start: string }[])[0].start).getTime() + 60_000);
    expect(await diagnoseAdDelivery(adId, inSlot)).toMatchObject({ deliverable: true, eligibleCustomers: 1, simulated: false });
    const outSlot = new Date(new Date((ad(adId).hourlyIntervals as { end: string }[])[0].end).getTime() + 3_600_000);
    expect((await diagnoseAdDelivery(adId, outSlot))!.deliverable).toBe(false);
    tables.customerPreferences.length = 0;
    expect((await diagnoseAdDelivery(adId, inSlot))!.checks.find((c) => c.key === "audience")).toMatchObject({ ok: false });
  });
});

/* ------------------------------------------------------------------------------------------ */
describe("4. dates et heures passées (Europe/Paris)", () => {
  // Lundi 5 octobre 2026, 10 h 30 à Paris (CEST = UTC+2) → 08:30 UTC.
  const NOW = new Date("2026-10-05T08:30:00.000Z");

  it("refuse un jour passé et les heures écoulées du jour en cours ; accepte les heures à venir", () => {
    expect(validateSponsoredSchedule([{ date: "2026-10-04", hours: [10, 11, 12] }], NOW)).toMatchObject({ ok: false });
    expect(validateSponsoredSchedule([{ date: "2026-10-05", hours: [9, 10, 11] }], NOW)).toMatchObject({ ok: false }); // 9 h et 10 h écoulées
    expect(validateSponsoredSchedule([{ date: "2026-10-05", hours: [11, 12, 13] }], NOW)).toEqual({ ok: true });
    expect(validateSponsoredSchedule([{ date: "2026-10-06", hours: [0, 1, 2] }], NOW)).toEqual({ ok: true });
    const past = validateSponsoredSchedule([{ date: "2026-10-04", hours: [10, 11, 12] }], NOW);
    expect(past.ok === false && past.error).toMatch(/passé/);
  });

  it("l'heure en cours (10 h) n'est plus sélectionnable : seules les heures qui n'ont pas commencé le sont", () => {
    expect(selectableHoursForDay("2026-10-05", NOW)[0]).toBe(11);
    expect(selectableHoursForDay("2026-10-05", NOW)).toHaveLength(13);
    expect(selectableHoursForDay("2026-10-04", NOW)).toEqual([]);
    expect(selectableHoursForDay("2026-10-06", NOW)).toHaveLength(24);
  });

  it("conserve le minimum de 3 h : s'il ne reste pas 3 heures futures aujourd'hui, le jour n'est plus choisissable", () => {
    const at2230 = new Date("2026-10-05T20:30:00.000Z"); // 22 h 30 à Paris → reste 23 h seulement
    expect(selectableHoursForDay("2026-10-05", at2230)).toEqual([23]);
    expect(isDaySelectable("2026-10-05", at2230)).toBe(false);
    expect(isDaySelectable("2026-10-06", at2230)).toBe(true);
    const refused = validateSponsoredSchedule([{ date: "2026-10-05", hours: [23] }], at2230);
    expect(refused.ok === false && refused.error).toMatch(/3 heures disponibles/);
    // Pile 3 heures restantes (20 h 30 → 21, 22, 23) : choisissable.
    const at2030 = new Date("2026-10-05T18:30:00.000Z");
    expect(isDaySelectable("2026-10-05", at2030)).toBe(true);
    expect(validateSponsoredSchedule([{ date: "2026-10-05", hours: [21, 22, 23] }], at2030)).toEqual({ ok: true });
    expect(MIN_HOURS_PER_DAY).toBe(3);
  });

  it("le jour courant est celui de Paris, pas celui de l'UTC (minuit passé à Paris, pas encore en UTC)", () => {
    const parisAlreadyTuesday = new Date("2026-10-05T22:30:00.000Z"); // 00 h 30 le 6 à Paris
    expect(todayParisDate(parisAlreadyTuesday)).toBe("2026-10-06");
    expect(validateSponsoredSchedule([{ date: "2026-10-05", hours: [10, 11, 12] }], parisAlreadyTuesday)).toMatchObject({ ok: false });
    expect(validateSponsoredSchedule([{ date: "2026-10-06", hours: [10, 11, 12] }], parisAlreadyTuesday)).toEqual({ ok: true });
    // Heure d'hiver (CET, UTC+1) : 23 h 30 à Paris le 5 janvier = 22:30 UTC.
    expect(todayParisDate(new Date("2027-01-05T22:30:00.000Z"))).toBe("2027-01-05");
    expect(todayParisDate(new Date("2027-01-05T23:30:00.000Z"))).toBe("2027-01-06");
  });

  it("côté serveur : création refusée sur un jour passé ou des heures écoulées, modification comprise", async () => {
    asMerchant();
    const { POST: stage } = await import("../src/app/api/merchant/visuels/televerser/route");
    const staged = (await (await stage(jsonReq("/api/merchant/visuels/televerser", "POST", { dataUrl: await dataUrl(800, 800), kind: "banniere" }))).json()) as { url: string };
    const { POST } = await import("../src/app/api/merchant/ads/route");
    const create = async (schedule: unknown) =>
      POST(jsonReq("/api/merchant/ads", "POST", { requestedText: "Pain frais", visualMode: "SELF", requestedImageUrl: staged.url, hourlySchedule: schedule }));

    const today = todayParisDate();
    const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
    const pastDay = await create([{ date: yesterday, hours: [10, 11, 12] }]);
    expect(pastDay.status).toBe(400);
    expect(((await pastDay.json()) as { error: string }).error).toMatch(/passé/);
    // Aujourd'hui, heures 0-2 (forcément écoulées sauf à minuit pile) : refusé.
    expect((await create([{ date: today, hours: [0, 1, 2] }])).status).toBe(400);
    expect(tables.adRequest).toHaveLength(0);

    // Modification : un planning passé est refusé aussi.
    const ok = await create(futureSchedule());
    expect(ok.status).toBe(200);
    const created = (await ok.json()) as { adRequest: { id: string } };
    const { PATCH } = await import("../src/app/api/merchant/ads/[id]/route");
    const edit = await PATCH(jsonReq(`/api/merchant/ads/${created.adRequest.id}`, "PATCH", { hourlySchedule: [{ date: yesterday, hours: [10, 11, 12] }] }), ctx(created.adRequest.id));
    expect(edit.status).toBe(400);
    const edited = await PATCH(jsonReq(`/api/merchant/ads/${created.adRequest.id}`, "PATCH", { hourlySchedule: futureSchedule([14, 15, 16]) }), ctx(created.adRequest.id));
    expect(edited.status).toBe(200);
  });

  it("un créneau écoulé entre la validation et le paiement bloque le paiement (aucun débit, aucun quota consommé)", async () => {
    const { adId } = await approvedAd();
    setBalance(5000);
    const intervals = ad(adId).hourlyIntervals as { start: string }[];
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(new Date(intervals[0].start).getTime() + 3600_000 * 2)); // 2 h après le début : 10 h et 11 h écoulées
    const blocked = await pay(adId, "BALANCE");
    expect(blocked.status).toBe(409);
    expect(blocked.body.code).toBe("SLOTS_EXPIRED");
    expect(balanceOf()).toBe(5000);
    expect(ad(adId).status).toBe("APPROVED");
    expect(await preview(adId)).toMatchObject({ slotsExpired: true });
    expect(elapsedHoursCount([{ date: "2026-10-05", hours: [8, 9, 12] }], new Date("2026-10-05T08:30:00.000Z"))).toBe(2); // à 10 h 30 (Paris), les heures 8 h et 9 h sont terminées ; 12 h ne l'est pas
    vi.useRealTimers();
  });
});
