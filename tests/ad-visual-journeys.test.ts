import { mkdtempSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import sharp from "sharp";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { resolveSponsoredImageUrl } from "../src/lib/sponsored-image";
import { createFakeAdDb } from "./helpers/fake-ad-db";

/**
 * Parcours complets du visuel des mises en avant, exécutés sur les VRAIES routes (fausse base en
 * mémoire, vrai stockage de fichiers dans un dossier temporaire) :
 *  A. bandeau du commerçant → refus motivé → re-soumission → approbation → paiement → diffusion
 *  B. images sources → création par Fideto → proposition → demande de modification → nouvelle
 *     version → acceptation → paiement (webhook) → diffusion → remplacement sans toucher au diffusé
 */

const h = vi.hoisted(() => ({
  uploads: "",
  session: { merchant: "m1" as string | null, admin: false, customer: null as string | null },
  stripeMode: "LIVE" as "TEST" | "LIVE",
}));

const fake = createFakeAdDb();

vi.mock("@/lib/media-storage", () => ({ getUploadsRoot: () => h.uploads }));
vi.mock("@/lib/prisma", () => ({ prisma: fake.prisma }));
vi.mock("@/lib/staff-notification-delivery", () => ({ deliverStaffNotificationSideEffects: vi.fn() }));
vi.mock("@/lib/audit", () => ({ writeAudit: vi.fn() }));
vi.mock("@/lib/rate-limit", () => ({ LIMITS: {}, rateLimit: () => ({ ok: true }) }));
vi.mock("@/lib/merchant-card-template-service", () => ({
  normalizeResolvedPublishedTemplate: () => null,
  resolvePublishedMerchantCardTemplate: async () => null,
}));
vi.mock("@/lib/api-guard", () => ({
  requireMutatingRequest: async () => ({ error: null }),
  requireUser: async () =>
    h.session.customer ? { error: null, user: { id: h.session.customer } } : { error: new Response(null, { status: 401 }), user: null },
  requireSuperAdmin: async () =>
    h.session.admin ? { error: null, user: { id: "admin_1" } } : { error: new Response(null, { status: 401 }), user: null },
  requireMerchantAdmin: async (_req: Request, merchantId?: string) => {
    if (!h.session.merchant || (merchantId && merchantId !== h.session.merchant)) {
      return { error: new Response(null, { status: 403 }) };
    }
    return { error: null, user: { id: `user_${h.session.merchant}` }, membership: { merchantId: h.session.merchant } };
  },
}));
vi.mock("@/lib/stripe-mode", () => ({
  getActiveStripeMode: () => h.stripeMode,
  isPaymentAllowedForMerchant: () => true,
  isStripeConfigured: () => true,
}));
vi.mock("@/lib/stripe", () => ({
  StripeNotConfiguredError: class extends Error {},
  createCampaignCheckoutSession: async () => ({ id: "cs_1", url: "https://checkout.stripe.test/cs_1" }),
  constructStripeWebhookEvent: (payload: string) => JSON.parse(payload),
}));
vi.mock("@/lib/campaign-quota", async () => {
  const actual = await vi.importActual<typeof import("../src/lib/campaign-quota")>("../src/lib/campaign-quota");
  return { ...actual, getQuotaUsage: async () => 0, resolvePlanTier: async () => "normal" };
});

const { tables } = fake;

function asMerchant(id: string) {
  h.session = { merchant: id, admin: false, customer: null };
}
function asAdmin() {
  h.session = { merchant: null, admin: true, customer: null };
}
function asVisitor() {
  h.session = { merchant: null, admin: false, customer: "c1" };
}

function jsonRequest(path: string, method: string, body?: unknown) {
  return new Request(`http://localhost:3000${path}`, {
    method,
    headers: { "Content-Type": "application/json", origin: "http://localhost:3000" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}
const ctx = (id: string) => ({ params: Promise.resolve({ id }) });

async function dataUrl(width: number, height: number, format: "png" | "jpeg" = "png", color = "#cc3355") {
  const image = sharp({ create: { width, height, channels: 3, background: color } });
  const buffer = format === "png" ? await image.png().toBuffer() : await image.jpeg().toBuffer();
  return `data:image/${format};base64,${buffer.toString("base64")}`;
}

async function stage(kind: "source" | "banniere" | "original", url: string) {
  const { POST } = await import("../src/app/api/merchant/visuels/televerser/route");
  const response = await POST(jsonRequest("/api/merchant/visuels/televerser", "POST", { dataUrl: url, kind }));
  const body = (await response.json()) as { url?: string; error?: string };
  return { status: response.status, ...body };
}

function schedule() {
  const date = new Date(Date.now() + 3 * 86_400_000).toISOString().slice(0, 10);
  return [{ date, hours: [10, 11, 12] }];
}

async function createAd(input: Record<string, unknown>) {
  const { POST } = await import("../src/app/api/merchant/ads/route");
  const response = await POST(
    jsonRequest("/api/merchant/ads", "POST", { requestedText: "Pain frais tous les matins", hourlySchedule: schedule(), ...input }),
  );
  return { status: response.status, body: (await response.json()) as { adRequest?: { id: string }; campaign?: { id: string }; error?: string } };
}

async function moderate(id: string, body: Record<string, unknown>) {
  const { PATCH } = await import("../src/app/api/super-admin/ads/[id]/route");
  const response = await PATCH(jsonRequest(`/api/super-admin/ads/${id}`, "PATCH", body), ctx(id));
  return { status: response.status, body: (await response.json()) as { error?: string } };
}

async function adminPropose(adId: string, color: string) {
  const { POST: upload } = await import("../src/app/api/super-admin/visuels/[id]/fichier/route");
  const staged = await upload(jsonRequest(`/api/super-admin/visuels/${adId}/fichier`, "POST", { dataUrl: await dataUrl(1000, 1000, "png", color), kind: "banniere" }), ctx(adId));
  const { url } = (await staged.json()) as { url: string };
  const { POST } = await import("../src/app/api/super-admin/visuels/[id]/proposition/route");
  const response = await POST(jsonRequest(`/api/super-admin/visuels/${adId}/proposition`, "POST", { url }), ctx(adId));
  return { status: response.status, url, body: (await response.json()) as { error?: string } };
}

async function merchantRespond(adId: string, body: Record<string, unknown>) {
  const { POST } = await import("../src/app/api/merchant/visuels/[id]/reponse/route");
  const response = await POST(jsonRequest(`/api/merchant/visuels/${adId}/reponse`, "POST", body), ctx(adId));
  return { status: response.status, body: (await response.json()) as { error?: string } };
}

async function pay(adId: string) {
  const { POST } = await import("../src/app/api/merchant/visuels/[id]/paiement/route");
  const response = await POST(jsonRequest(`/api/merchant/visuels/${adId}/paiement`, "POST"), ctx(adId));
  return { status: response.status, body: (await response.json()) as { error?: string; code?: string; checkoutUrl?: string; amountCents?: number } };
}

async function stripeWebhookPaid(campaignId: string) {
  const payment = tables.campaignPayment.find((p) => p.campaignId === campaignId)!;
  const { POST } = await import("../src/app/api/stripe/webhook/route");
  const event = {
    id: `evt_${Math.random()}`,
    type: "checkout.session.completed",
    livemode: true,
    data: {
      object: {
        id: payment.stripeCheckoutSessionId,
        payment_status: "paid",
        amount_total: payment.amountCents,
        payment_intent: "pi_1",
        metadata: { campaignId },
      },
    },
  };
  const response = await POST(new Request("http://localhost:3000/api/stripe/webhook", { method: "POST", headers: { "stripe-signature": "t" }, body: JSON.stringify(event) }));
  return response.status;
}

/**
 * Bandeau proposé au client c1 (zone Lyon/69001, bons plans acceptés) par l'API réelle. La règle de
 * fréquence est volontairement testée à part : ici on repart d'un historique vide et on balaie
 * quelques tranches de 10 min (le tirage « occasionnel » est déterministe par tranche).
 */
async function publicSponsored(placement = "WALLET_HOME") {
  const { GET } = await import("../src/app/api/customer/sponsored/route");
  const start = Date.now();
  for (let k = 0; k < 12; k += 1) {
    tables.adCustomerView.length = 0;
    vi.setSystemTime(start + k * 600_000);
    const response = await GET(new Request(`http://localhost:3000/api/customer/sponsored?placement=${placement}`));
    const { ad } = (await response.json()) as { ad: { id: string; imageUrl: string } | null };
    if (ad) {
      vi.setSystemTime(start);
      return [ad];
    }
  }
  vi.setSystemTime(start);
  return [];
}

async function fetchFile(url: string, query = "") {
  const parsed = /^\/api\/media\/visuels\/([\w-]+)\/([\w.-]+)$/.exec(url)!;
  const { GET } = await import("../src/app/api/media/visuels/[merchantId]/[filename]/route");
  return GET(new Request(`http://localhost:3000${url}${query}`), { params: Promise.resolve({ merchantId: parsed[1], filename: parsed[2] }) });
}

const notifications = (audience: "MERCHANT" | "SUPER_ADMIN", adId: string) =>
  tables.staffNotification.filter((n) => n.audience === audience && n.adRequestId === adId).map((n) => n.kind);

const adRow = (id: string) => tables.adRequest.find((a) => a.id === id)!;
const versionsOf = (id: string) => tables.adVisualVersion.filter((v) => v.adRequestId === id).sort((a, b) => (a.number as number) - (b.number as number));

beforeEach(() => {
  h.uploads = mkdtempSync(join(tmpdir(), "fideto-visuels-"));
  for (const key of Object.keys(tables)) tables[key].length = 0;
  h.stripeMode = "LIVE";
  tables.user.push({ id: "c1", isActive: true });
  tables.customerPreferences.push({ id: "p1", userId: "c1", notifyFifeLifeNews: true, marketingZoneCity: "Lyon", marketingZonePostalCode: "69001" });
  asMerchant("m1");
});

afterAll(() => {
  vi.useRealTimers();
});

describe("Parcours A — le commerçant crée son bandeau", () => {
  it("soumission → refus motivé → re-soumission → approbation → paiement (quota) → diffusion dans le créneau", async () => {
    // 1. Il importe son bandeau (carré), l'aperçu est son fichier, il soumet.
    const banner1 = await stage("banniere", await dataUrl(800, 800, "png", "#aa2222"));
    expect(banner1.status).toBe(200);
    const created = await createAd({ visualMode: "SELF", requestedImageUrl: banner1.url });
    expect(created.status).toBe(200);
    const adId = created.body.adRequest!.id;
    const campaignId = created.body.campaign!.id;
    expect(adRow(adId).status).toBe("PENDING_REVIEW");
    expect(versionsOf(adId).map((v) => [v.number, v.author, v.status])).toEqual([[1, "MERCHANT", "SUBMITTED"]]);
    expect(adRow(adId).finalImageUrl ?? null).toBeNull();
    expect(notifications("SUPER_ADMIN", adId)).toEqual(["MERCHANT_BANNER_SUBMITTED"]);

    // Une version en attente n'est jamais publique (fichier ni diffusion).
    asVisitor();
    expect((await fetchFile(banner1.url!)).status).toBe(404);
    vi.useFakeTimers({ toFake: ["Date"] });
    expect(await publicSponsored()).toEqual([]);
    vi.useRealTimers();

    // 2. Le super-admin télécharge l'original, puis refuse le VISUEL avec un motif précis.
    asAdmin();
    const download = await fetchFile(versionsOf(adId)[0].originalUrl as string, "?telecharger=1");
    expect(download.status).toBe(200);
    expect(download.headers.get("content-disposition")).toContain("attachment");
    const noReason = await moderate(adId, { action: "request_changes" });
    expect(noReason.status).toBe(400);
    const refused = await moderate(adId, { action: "request_changes", rejectionReason: "Le logo est coupé en bas." });
    expect(refused.status).toBe(200);
    expect(adRow(adId).status).toBe("NEEDS_CHANGES"); // visuel refusé ≠ campagne refusée (REJECTED)
    expect(versionsOf(adId)[0]).toMatchObject({ status: "CHANGES_REQUESTED", comment: "Le logo est coupé en bas." });
    expect(tables.staffNotification.find((n) => n.kind === "VISUAL_REFUSED")!.message).toContain("Le logo est coupé en bas.");

    // 3. Le commerçant voit le motif, remplace son fichier et re-soumet.
    asMerchant("m1");
    const { GET: ficheGet } = await import("../src/app/api/merchant/visuels/[id]/route");
    const fiche = (await (await ficheGet(jsonRequest(`/api/merchant/visuels/${adId}`, "GET"), ctx(adId))).json()) as {
      adRequest: { rejectionReason: string };
      nextAction: { actor: string };
    };
    expect(fiche.adRequest.rejectionReason).toBe("Le logo est coupé en bas.");
    expect(fiche.nextAction.actor).toBe("MERCHANT");
    const banner2 = await stage("banniere", await dataUrl(1200, 1200, "jpeg", "#22aa44"));
    const { POST: submit } = await import("../src/app/api/merchant/visuels/[id]/soumettre/route");
    const resubmit = await submit(jsonRequest(`/api/merchant/visuels/${adId}/soumettre`, "POST", { displayUrl: banner2.url }), ctx(adId));
    expect(resubmit.status).toBe(200);
    expect(adRow(adId).status).toBe("PENDING_REVIEW");
    expect(versionsOf(adId).map((v) => [v.number, v.status])).toEqual([[1, "CHANGES_REQUESTED"], [2, "SUBMITTED"]]);
    expect(notifications("SUPER_ADMIN", adId)).toContain("MERCHANT_BANNER_RESUBMITTED");
    // Une fois soumis, il ne peut plus remplacer le fichier.
    const again = await submit(jsonRequest(`/api/merchant/visuels/${adId}/soumettre`, "POST", { displayUrl: banner2.url }), ctx(adId));
    expect(again.status).toBe(409);

    // 4. Approbation → prêt pour le paiement + notifications.
    asAdmin();
    expect((await moderate(adId, { action: "approve" })).status).toBe(200);
    expect(adRow(adId)).toMatchObject({ status: "APPROVED", finalImageUrl: banner2.url, finalVersionId: versionsOf(adId)[1].id });
    expect(notifications("MERCHANT", adId)).toEqual(expect.arrayContaining(["VISUAL_REFUSED", "VISUAL_APPROVED", "READY_FOR_PAYMENT"]));

    // 5. Paiement (Stripe) → webhook signé → programmée → diffusée dans le créneau, avec la version approuvée.
    asMerchant("m1");
    expect((await pay(adId)).status).toBe(200);
    expect(await stripeWebhookPaid(campaignId)).toBe(200);
    expect(adRow(adId).status).toBe("SCHEDULED");
    expect(notifications("MERCHANT", adId)).toContain("CAMPAIGN_SCHEDULED");
    const intervals = adRow(adId).hourlyIntervals as { start: string; end: string }[];
    vi.useFakeTimers({ toFake: ["Date"] });
    asVisitor();
    vi.setSystemTime(new Date(new Date(intervals[0].start).getTime() + 10 * 60_000));
    const live = await publicSponsored();
    expect(live.map((a) => a.imageUrl)).toEqual([resolveSponsoredImageUrl(banner2.url)]); // jamais la version refusée
    vi.setSystemTime(new Date(new Date(intervals[0].end).getTime() + 3600_000));
    expect(await publicSponsored()).toEqual([]);
    vi.useRealTimers();
  });
});

describe("Parcours B — Fideto crée le bandeau", () => {
  it("images sources → proposition → modification → nouvelle version → acceptation → paiement → diffusion", async () => {
    // 1. Le commerçant joint 2 images sources et une courte indication.
    const s1 = await stage("source", await dataUrl(1600, 900, "jpeg", "#3355cc"));
    const s2 = await stage("source", await dataUrl(900, 1600, "png", "#ccaa33"));
    const created = await createAd({ visualMode: "FIDETO", requestedImageUrls: [s1.url, s2.url], visualBrief: "Ambiance chaleureuse" });
    expect(created.status).toBe(200);
    const adId = created.body.adRequest!.id;
    const campaignId = created.body.campaign!.id;
    expect(adRow(adId)).toMatchObject({ status: "PENDING_REVIEW", visualBrief: "Ambiance chaleureuse" });
    expect(tables.adRequestImage.filter((i) => i.adRequestId === adId)).toHaveLength(2);
    expect(notifications("SUPER_ADMIN", adId)).toEqual(["MERCHANT_IMAGES_SENT"]);

    // 2. Le super-admin prévisualise/télécharge chaque source + l'archive complète ; pas le public, pas un autre commerce.
    asAdmin();
    expect((await fetchFile(s1.url!, "?telecharger=1")).status).toBe(200);
    const { GET: archive } = await import("../src/app/api/super-admin/visuels/[id]/archive/route");
    const zip = await archive(jsonRequest(`/api/super-admin/visuels/${adId}/archive`, "GET"), ctx(adId));
    expect(zip.headers.get("content-type")).toBe("application/zip");
    const zipBytes = Buffer.from(await zip.arrayBuffer());
    expect(zipBytes.subarray(0, 4).toString("hex")).toBe("504b0304");
    expect(zipBytes.readUInt16LE(zipBytes.length - 22 + 10)).toBe(2); // 2 entrées
    asMerchant("m2");
    expect((await fetchFile(s1.url!)).status).toBe(404);
    asVisitor();
    expect((await fetchFile(s1.url!)).status).toBe(404);

    // 3. Fideto importe le bandeau créé dans Photoshop et le propose.
    asAdmin();
    const v1 = await adminPropose(adId, "#118833");
    expect(v1.status).toBe(200);
    expect(adRow(adId).status).toBe("AWAITING_MERCHANT");
    expect(adRow(adId).finalImageUrl ?? null).toBeNull();
    expect(notifications("MERCHANT", adId)).toContain("BANNER_PROPOSED");

    // Pas de paiement avant acceptation.
    asMerchant("m1");
    const tooEarly = await pay(adId);
    expect(tooEarly.status).toBe(409);
    expect(tooEarly.body.code).toBe("NOT_APPROVED");

    // 4. Le commerçant demande une modification (commentaire obligatoire) → retour super-admin.
    expect((await merchantRespond(adId, { action: "request_changes" })).status).toBe(400);
    expect((await merchantRespond(adId, { action: "request_changes", comment: "Plus de rouge, svp" })).status).toBe(200);
    expect(adRow(adId).status).toBe("PENDING_REVIEW");
    expect(versionsOf(adId)[0]).toMatchObject({ status: "CHANGES_REQUESTED", comment: "Plus de rouge, svp" });
    expect(tables.staffNotification.find((n) => n.kind === "MERCHANT_CHANGES_REQUESTED")!.message).toContain("Plus de rouge, svp");

    // 5. Nouvelle version → le commerçant l'accepte : seule celle-ci devient finale.
    asAdmin();
    const v2 = await adminPropose(adId, "#dd2233");
    expect(v2.status).toBe(200);
    expect(notifications("MERCHANT", adId)).toContain("NEW_VERSION_PROPOSED");
    asMerchant("m1");
    expect((await merchantRespond(adId, { action: "accept" })).status).toBe(200);
    expect(adRow(adId)).toMatchObject({ status: "APPROVED", finalImageUrl: v2.url });
    expect(adRow(adId).finalImageUrl).not.toBe(v1.url);
    expect(versionsOf(adId).map((v) => [v.number, v.status])).toEqual([[1, "CHANGES_REQUESTED"], [2, "APPROVED"]]);
    expect(notifications("SUPER_ADMIN", adId)).toContain("MERCHANT_ACCEPTED");
    expect(notifications("MERCHANT", adId)).toContain("READY_FOR_PAYMENT");

    // 6. Paiement → webhook signé → programmée.
    const checkout = await pay(adId);
    expect(checkout.status).toBe(200);
    expect(checkout.body.checkoutUrl).toContain("checkout.stripe.test");
    expect(adRow(adId).status).toBe("APPROVED"); // pas programmée avant le webhook
    expect(await stripeWebhookPaid(campaignId)).toBe(200);
    expect(adRow(adId)).toMatchObject({ status: "SCHEDULED", fundingMode: "LIVE" });
    expect(notifications("MERCHANT", adId)).toContain("CAMPAIGN_SCHEDULED");

    // 7. Diffusion : seulement dans le créneau, avec la version acceptée (jamais l'ancienne).
    const intervals = adRow(adId).hourlyIntervals as { start: string; end: string }[];
    const inSlot = new Date(new Date(intervals[0].start).getTime() + 10 * 60_000);
    const outOfSlot = new Date(new Date(intervals[0].end).getTime() + 5 * 3600_000);
    vi.useFakeTimers({ toFake: ["Date"] });
    asVisitor();
    vi.setSystemTime(outOfSlot);
    expect(await publicSponsored()).toEqual([]);
    vi.setSystemTime(inSlot);
    const live = await publicSponsored();
    expect(live).toHaveLength(1);
    expect(live[0].imageUrl).toBe(resolveSponsoredImageUrl(v2.url));
    expect((await fetchFile(v2.url)).status).toBe(200); // le public lit le fichier diffusé…
    expect((await fetchFile(v1.url)).status).toBe(404); // …jamais une ancienne version
    expect((await fetchFile(s1.url!)).status).toBe(404); // …ni une source

    // 8. Remplacement après diffusion : nouvelle version à valider, l'image diffusée ne change pas.
    asAdmin();
    const v3 = await adminPropose(adId, "#2233dd");
    expect(v3.status).toBe(200);
    expect(adRow(adId).status).toBe("SCHEDULED");
    expect(adRow(adId).finalImageUrl).toBe(v2.url);
    asVisitor();
    expect((await publicSponsored())[0].imageUrl).toBe(resolveSponsoredImageUrl(v2.url));
    expect((await fetchFile(v3.url)).status).toBe(404);
    asMerchant("m1");
    expect((await merchantRespond(adId, { action: "accept" })).status).toBe(200);
    expect(adRow(adId)).toMatchObject({ status: "SCHEDULED", finalImageUrl: v3.url });
    asVisitor();
    expect((await publicSponsored())[0].imageUrl).toBe(resolveSponsoredImageUrl(v3.url));
    expect(versionsOf(adId).filter((v) => v.status === "APPROVED")).toHaveLength(1);
    vi.useRealTimers();
  });
});

describe("Refus de campagne, accès et contrôles serveur", () => {
  it("refuser la campagne entière (REJECTED) notifie le commerçant avec le motif, sans toucher aux versions", async () => {
    const banner = await stage("banniere", await dataUrl(800, 800));
    const { body } = await createAd({ visualMode: "SELF", requestedImageUrl: banner.url });
    const adId = body.adRequest!.id;
    asAdmin();
    expect((await moderate(adId, { action: "reject", rejectionReason: "Activité non conforme." })).status).toBe(200);
    expect(adRow(adId)).toMatchObject({ status: "REJECTED", rejectionReason: "Activité non conforme." });
    expect(tables.staffNotification.find((n) => n.kind === "CAMPAIGN_REFUSED")!.message).toContain("Activité non conforme.");
    expect(versionsOf(adId)).toHaveLength(1);
  });

  it("un autre commerce ne voit, ne soumet ni ne répond sur la fiche ; ses fichiers lui sont refusés", async () => {
    const banner = await stage("banniere", await dataUrl(800, 800));
    const { body } = await createAd({ visualMode: "SELF", requestedImageUrl: banner.url });
    const adId = body.adRequest!.id;

    asMerchant("m2");
    const { GET } = await import("../src/app/api/merchant/visuels/[id]/route");
    expect((await GET(jsonRequest(`/api/merchant/visuels/${adId}`, "GET"), ctx(adId))).status).toBe(404);
    expect((await merchantRespond(adId, { action: "accept" })).status).toBe(404);
    expect((await fetchFile(banner.url!)).status).toBe(404);
    // Il ne peut pas rattacher le fichier d'un autre commerce à sa propre demande.
    const stolen = await createAd({ visualMode: "SELF", requestedImageUrl: banner.url });
    expect(stolen.status).toBe(400);
    // Ni supprimer son fichier.
    const { DELETE } = await import("../src/app/api/merchant/visuels/televerser/route");
    expect((await DELETE(jsonRequest("/api/merchant/visuels/televerser", "DELETE", { url: banner.url }))).status).toBe(403);

    asMerchant("m1");
    expect((await fetchFile(banner.url!)).status).toBe(200);
  });

  it("rejette un faux fichier image, un bandeau non carré et un fichier trop lourd", async () => {
    const fake = `data:image/png;base64,${Buffer.from("<html>pas une image</html>").toString("base64")}`;
    expect((await stage("source", fake)).status).toBe(400);
    expect((await stage("banniere", await dataUrl(900, 500))).status).toBe(400);
    expect((await stage("banniere", await dataUrl(200, 200))).status).toBe(400); // trop petit pour l'affichage
    expect((await stage("source", await dataUrl(900, 500))).status).toBe(200); // une source peut avoir n'importe quel format
    const huge = `data:image/png;base64,${Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.alloc(11 * 1024 * 1024)]).toString("base64")}`;
    expect((await stage("source", huge)).status).toBe(400);
  });

  it("l'approbation ne publie que la version soumise : sans version soumise (Fideto crée), approuver est refusé", async () => {
    const s1 = await stage("source", await dataUrl(900, 500));
    const { body } = await createAd({ visualMode: "FIDETO", requestedImageUrls: [s1.url] });
    const adId = body.adRequest!.id;
    // Une URL arbitraire n'est jamais prise en compte.
    asAdmin();
    const result = await moderate(adId, { action: "approve", finalImageUrl: "https://evil.example/x.png" });
    expect(adRow(adId).finalImageUrl ?? null).toBeNull();
    expect(result.status).toBe(409);
  });
});

describe("Notifications persistantes (cloche)", () => {
  it("compteur de non lues, marquage lu persistant, isolation par commerce", async () => {
    const banner = await stage("banniere", await dataUrl(800, 800));
    const { body } = await createAd({ visualMode: "SELF", requestedImageUrl: banner.url });
    const adId = body.adRequest!.id;
    asAdmin();
    await moderate(adId, { action: "request_changes", rejectionReason: "Image floue." });

    const { GET, POST } = await import("../src/app/api/merchant/notifications/route");
    asMerchant("m1");
    let data = (await (await GET(jsonRequest("/api/merchant/notifications", "GET"))).json()) as { unread: number; items: { id: string; message: string; href: string }[] };
    expect(data.unread).toBe(1);
    expect(data.items[0].message).toContain("Image floue.");
    expect(data.items[0].href).toBe(`/app/campagnes/${body.campaign!.id}`);

    // Un autre commerce ne voit rien et ne peut rien marquer chez m1.
    asMerchant("m2");
    const other = (await (await GET(jsonRequest("/api/merchant/notifications", "GET"))).json()) as { unread: number };
    expect(other.unread).toBe(0);
    await POST(jsonRequest("/api/merchant/notifications", "POST", { all: true }));
    asMerchant("m1");
    data = (await (await GET(jsonRequest("/api/merchant/notifications", "GET"))).json()) as typeof data;
    expect(data.unread).toBe(1);

    // Marquage lu par son propriétaire : persistant (relu depuis la « base »).
    await POST(jsonRequest("/api/merchant/notifications", "POST", { ids: [data.items[0].id] }));
    data = (await (await GET(jsonRequest("/api/merchant/notifications", "GET"))).json()) as typeof data;
    expect(data.unread).toBe(0);
    expect(tables.staffNotification.filter((n) => n.audience === "MERCHANT")[0].readAt).toBeInstanceOf(Date);

    // Côté super-admin : la soumission est signalée, liée à la fiche.
    asAdmin();
    const { GET: adminGet } = await import("../src/app/api/super-admin/notifications/route");
    const adminData = (await (await adminGet(jsonRequest("/api/super-admin/notifications", "GET"))).json()) as { unread: number; items: { href: string }[] };
    expect(adminData.unread).toBe(1);
    expect(adminData.items[0].href).toBe(`/super-admin/campagnes/fiche/${adId}`);
  });
});

afterAll(() => {
  try {
    rmSync(h.uploads, { recursive: true, force: true });
  } catch {
    // dossier temporaire : sans importance
  }
});
