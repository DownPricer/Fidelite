import { mkdtempSync, readFileSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import sharp from "sharp";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { adJourney } from "../src/lib/ad-visual-workflow";
import { createFakeAdDb } from "./helpers/fake-ad-db";

/** Fiche super-admin : validation directe, nouvelle version, proposition en attente, recadrage réellement enregistré. */

const h = vi.hoisted(() => ({ uploads: "", session: { merchant: "m1" as string | null, admin: false } }));
const fake = createFakeAdDb();
const { tables } = fake;

vi.mock("@/lib/media-storage", () => ({ getUploadsRoot: () => h.uploads }));
vi.mock("@/lib/prisma", () => ({ prisma: fake.prisma }));
vi.mock("@/lib/audit", () => ({ writeAudit: vi.fn() }));
vi.mock("@/lib/api-guard", () => ({
  requireMutatingRequest: async () => ({ error: null }),
  requireSuperAdmin: async () => (h.session.admin ? { error: null, user: { id: "admin_1" } } : { error: new Response(null, { status: 401 }), user: null }),
  requireMerchantAdmin: async (_r: Request, merchantId?: string) =>
    !h.session.merchant || (merchantId && merchantId !== h.session.merchant)
      ? { error: new Response(null, { status: 403 }) }
      : { error: null, user: { id: "user_m1" }, membership: { merchantId: h.session.merchant } },
}));

const asMerchant = () => (h.session = { merchant: "m1", admin: false });
const asAdmin = () => (h.session = { merchant: null, admin: true });
const ctx = (id: string) => ({ params: Promise.resolve({ id }) });
const jsonReq = (path: string, method: string, body?: unknown) =>
  new Request(`http://localhost:3000${path}`, {
    method,
    headers: { "Content-Type": "application/json", origin: "http://localhost:3000" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

async function dataUrl(w: number, hh: number, format: "png" | "jpeg" = "png", color = "#cc3355") {
  const img = sharp({ create: { width: w, height: hh, channels: 3, background: color } });
  const buf = format === "png" ? await img.png().toBuffer() : await img.jpeg().toBuffer();
  return `data:image/${format};base64,${buf.toString("base64")}`;
}

async function merchantStage(kind: string, url: string) {
  const { POST } = await import("../src/app/api/merchant/visuels/televerser/route");
  return (await (await POST(jsonReq("/api/merchant/visuels/televerser", "POST", { dataUrl: url, kind }))).json()) as { url: string };
}

async function createAd(input: Record<string, unknown>) {
  const date = new Date(Date.now() + 3 * 86_400_000).toISOString().slice(0, 10);
  const { POST } = await import("../src/app/api/merchant/ads/route");
  const body = (await (await POST(jsonReq("/api/merchant/ads", "POST", { requestedText: "Pain frais", hourlySchedule: [{ date, hours: [10, 11, 12] }], ...input }))).json()) as {
    adRequest: { id: string };
    campaign: { id: string };
  };
  return { adId: body.adRequest.id, campaignId: body.campaign.id };
}

async function moderate(id: string, body: Record<string, unknown>) {
  const { PATCH } = await import("../src/app/api/super-admin/visuels/[id]/route");
  const response = await PATCH(jsonReq(`/api/super-admin/visuels/${id}`, "PATCH", body), ctx(id));
  return response.status;
}

async function adminStage(adId: string, kind: "banniere" | "original", url: string) {
  const { POST } = await import("../src/app/api/super-admin/visuels/[id]/fichier/route");
  return (await (await POST(jsonReq(`/api/super-admin/visuels/${adId}/fichier`, "POST", { dataUrl: url, kind }), ctx(adId))).json()) as { url: string };
}

async function propose(adId: string, body: Record<string, unknown>) {
  const { POST } = await import("../src/app/api/super-admin/visuels/[id]/proposition/route");
  const response = await POST(jsonReq(`/api/super-admin/visuels/${adId}/proposition`, "POST", body), ctx(adId));
  return { status: response.status, body: (await response.json()) as { error?: string; code?: string } };
}

const ad = (id: string) => tables.adRequest.find((a) => a.id === id)!;
const versions = (id: string) => tables.adVisualVersion.filter((v) => v.adRequestId === id).sort((a, b) => (a.number as number) - (b.number as number));

beforeEach(() => {
  h.uploads = mkdtempSync(join(tmpdir(), "fideto-fiche-"));
  for (const key of Object.keys(tables)) tables[key].length = 0;
  tables.user.push({ id: "admin_1", firstName: "Super", lastName: "Admin", isActive: true });
  asMerchant();
});

afterAll(() => rmSync(h.uploads, { recursive: true, force: true }));

describe("« Valider le visuel tel quel »", () => {
  it("approuve le bandeau du commerçant sans nouvelle image : auteur + date enregistrés, étape suivante ouverte, ni paiement ni diffusion", async () => {
    const banner = await merchantStage("banniere", await dataUrl(800, 800));
    const { adId, campaignId } = await createAd({ visualMode: "SELF", requestedImageUrl: banner.url });
    expect(ad(adId).status).toBe("PENDING_REVIEW");

    asAdmin();
    expect(await moderate(adId, { action: "approve" })).toBe(200); // aucun fichier fourni : le visuel est validé tel quel
    const version = versions(adId)[0];
    expect(version).toMatchObject({ status: "APPROVED", decidedBy: "admin_1", url: banner.url });
    expect(version.decidedAt).toBeInstanceOf(Date);
    expect(versions(adId)).toHaveLength(1); // aucune nouvelle version créée
    expect(ad(adId)).toMatchObject({ status: "APPROVED", finalImageUrl: banner.url, finalVersionId: version.id });
    // Étape suivante rendue accessible au commerçant (notification « prêt pour le paiement »).
    expect(tables.staffNotification.map((n) => n.kind)).toEqual(expect.arrayContaining(["VISUAL_APPROVED", "READY_FOR_PAYMENT"]));
    // Aucun paiement encaissé, aucune diffusion démarrée.
    expect(tables.campaignPayment).toHaveLength(0);
    expect(tables.campaign.find((c) => c.id === campaignId)!.status).not.toBe("SCHEDULED");
    expect(ad(adId).status).not.toMatch(/SCHEDULED|LIVE/);

    // La fiche renvoie l'auteur, la date et la progression (paiement = étape courante).
    const { GET } = await import("../src/app/api/super-admin/visuels/[id]/route");
    const fiche = (await (await GET(jsonReq(`/api/super-admin/visuels/${adId}`, "GET"), ctx(adId))).json()) as {
      people: Record<string, string>;
      journey: { label: string; state: string }[];
      adRequest: { versions: { decidedBy: string }[] };
    };
    expect(fiche.people.admin_1).toBe("Super Admin");
    expect(fiche.journey.map((s) => s.state)).toEqual(["done", "done", "done", "current", "todo"]);
    expect(fiche.adRequest.versions[0].decidedBy).toBe("admin_1");
  });

  it("empêche la double validation (double clic, deux onglets) : une seule approbation", async () => {
    const banner = await merchantStage("banniere", await dataUrl(800, 800));
    const { adId } = await createAd({ visualMode: "SELF", requestedImageUrl: banner.url });
    asAdmin();
    const statuses = await Promise.all([moderate(adId, { action: "approve" }), moderate(adId, { action: "approve" }), moderate(adId, { action: "approve" })]);
    expect(statuses.filter((s) => s === 200)).toHaveLength(1);
    expect(statuses.filter((s) => s === 409)).toHaveLength(2);
    expect(tables.staffNotification.filter((n) => n.kind === "VISUAL_APPROVED")).toHaveLength(1);
    // Et une validation tardive est refusée : transition impossible.
    expect(await moderate(adId, { action: "approve" })).toBe(409);
  });
});

describe("proposition déjà en attente de réponse", () => {
  it("n'est jamais validée à la place du commerçant ; l'envoi en double est refusé", async () => {
    const source = await merchantStage("source", await dataUrl(1600, 900, "jpeg"));
    const { adId } = await createAd({ visualMode: "FIDETO", requestedImageUrls: [source.url] });
    asAdmin();
    const staged = await adminStage(adId, "banniere", await dataUrl(1000, 1000));
    expect((await propose(adId, { url: staged.url })).status).toBe(200);
    expect(ad(adId).status).toBe("AWAITING_MERCHANT");

    // L'admin ne peut pas « valider tel quel » une proposition qui attend le commerçant.
    expect(await moderate(adId, { action: "approve" })).toBe(409);
    expect(ad(adId).status).toBe("AWAITING_MERCHANT");
    expect(ad(adId).finalImageUrl ?? null).toBeNull();
    expect(versions(adId)[0].status).toBe("PROPOSED");

    // Double clic sur « Envoyer » : le même fichier n'est pas renvoyé deux fois.
    const again = await propose(adId, { url: staged.url });
    expect(again.status).toBe(409);
    expect(again.body.code).toBe("ALREADY_PROPOSED");
    expect(versions(adId)).toHaveLength(1);

    // La fiche affiche clairement l'attente (prochaine action côté commerçant, étape 3 courante).
    const { GET } = await import("../src/app/api/super-admin/visuels/[id]/route");
    const fiche = (await (await GET(jsonReq(`/api/super-admin/visuels/${adId}`, "GET"), ctx(adId))).json()) as { nextAction: { actor: string }; journey: { state: string }[] };
    expect(fiche.nextAction.actor).toBe("MERCHANT");
    expect(fiche.journey[2].state).toBe("current");
  });
});

describe("nouvelle version envoyée au commerçant", () => {
  it("remplace la proposition en cours (ancienne conservée), prévient le commerçant, sans toucher au statut de paiement", async () => {
    const banner = await merchantStage("banniere", await dataUrl(800, 800));
    const { adId } = await createAd({ visualMode: "SELF", requestedImageUrl: banner.url });
    asAdmin();
    const first = await adminStage(adId, "banniere", await dataUrl(900, 900, "png", "#2255aa"));
    expect((await propose(adId, { url: first.url })).status).toBe(200);
    const second = await adminStage(adId, "banniere", await dataUrl(1000, 1000, "png", "#22aa55"));
    expect((await propose(adId, { url: second.url })).status).toBe(200);
    expect(versions(adId).map((v) => [v.number, v.author, v.status])).toEqual([
      [1, "MERCHANT", "SUPERSEDED"],
      [2, "FIDETO", "SUPERSEDED"],
      [3, "FIDETO", "PROPOSED"],
    ]);
    expect(ad(adId).status).toBe("AWAITING_MERCHANT");
    expect(tables.staffNotification.filter((n) => n.audience === "MERCHANT").map((n) => n.kind)).toEqual(["BANNER_PROPOSED", "NEW_VERSION_PROPOSED"]);
    expect(tables.campaignPayment).toHaveLength(0);
  });

  it("le recadrage retenu est celui du fichier enregistré : bandeau 800×800 + original conservé en qualité complète", async () => {
    const source = await merchantStage("source", await dataUrl(1200, 700, "jpeg"));
    const { adId } = await createAd({ visualMode: "FIDETO", requestedImageUrls: [source.url] });
    asAdmin();
    // Fichier non carré 1600×900 : le navigateur envoie l'original ET le rendu recadré 800×800.
    const originalData = await dataUrl(1600, 900, "jpeg", "#aa3366");
    const croppedData = await dataUrl(800, 800, "jpeg", "#aa3366");
    const original = await adminStage(adId, "original", originalData);
    const display = await adminStage(adId, "banniere", croppedData);
    expect((await propose(adId, { url: display.url, originalUrl: original.url })).status).toBe(200);

    const version = versions(adId)[0];
    expect(version).toMatchObject({ url: display.url, originalUrl: original.url, reframed: true, width: 800, height: 800 });
    const { GET } = await import("../src/app/api/media/visuels/[merchantId]/[filename]/route");
    const read = async (url: string) => {
      const m = /^\/api\/media\/visuels\/([\w-]+)\/([\w.-]+)$/.exec(url)!;
      const response = await GET(new Request(`http://localhost:3000${url}?telecharger=1`), { params: Promise.resolve({ merchantId: m[1], filename: m[2] }) });
      return Buffer.from(await response.arrayBuffer());
    };
    expect(await sharp(await read(display.url)).metadata()).toMatchObject({ width: 800, height: 800 });
    expect(await sharp(await read(original.url)).metadata()).toMatchObject({ width: 1600, height: 900 });
    // Un bandeau non carré ne peut pas être enregistré comme bandeau (le recadrage est obligatoire).
    const bad = await adminStage(adId, "banniere", originalData);
    expect(bad.url).toBeUndefined();
    void readFileSync;
  });
});

describe("progression", () => {
  it("adJourney suit le statut sans jamais indiquer un paiement ou une diffusion prématurés", () => {
    const states = (status: Parameters<typeof adJourney>[0]["status"], mode: "SELF" | "FIDETO" = "FIDETO") => adJourney({ status, visualMode: mode }).map((s) => s.state);
    expect(states("PENDING_REVIEW")).toEqual(["done", "current", "todo", "todo", "todo"]);
    expect(states("AWAITING_MERCHANT")).toEqual(["done", "done", "current", "todo", "todo"]);
    expect(states("APPROVED")).toEqual(["done", "done", "done", "current", "todo"]);
    expect(states("SCHEDULED")).toEqual(["done", "done", "done", "done", "current"]);
    expect(states("REJECTED")).toEqual(["done", "todo", "todo", "todo", "todo"]);
    expect(adJourney({ status: "PENDING_REVIEW", visualMode: "SELF" })[1].label).toBe("Visuel examiné");
  });
});
