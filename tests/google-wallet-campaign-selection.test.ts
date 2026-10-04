import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeAdDb, merchantInfo } from "./helpers/fake-ad-db";

const fake = createFakeAdDb();
const { tables } = fake;

vi.mock("@/lib/prisma", () => ({ prisma: fake.prisma }));
vi.mock("@/lib/env", () => ({
  env: { googleWalletOrigin: "https://fideto.fr", appUrl: "http://localhost:3000" },
}));

const START = new Date("2026-10-05T09:00:00.000Z");
const END = new Date("2026-10-05T12:00:00.000Z");

beforeEach(() => {
  for (const key of Object.keys(tables)) tables[key].length = 0;
  Object.assign(merchantInfo, { city: "Lyon", postalCode: "69001", isActive: true, status: "ACTIVE", slug: "boulangerie" });
  tables.user.push({ id: "c1", isActive: true });
  tables.customerPreferences.push({
    id: "p1",
    userId: "c1",
    notifyFifeLifeNews: true,
    marketingZoneCity: "Lyon",
    marketingZonePostalCode: "69001",
  });
});

function seedLiveAd(overrides: Record<string, unknown> = {}) {
  tables.campaign.push({ id: "camp1", merchantId: "m1", quotaConsumedAt: new Date() });
  tables.adRequest.push({
    id: "ad1",
    merchantId: "m1",
    campaignId: "camp1",
    status: "LIVE",
    finalImageUrl: "/api/media/visuels/m1/ad1.png",
    requestedText: "-20 % sur le pain",
    ctaLabel: "Découvrir",
    ctaUrl: null,
    startDate: START,
    endDate: END,
    hourlyIntervals: [{ start: START.toISOString(), end: END.toISOString() }],
    fundingMode: "LIVE",
    ...overrides,
  });
}

describe("selectSponsoredForGoogleWalletGlobal", () => {
  it("retourne une campagne éligible sans règle de fréquence in-app", async () => {
    seedLiveAd();
    const { selectSponsoredForGoogleWalletGlobal } = await import("../src/lib/sponsored-selection");
    const during = new Date(START.getTime() + 600_000);
    const mod = await selectSponsoredForGoogleWalletGlobal("c1", during);
    expect(mod).toMatchObject({
      id: "ad1",
      title: "Découvrir",
      description: "-20 % sur le pain",
      detailUri: "https://fideto.fr/c/boulangerie",
      imagePathOrUrl: "",
    });
    expect(tables.adEvent).toHaveLength(0);
    expect(tables.adCustomerView).toHaveLength(0);
  });

  it("expose le hero Wallet bleu validé, pas le bandeau rouge", async () => {
    seedLiveAd({
      finalImageUrl: "/api/media/visuels/m1/banniere-red.png",
      googleWalletVisualStatus: "APPROVED",
      googleWalletHeroUrl: "/api/media/visuels/m1/google-wallet-hero-blue.png",
    });
    const { selectSponsoredForGoogleWalletGlobal } = await import("../src/lib/sponsored-selection");
    const during = new Date(START.getTime() + 600_000);
    const mod = await selectSponsoredForGoogleWalletGlobal("c1", during);
    expect(mod?.imagePathOrUrl).toBe("/api/media/visuels/m1/google-wallet-hero-blue.png");
    expect(mod?.imagePathOrUrl).not.toBe("/api/media/visuels/m1/banniere-red.png");
  });

  it("retourne null hors créneau ou sans audience", async () => {
    seedLiveAd();
    const { selectSponsoredForGoogleWalletGlobal } = await import("../src/lib/sponsored-selection");
    expect(await selectSponsoredForGoogleWalletGlobal("c1", new Date("2026-10-06T00:00:00.000Z"))).toBeNull();
    tables.customerPreferences[0].marketingZoneCity = "Paris";
    tables.customerPreferences[0].marketingZonePostalCode = "75001";
    expect(await selectSponsoredForGoogleWalletGlobal("c1", new Date(START.getTime() + 600_000))).toBeNull();
  });
});
