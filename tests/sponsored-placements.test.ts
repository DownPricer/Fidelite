import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeAdDb, merchantInfo } from "./helpers/fake-ad-db";

/**
 * Emplacements clients des mises en avant (accueil Wallet, recherche, notifications) : mêmes règles
 * serveur partout, impressions par placement sans doublon, clics vers le lien approuvé, fréquence.
 */

const h = vi.hoisted(() => ({ customer: "c1" as string | null }));
const fake = createFakeAdDb();
const { tables } = fake;

vi.mock("@/lib/prisma", () => ({ prisma: fake.prisma }));
vi.mock("@/lib/env", () => ({ env: { appUrl: "http://localhost:3000" } }));
vi.mock("@/lib/api-guard", () => ({
  requireMutatingRequest: async () => ({ error: null }),
  requireUser: async () =>
    h.customer ? { error: null, user: { id: h.customer } } : { error: new Response(null, { status: 401 }), user: null },
}));

const START = new Date("2026-10-05T09:00:00.000Z");
const END = new Date("2026-10-05T12:00:00.000Z");
const PLACEMENTS = ["WALLET_HOME", "SEARCH", "NOTIFICATIONS"] as const;

function seedAd(id: string, overrides: Record<string, unknown> = {}, paid = true) {
  const campaignId = `camp_${id}`;
  tables.campaign.push({ id: campaignId, merchantId: "m1", quotaConsumedAt: null });
  if (paid) tables.campaignPayment.push({ id: `pay_${id}`, campaignId, status: "PAID" });
  tables.adRequest.push({
    id,
    merchantId: "m1",
    campaignId,
    status: "SCHEDULED",
    finalImageUrl: `/api/media/visuels/m1/${id}.png`,
    requestedText: `Offre ${id}`,
    ctaLabel: "Voir",
    ctaUrl: `https://boulangerie.example/${id}`,
    startDate: START,
    endDate: END,
    hourlyIntervals: [{ start: START.toISOString(), end: END.toISOString() }],
    fundingMode: "LIVE",
    ...overrides,
  });
}

function setNow(iso: string | number) {
  vi.setSystemTime(typeof iso === "number" ? iso : new Date(iso));
}

async function get(placement: string, user = "c1") {
  h.customer = user;
  const { GET } = await import("../src/app/api/customer/sponsored/route");
  const response = await GET(new Request(`http://localhost:3000/api/customer/sponsored?placement=${placement}`));
  return { status: response.status, ad: ((await response.json()) as { ad: { id: string; imageUrl: string; clickUrl: string; impressionUrl: string } | null }).ad };
}

/** Balaye des tranches de 10 min (tirage « occasionnel » déterministe) jusqu'à obtenir un bandeau. */
async function getWhenOpen(placement: string, user = "c1", from = START.getTime() + 60_000) {
  for (let k = 0; k < 12; k += 1) {
    setNow(from + k * 600_000);
    const result = await get(placement, user);
    if (result.ad) return result;
  }
  return { status: 200, ad: null };
}

async function impress(adId: string, placement: string, user = "c1") {
  h.customer = user;
  const { POST } = await import("../src/app/api/customer/sponsored/[id]/impression/route");
  const response = await POST(
    new Request(`http://localhost:3000/api/customer/sponsored/${adId}/impression`, {
      method: "POST",
      headers: { "Content-Type": "application/json", origin: "http://localhost:3000" },
      body: JSON.stringify({ placement }),
    }),
    { params: Promise.resolve({ id: adId }) },
  );
  return { status: response.status, body: (await response.json()) as { counted?: boolean } };
}

async function click(adId: string, placement: string, user = "c1") {
  h.customer = user;
  const { GET } = await import("../src/app/api/customer/sponsored/[id]/ouvrir/route");
  return GET(new Request(`http://localhost:3000/api/customer/sponsored/${adId}/ouvrir?placement=${placement}`), { params: Promise.resolve({ id: adId }) });
}

const events = () => tables.adEvent;

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  setNow(START.getTime() + 30 * 60_000);
  for (const key of Object.keys(tables)) tables[key].length = 0;
  Object.assign(merchantInfo, { city: "Lyon", postalCode: "69001", isActive: true, status: "ACTIVE" });
  tables.user.push({ id: "c1", isActive: true }, { id: "c2", isActive: true }, { id: "c3", isActive: true });
  tables.customerPreferences.push(
    { id: "p1", userId: "c1", notifyFifeLifeNews: true, marketingZoneCity: "Lyon", marketingZonePostalCode: "69001" },
    { id: "p2", userId: "c2", notifyFifeLifeNews: true, marketingZoneCity: "Paris", marketingZonePostalCode: "75001" }, // hors secteur
    { id: "p3", userId: "c3", notifyFifeLifeNews: false, marketingZoneCity: "Lyon", marketingZonePostalCode: "69001" }, // sans consentement
  );
  h.customer = "c1";
});

describe("même campagne, trois emplacements, mêmes vérifications serveur", () => {
  it.each(PLACEMENTS)("%s : la campagne active, payée et dans son créneau est proposée avec le visuel final", async (placement) => {
    seedAd("ad1");
    const { ad } = await getWhenOpen(placement);
    expect(ad).not.toBeNull();
    expect(ad!.imageUrl).toBe("http://localhost:3000/api/media/visuels/m1/ad1.png");
    expect(ad!.clickUrl).toContain(`placement=${placement}`);
  });

  it.each(PLACEMENTS)("%s : rien hors créneau, après suspension, impayée, test, hors audience ni sans consentement", async (placement) => {
    // Hors créneau (même si le statut stocké est encore LIVE : le worker peut être en retard).
    seedAd("late", { status: "LIVE" });
    expect((await getWhenOpen(placement, "c1", END.getTime() + 3_600_000)).ad).toBeNull();
    expect((await getWhenOpen(placement, "c1", START.getTime() - 5 * 3_600_000)).ad).toBeNull();
    // Dans le créneau : visible…
    expect((await getWhenOpen(placement)).ad?.id).toBe("late");
    // …puis suspendue : disparaît immédiatement.
    tables.adRequest[0].status = "SUSPENDED";
    expect((await getWhenOpen(placement)).ad).toBeNull();
    tables.adRequest[0].status = "STOPPED";
    expect((await getWhenOpen(placement)).ad).toBeNull();
    tables.adRequest[0].status = "LIVE";
    expect((await getWhenOpen(placement)).ad?.id).toBe("late");
    // Client hors audience (autre zone) ou sans consentement aux bons plans : jamais.
    expect((await getWhenOpen(placement, "c2")).ad).toBeNull();
    expect((await getWhenOpen(placement, "c3")).ad).toBeNull();
    // Commerce désactivé.
    merchantInfo.isActive = false;
    expect((await getWhenOpen(placement)).ad).toBeNull();
    merchantInfo.isActive = true;
    // Visiteur non connecté.
    h.customer = null;
    const { GET } = await import("../src/app/api/customer/sponsored/route");
    expect((await GET(new Request(`http://localhost:3000/api/customer/sponsored?placement=${placement}`))).status).toBe(401);
  });

  it("campagne non payée, payée en mode test ou sans visuel final : jamais proposée", async () => {
    seedAd("unpaid", {}, false);
    seedAd("test", { fundingMode: "TEST" });
    seedAd("novisual", { finalImageUrl: null });
    tables.campaign.find((c) => c.id === "camp_unpaid")!.quotaConsumedAt = null;
    expect((await getWhenOpen("WALLET_HOME")).ad).toBeNull();
    // Jours couverts par le quota inclus = financée.
    seedAd("quota", {}, false);
    tables.campaign.find((c) => c.id === "camp_quota")!.quotaConsumedAt = new Date();
    expect((await getWhenOpen("WALLET_HOME")).ad?.id).toBe("quota");
  });

  it("placement inconnu refusé", async () => {
    seedAd("ad1");
    expect((await get("BANNER")).status).toBe(400);
  });
});

describe("impressions : placement d'origine, aperçus exclus, sans doublon", () => {
  it("la sélection et l'aperçu ne comptent pas ; l'impression enregistre le placement", async () => {
    seedAd("ad1");
    const shown = await getWhenOpen("SEARCH");
    expect(shown.ad).not.toBeNull();
    expect(events()).toHaveLength(0); // sélection seule : aucune impression
    expect((await impress("ad1", "SEARCH")).body.counted).toBe(true);
    expect(events()).toEqual([expect.objectContaining({ adRequestId: "ad1", type: "IMPRESSION", placement: "SEARCH" })]);
  });

  it("les aperçus super-admin/commerçant n'appellent jamais l'API d'impression", async () => {
    const { readFileSync } = await import("fs");
    for (const file of ["src/components/ad-visual-parts.tsx", "src/app/super-admin/campagnes/fiche/[id]/ad-detail.tsx", "src/app/app/campagnes/[id]/fiche.tsx"]) {
      expect(readFileSync(file, "utf8")).not.toMatch(/sponsored\/.*impression|impressionUrl\s*[:=]\s*[`"']\/api/);
    }
  });

  it("des appels répétés (rendus React, onglets, requêtes simultanées) ne comptent qu'une impression", async () => {
    seedAd("ad1");
    const results = await Promise.all([1, 2, 3, 4, 5].map(() => impress("ad1", "WALLET_HOME")));
    expect(results.filter((r) => r.body.counted).length).toBe(1);
    expect(events().filter((e) => e.type === "IMPRESSION")).toHaveLength(1);
    // Autre emplacement dans la fenêtre de 10 min : toujours la même impression (pas de double comptage).
    expect((await impress("ad1", "NOTIFICATIONS")).body.counted).toBe(false);
    // Après la fenêtre : un nouvel affichage compte, avec son propre placement.
    setNow(Date.now() + 11 * 60_000);
    expect((await impress("ad1", "NOTIFICATIONS")).body.counted).toBe(true);
    expect(events().map((e) => e.placement)).toEqual(["WALLET_HOME", "NOTIFICATIONS"]);
  });

  it("aucune impression hors créneau, suspendue, hors audience ou sans connexion", async () => {
    seedAd("ad1");
    setNow(END.getTime() + 60_000);
    expect((await impress("ad1", "SEARCH")).status).toBe(404);
    setNow(START.getTime() + 60_000);
    tables.adRequest[0].status = "SUSPENDED";
    expect((await impress("ad1", "SEARCH")).status).toBe(404);
    tables.adRequest[0].status = "SCHEDULED";
    expect((await impress("ad1", "SEARCH", "c2")).status).toBe(404);
    h.customer = null;
    const { POST } = await import("../src/app/api/customer/sponsored/[id]/impression/route");
    const anonymous = await POST(
      new Request("http://x/api/customer/sponsored/ad1/impression", { method: "POST", headers: { origin: "http://localhost:3000" }, body: JSON.stringify({ placement: "SEARCH" }) }),
      { params: Promise.resolve({ id: "ad1" }) },
    );
    expect(anonymous.status).toBe(401);
    expect(events()).toHaveLength(0);
  });

  it("les statistiques distinguent accueil Wallet, recherche et notifications", async () => {
    seedAd("ad1");
    await impress("ad1", "WALLET_HOME");
    setNow(Date.now() + 11 * 60_000);
    await impress("ad1", "SEARCH");
    setNow(Date.now() + 11 * 60_000);
    await impress("ad1", "NOTIFICATIONS");
    await click("ad1", "NOTIFICATIONS");
    const { getAdStats } = await import("../src/lib/ad-stats");
    const stats = await getAdStats("ad1");
    expect(stats.totalImpressions).toBe(3);
    expect(Object.fromEntries(stats.byPlacement.map((p) => [p.placement, [p.impressions, p.clicks]]))).toEqual({
      WALLET_HOME: [1, 0],
      SEARCH: [1, 0],
      NOTIFICATIONS: [1, 1],
    });
  });
});

describe("clics", () => {
  it("compte le clic avec son placement et ouvre le lien approuvé de la campagne", async () => {
    seedAd("ad1");
    const response = await click("ad1", "WALLET_HOME");
    expect(response.headers.get("location")).toBe("https://boulangerie.example/ad1");
    expect(events()).toEqual([expect.objectContaining({ type: "CLICK", placement: "WALLET_HOME" })]);
  });

  it("sans lien approuvé : page du commerce ; hors créneau : retour à la recherche sans compter", async () => {
    seedAd("ad1", { ctaUrl: null });
    expect((await click("ad1", "SEARCH")).headers.get("location")).toBe("http://localhost:3000/c/boulangerie");
    setNow(END.getTime() + 60_000);
    expect((await click("ad1", "SEARCH")).headers.get("location")).toBe("http://localhost:3000/decouvrir");
    expect(events()).toHaveLength(1);
  });
});

describe("fréquence et rotation", () => {
  it("occasionnel : jamais à chaque ouverture de page, mais pas jamais non plus", async () => {
    seedAd("ad1");
    let shown = 0;
    for (let k = 0; k < 18; k += 1) {
      setNow(START.getTime() + k * 600_000 + 1000);
      if ((await get("WALLET_HOME")).ad) shown += 1;
    }
    expect(shown).toBeGreaterThan(0);
    expect(shown).toBeLessThan(18);
    // Stable pendant un rechargement rapide (même tranche de 10 min).
    setNow(START.getTime() + 5000);
    const first = (await get("SEARCH")).ad !== null;
    setNow(START.getTime() + 15_000);
    expect((await get("SEARCH")).ad !== null).toBe(first);
  });

  it("au plus un bandeau toutes les 30 min tous emplacements confondus ; même campagne pas avant 2 h", async () => {
    seedAd("ad1");
    const open = await getWhenOpen("WALLET_HOME");
    const t0 = Date.now();
    await impress("ad1", "WALLET_HOME");
    for (const placement of PLACEMENTS) {
      setNow(t0 + 10 * 60_000);
      expect((await get(placement)).ad).toBeNull(); // dans les 30 min
    }
    expect(open.ad).not.toBeNull();
    // Campagne longue pour que le créneau couvre toute la période de test.
    tables.adRequest[0].endDate = new Date(t0 + 3 * 86_400_000);
    tables.adRequest[0].hourlyIntervals = [{ start: START.toISOString(), end: new Date(t0 + 3 * 86_400_000).toISOString() }];
    // Après 30 min mais avant 2 h : la même campagne n'est pas re-proposée (quel que soit le tirage).
    for (let k = 0; k < 8; k += 1) {
      setNow(t0 + 40 * 60_000 + k * 600_000);
      expect((await get("SEARCH")).ad).toBeNull();
    }
    // Au-delà de 2 h elle redevient éligible : une prochaine ouverture peut la ré-afficher.
    expect((await getWhenOpen("SEARCH", "c1", t0 + 125 * 60_000)).ad?.id).toBe("ad1");
  });

  it("plusieurs campagnes éligibles : elles tournent (la moins récemment vue d'abord)", async () => {
    seedAd("adA");
    seedAd("adB");
    const seen: string[] = [];
    let from = START.getTime() + 60_000;
    for (let round = 0; round < 2; round += 1) {
      const result = await getWhenOpen("WALLET_HOME", "c1", from);
      expect(result.ad).not.toBeNull();
      seen.push(result.ad!.id);
      await impress(result.ad!.id, "WALLET_HOME");
      from = Date.now() + 31 * 60_000;
    }
    expect(new Set(seen).size).toBe(2);
  });
});

describe("diffusion test globale super-admin", () => {
  it("priorise la campagne test sur tous les comptes sans impression ni clic facturables", async () => {
    seedAd("ad_live");
    seedAd("ad_test", { fundingMode: "TEST" }, false);
    tables.sponsoredAdTestBroadcast.push({
      id: "global",
      adRequestId: "ad_test",
      startedAt: new Date(),
      googleObjectsSynced: 0,
      googleObjectsFailed: 0,
      googleObjectsTotal: 0,
    });
    for (const user of ["c1", "c2", "c3"] as const) {
      const { ad } = await get("SEARCH", user);
      expect(ad?.id).toBe("ad_test");
      expect(ad!.clickUrl).toBe("#");
      expect(ad!.impressionUrl).toBeNull();
    }
    const imp = await impress("ad_test", "SEARCH");
    expect(imp.body.counted).toBe(false);
    expect(events()).toHaveLength(0);
    await click("ad_test", "SEARCH");
    expect(events()).toHaveLength(0);
  });
});

describe("cartes intégrées : ni notification, ni push, ni e-mail", () => {
  it("sélectionner et afficher un bandeau ne crée aucune notification", async () => {
    seedAd("ad1");
    await getWhenOpen("NOTIFICATIONS");
    await impress("ad1", "NOTIFICATIONS");
    expect(tables.staffNotification).toHaveLength(0);
    const { readFileSync } = await import("fs");
    const source = readFileSync("src/lib/sponsored-selection.ts", "utf8") + readFileSync("src/app/api/customer/sponsored/route.ts", "utf8");
    expect(source).not.toMatch(/inAppNotification|webpush|web-push|sendMail|nodemailer/);
  });

  it("les vraies notifications restent distinctes : l'emplacement est une carte à part dans le centre de notifications", async () => {
    const { readFileSync } = await import("fs");
    const center = readFileSync("src/components/fife-life/notifications-center.tsx", "utf8");
    expect(center).toContain('<SponsoredSlot placement="NOTIFICATIONS"');
    const sheet = readFileSync("src/components/fife-life/cards-sheet.tsx", "utf8");
    expect(sheet).toContain('placement="WALLET_HOME"');
    expect(sheet.indexOf("WalletCardsList")).toBeLessThan(sheet.indexOf('placement="WALLET_HOME"'));
    const home = readFileSync("src/components/fife-life/wallet-home.tsx", "utf8");
    expect(home).not.toContain("WalletBottomNav");
    expect(home).toContain("wallet-chevron-sponsored-badge");
    expect(readFileSync("src/components/fife-life/discover-page.tsx", "utf8")).toContain('placement="SEARCH"');
  });
});
