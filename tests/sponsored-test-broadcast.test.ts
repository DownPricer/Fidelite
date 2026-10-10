import { beforeEach, describe, expect, it, vi } from "vitest";

const broadcastFindUnique = vi.fn();
const broadcastUpsert = vi.fn();
const broadcastUpdate = vi.fn();
const broadcastDelete = vi.fn();
const adFindUnique = vi.fn();
const walletCount = vi.fn();
const syncAll = vi.fn();

const userCount = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    sponsoredAdTestBroadcast: {
      findUnique: (...args: unknown[]) => broadcastFindUnique(...args),
      upsert: (...args: unknown[]) => broadcastUpsert(...args),
      update: (...args: unknown[]) => broadcastUpdate(...args),
      delete: (...args: unknown[]) => broadcastDelete(...args),
    },
    adRequest: { findUnique: (...args: unknown[]) => adFindUnique(...args) },
    googleWalletObject: { count: (...args: unknown[]) => walletCount(...args) },
    user: { count: (...args: unknown[]) => userCount(...args) },
  },
}));

vi.mock("@/lib/env", () => ({
  env: { googleWalletOrigin: "https://fideto.fr" },
  isGoogleWalletConfigured: () => true,
}));

vi.mock("@/lib/sponsored-selection", () => ({
  selectSponsoredForGoogleWalletGlobal: vi.fn(async () => ({
    id: "live-ad",
    title: "Live",
    description: "x",
    imagePathOrUrl: "https://cdn.example.com/l.png",
    detailUri: "https://fideto.fr/c/x",
  })),
}));

vi.mock("@/lib/google-wallet", async () => {
  const actual = await vi.importActual<typeof import("../src/lib/google-wallet")>("../src/lib/google-wallet");
  return {
    ...actual,
    syncAllGoogleWalletGlobalObjects: (...args: unknown[]) => syncAll(...args),
    publicGoogleWalletError: (e: unknown) => (e instanceof Error ? e.message : "err"),
  };
});

const adRow = {
  id: "ad_test",
  requestedText: "Promo test",
  ctaLabel: "Voir",
  ctaUrl: null,
  finalImageUrl: "https://cdn.example.com/banner.png",
  requestedImageUrl: null,
  merchant: { name: "Boulangerie", slug: "boulangerie", logoUrl: null },
  versions: [],
};

beforeEach(() => {
  vi.clearAllMocks();
  walletCount.mockResolvedValue(2);
  userCount.mockResolvedValue(5);
  syncAll.mockResolvedValue({ attempted: 2, synced: 2, failed: 0, verified: 2 });
});

describe("sponsored-test-broadcast", () => {
  it("campagne Stripe TEST + diffusion test → hero Wallet dédié, jamais le bandeau", async () => {
    broadcastFindUnique.mockResolvedValueOnce({
      adRequestId: "ad_test",
      adRequest: {
        ...adRow,
        status: "DRAFT",
        fundingMode: "TEST",
        finalImageUrl: "https://cdn.example.com/banniere-bordeaux.png",
        googleWalletVisualStatus: "APPROVED",
        googleWalletHeroUrl: "/api/media/visuels/m1/google-wallet-hero-test.png",
      },
    });
    const { resolveGlobalWalletCampaignModule } = await import("../src/lib/sponsored-test-broadcast");
    const mod = await resolveGlobalWalletCampaignModule("any-user");
    expect(mod?.imagePathOrUrl).toBe("https://fideto.fr/api/media/visuels/m1/google-wallet-hero-test.png");
    expect(mod?.imagePathOrUrl).not.toContain("banniere");
  });

  it("priorise la diffusion test Wallet avec le hero dédié validé", async () => {
    broadcastFindUnique.mockResolvedValueOnce({
      adRequestId: "ad_test",
      adRequest: {
        ...adRow,
        googleWalletVisualStatus: "APPROVED",
        googleWalletHeroUrl: "https://fideto.fr/api/media/visuels/m1/google-wallet-hero-blue.png",
      },
    });
    const { resolveGlobalWalletCampaignModule } = await import("../src/lib/sponsored-test-broadcast");
    const mod = await resolveGlobalWalletCampaignModule("any-user");
    expect(mod?.title).toBe("Voir");
    expect(mod?.imagePathOrUrl).toBe("https://fideto.fr/api/media/visuels/m1/google-wallet-hero-blue.png");
    const { selectSponsoredForGoogleWalletGlobal } = await import("@/lib/sponsored-selection");
    expect(selectSponsoredForGoogleWalletGlobal).not.toHaveBeenCalled();
  });

  it("n'utilise pas le bandeau finalImageUrl pour le hero Wallet en diffusion test", async () => {
    const { getSponsoredTestBroadcastWalletModule } = await import("../src/lib/sponsored-test-broadcast");
    broadcastFindUnique.mockResolvedValueOnce({
      adRequestId: "ad_test",
      adRequest: adRow,
    });
    const mod = await getSponsoredTestBroadcastWalletModule();
    expect(mod?.imagePathOrUrl).toBe("");
    expect(mod?.imagePathOrUrl).not.toBe(adRow.finalImageUrl);
  });

  it("ne bascule pas sur une campagne LIVE quand la diffusion test est active sans hero", async () => {
    broadcastFindUnique.mockResolvedValueOnce({
      adRequestId: "ad_test",
      adRequest: adRow,
    });
    const { resolveGlobalWalletCampaignModule } = await import("../src/lib/sponsored-test-broadcast");
    const mod = await resolveGlobalWalletCampaignModule("any-user");
    expect(mod?.imagePathOrUrl).toBe("");
    const { selectSponsoredForGoogleWalletGlobal } = await import("@/lib/sponsored-selection");
    expect(selectSponsoredForGoogleWalletGlobal).not.toHaveBeenCalled();
  });

  it("active la diffusion et synchronise toutes les cartes globales", async () => {
    adFindUnique.mockResolvedValueOnce({
      ...adRow,
      googleWalletVisualStatus: "APPROVED",
      googleWalletHeroUrl: "https://fideto.fr/api/media/visuels/m1/google-wallet-hero-blue.png",
      finalImageUrl: "https://cdn.example.com/banner.png",
    });
    broadcastUpsert.mockResolvedValueOnce({});
    broadcastUpdate.mockResolvedValueOnce({});
    const { startSponsoredTestBroadcast } = await import("../src/lib/sponsored-test-broadcast");
    const result = await startSponsoredTestBroadcast({ adRequestId: "ad_test", startedById: "admin" });
    expect(broadcastUpsert).toHaveBeenCalled();
    expect(syncAll).toHaveBeenCalledWith({
      clearCampaignModule: false,
      verifyRemoteHero: "dedicated-wallet-hero",
    });
    expect(result.googleSync.synced).toBe(2);
  });

  it("arrête seulement la campagne concernée et retire l'encart", async () => {
    broadcastFindUnique.mockResolvedValueOnce({ adRequestId: "ad_test" });
    broadcastDelete.mockResolvedValueOnce({});
    const { stopSponsoredTestBroadcast } = await import("../src/lib/sponsored-test-broadcast");
    const result = await stopSponsoredTestBroadcast({ adRequestId: "ad_test" });
    expect(result.stopped).toBe(true);
    expect(syncAll).toHaveBeenCalledWith({
      clearCampaignModule: true,
      verifyRemoteHero: "no-dedicated-wallet-hero",
    });
    broadcastFindUnique.mockResolvedValueOnce({ adRequestId: "other" });
    const noop = await stopSponsoredTestBroadcast({ adRequestId: "ad_test" });
    expect(noop.stopped).toBe(false);
  });

  it("expose le statut admin complet pour l'avertissement diffusion test", async () => {
    broadcastFindUnique.mockResolvedValueOnce({
      adRequestId: "ad_test",
      startedAt: new Date("2026-10-10T12:00:00.000Z"),
      lastGoogleSyncOk: true,
      lastGoogleSyncError: null,
      lastGoogleSyncAt: new Date("2026-10-10T12:01:00.000Z"),
      googleObjectsSynced: 2,
      googleObjectsFailed: 0,
      googleObjectsTotal: 2,
      adRequest: adRow,
    });
    const { getSponsoredTestBroadcastAdminStatus } = await import("../src/lib/sponsored-test-broadcast");
    const status = await getSponsoredTestBroadcastAdminStatus("ad_test");
    expect(status).toMatchObject({
      active: true,
      adRequestId: "ad_test",
      campaignLabel: "Voir",
      affectedAccountsCount: 5,
      globalWalletObjectsCount: 2,
      googleObjectsSynced: 2,
      googleObjectsFailed: 0,
      googleObjectsTotal: 2,
    });
    expect(userCount).toHaveBeenCalledWith({ where: { platformRole: "CUSTOMER", isActive: true } });
    expect(walletCount).toHaveBeenCalledWith({ where: { merchantId: null, customerMembershipId: null } });
  });

});
