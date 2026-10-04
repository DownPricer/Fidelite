import { beforeEach, describe, expect, it, vi } from "vitest";

const broadcastFindUnique = vi.fn();
const broadcastUpsert = vi.fn();
const broadcastUpdate = vi.fn();
const broadcastDelete = vi.fn();
const adFindUnique = vi.fn();
const walletCount = vi.fn();
const syncAll = vi.fn();

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
  syncAll.mockResolvedValue({ attempted: 2, synced: 2, failed: 0 });
});

describe("sponsored-test-broadcast", () => {
  it("priorise la diffusion test Wallet avec le hero dédié validé", async () => {
    broadcastFindUnique.mockResolvedValueOnce({
      adRequestId: "ad_test",
      adRequest: {
        ...adRow,
        googleWalletVisualStatus: "APPROVED",
        googleWalletHeroUrl: "https://cdn.example.com/wallet-blue.png",
      },
    });
    const { resolveGlobalWalletCampaignModule } = await import("../src/lib/sponsored-test-broadcast");
    const mod = await resolveGlobalWalletCampaignModule("any-user");
    expect(mod?.title).toBe("Voir");
    expect(mod?.imagePathOrUrl).toBe("https://cdn.example.com/wallet-blue.png");
    const { selectSponsoredForGoogleWalletGlobal } = await import("@/lib/sponsored-selection");
    expect(selectSponsoredForGoogleWalletGlobal).not.toHaveBeenCalled();
  });

  it("n'utilise pas le bandeau finalImageUrl pour le hero Wallet en diffusion test", async () => {
    const { getSponsoredTestBroadcastWalletModule } = await import("../src/lib/sponsored-test-broadcast");
    broadcastFindUnique.mockResolvedValueOnce({
      adRequestId: "ad_test",
      adRequest: adRow,
    });
    expect(await getSponsoredTestBroadcastWalletModule()).toBeNull();
  });

  it("active la diffusion et synchronise toutes les cartes globales", async () => {
    adFindUnique.mockResolvedValueOnce(adRow);
    broadcastUpsert.mockResolvedValueOnce({});
    broadcastUpdate.mockResolvedValueOnce({});
    const { startSponsoredTestBroadcast } = await import("../src/lib/sponsored-test-broadcast");
    const result = await startSponsoredTestBroadcast({ adRequestId: "ad_test", startedById: "admin" });
    expect(broadcastUpsert).toHaveBeenCalled();
    expect(syncAll).toHaveBeenCalledWith({ clearCampaignModule: false });
    expect(result.googleSync.synced).toBe(2);
  });

  it("arrête seulement la campagne concernée et retire l'encart", async () => {
    broadcastFindUnique.mockResolvedValueOnce({ adRequestId: "ad_test" });
    broadcastDelete.mockResolvedValueOnce({});
    const { stopSponsoredTestBroadcast } = await import("../src/lib/sponsored-test-broadcast");
    const result = await stopSponsoredTestBroadcast({ adRequestId: "ad_test" });
    expect(result.stopped).toBe(true);
    expect(syncAll).toHaveBeenCalledWith({ clearCampaignModule: true });
    broadcastFindUnique.mockResolvedValueOnce({ adRequestId: "other" });
    const noop = await stopSponsoredTestBroadcast({ adRequestId: "ad_test" });
    expect(noop.stopped).toBe(false);
  });

});
