import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeAdDb, merchantInfo } from "./helpers/fake-ad-db";

/**
 * Aperçu mobile d'une campagne (surtout simulée/test) dans ses vrais emplacements : réservé au
 * commerçant de la campagne ou au super-admin, jamais diffusé aux autres, aucune impression comptée.
 */

const h = vi.hoisted(() => ({ session: { customer: null as string | null, admin: false, staffOf: [] as string[] } }));
const fake = createFakeAdDb();
const { tables } = fake;

vi.mock("@/lib/prisma", () => ({ prisma: fake.prisma }));
vi.mock("@/lib/env", () => ({ env: { appUrl: "http://localhost:3000" } }));
vi.mock("@/lib/api-guard", () => ({
  requireMutatingRequest: async () => ({ error: null }),
  requireSuperAdmin: async () => (h.session.admin ? { error: null, user: { id: "admin_1" } } : { error: new Response(null, { status: 401 }), user: null }),
  requireUser: async () => (h.session.customer ? { error: null, user: { id: h.session.customer } } : { error: new Response(null, { status: 401 }), user: null }),
  staffContext: (_user: unknown, merchantId: string) =>
    h.session.staffOf.includes(merchantId) ? { merchantId, role: "MERCHANT_ADMIN", isActive: true } : null,
}));

const START = new Date("2026-10-05T09:00:00.000Z");
const END = new Date("2026-10-05T12:00:00.000Z");

function seed(overrides: Record<string, unknown> = {}) {
  tables.campaign.push({ id: "camp1", merchantId: "m1", quotaConsumedAt: new Date() });
  tables.adRequest.push({
    id: "ad1", merchantId: "m1", campaignId: "camp1", status: "SCHEDULED", finalImageUrl: "/api/media/visuels/m1/ad1.png",
    requestedText: "-20 % sur le pain", ctaLabel: "Voir", ctaUrl: "https://boulangerie.example", startDate: START, endDate: END,
    hourlyIntervals: [{ start: START.toISOString(), end: END.toISOString() }], fundingMode: "TEST", ...overrides,
  });
}

async function previewCall(placement = "WALLET_HOME", id = "ad1") {
  const { GET } = await import("../src/app/api/customer/sponsored/route");
  const response = await GET(new Request(`http://localhost:3000/api/customer/sponsored?placement=${placement}&preview=${id}`));
  return { status: response.status, body: (await response.json()) as { ad?: Record<string, unknown>; preview?: boolean; simulated?: boolean; error?: string } };
}

beforeEach(() => {
  for (const key of Object.keys(tables)) tables[key].length = 0;
  Object.assign(merchantInfo, { city: "Lyon", postalCode: "69001", isActive: true, status: "ACTIVE" });
  tables.user.push({ id: "owner", isActive: true }, { id: "stranger", isActive: true }, { id: "c1", isActive: true });
  h.session = { customer: null, admin: false, staffOf: [] };
  vi.useRealTimers();
});

describe("aperçu d'une campagne de test (simulée) dans ses vrais emplacements", () => {
  it("le commerçant de la campagne la voit sur les trois emplacements, signalée simulée, sans impression ni historique client", async () => {
    seed();
    h.session = { customer: "owner", admin: false, staffOf: ["m1"] };
    for (const placement of ["WALLET_HOME", "SEARCH", "NOTIFICATIONS"]) {
      const { status, body } = await previewCall(placement);
      expect(status).toBe(200);
      expect(body).toMatchObject({ preview: true, simulated: true });
      expect(body.ad).toMatchObject({ id: "ad1", placement, imageUrl: "/api/media/visuels/m1/ad1.png", impressionUrl: null, clickUrl: "#" });
    }
    // Aucune impression, aucun clic, aucun historique de fréquence : un aperçu ne compte jamais.
    expect(tables.adEvent).toHaveLength(0);
    expect(tables.adCustomerView).toHaveLength(0);
  });

  it("le super-admin la voit aussi (même hors audience, hors créneau, en simulation)", async () => {
    seed({ status: "APPROVED" });
    h.session = { customer: null, admin: true, staffOf: [] };
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-12-24T03:00:00.000Z")); // loin de tout créneau
    const { status, body } = await previewCall();
    expect(status).toBe(200);
    expect(body.simulated).toBe(true);
  });

  it("réservé : un autre commerçant, un simple client ou un visiteur ne reçoivent rien (403)", async () => {
    seed();
    h.session = { customer: "stranger", admin: false, staffOf: ["m2"] }; // administrateur d'un AUTRE commerce
    expect((await previewCall()).status).toBe(403);
    h.session = { customer: "c1", admin: false, staffOf: [] }; // simple client
    expect((await previewCall()).status).toBe(403);
    h.session = { customer: null, admin: false, staffOf: [] }; // visiteur
    expect((await previewCall()).status).toBe(403);
    expect(tables.adEvent).toHaveLength(0);
  });

  it("l'aperçu ne diffuse rien aux autres : un client éligible ne voit toujours pas la campagne de test", async () => {
    seed();
    tables.customerPreferences.push({ id: "p1", userId: "c1", notifyFifeLifeNews: true, marketingZoneCity: "Lyon", marketingZonePostalCode: "69001" });
    h.session = { customer: "owner", admin: false, staffOf: ["m1"] };
    await previewCall();
    const { selectSponsoredWithReason } = await import("../src/lib/sponsored-selection");
    const during = new Date(START.getTime() + 600_000);
    const result = await selectSponsoredWithReason({ userId: "c1", placement: "WALLET_HOME", now: during });
    expect(result.card).toBeNull();
  });

  it("campagne sans visuel : aperçu indisponible (404), placement invalide refusé", async () => {
    seed({ finalImageUrl: null });
    h.session = { customer: "owner", admin: false, staffOf: ["m1"] };
    expect((await previewCall()).status).toBe(404);
    expect((await previewCall("BANNER")).status).toBe(400);
  });
});
