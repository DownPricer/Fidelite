import { beforeEach, describe, expect, it, vi } from "vitest";

const previewFindUnique = vi.fn();
const previewUpsert = vi.fn();
const previewUpdate = vi.fn();
const previewDeleteMany = vi.fn();
const previewFindMany = vi.fn();
const adFindUnique = vi.fn();
const walletFindFirst = vi.fn();
const syncGlobal = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    googleWalletGlobalAdPreview: {
      findUnique: (...args: unknown[]) => previewFindUnique(...args),
      upsert: (...args: unknown[]) => previewUpsert(...args),
      update: (...args: unknown[]) => previewUpdate(...args),
      deleteMany: (...args: unknown[]) => previewDeleteMany(...args),
      findMany: (...args: unknown[]) => previewFindMany(...args),
    },
    adRequest: { findUnique: (...args: unknown[]) => adFindUnique(...args) },
    googleWalletObject: { findFirst: (...args: unknown[]) => walletFindFirst(...args) },
  },
}));

vi.mock("@/lib/env", () => ({
  env: { qaCustomerUserId: "qa-customer", googleWalletOrigin: "https://fideto.fr" },
  isGoogleWalletConfigured: () => true,
}));

vi.mock("@/lib/sponsored-selection", () => ({
  selectSponsoredForGoogleWalletGlobal: vi.fn(async () => ({ id: "live-ad", title: "Live", description: "x", imagePathOrUrl: "https://cdn.example.com/l.png", detailUri: "https://fideto.fr/c/x" })),
}));

vi.mock("@/lib/google-wallet", async () => {
  const actual = await vi.importActual<typeof import("../src/lib/google-wallet")>("../src/lib/google-wallet");
  return {
    ...actual,
    syncGoogleWalletGlobalObject: (...args: unknown[]) => syncGlobal(...args),
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
  merchant: { name: "Boulangerie", slug: "boulangerie" },
  versions: [],
};

beforeEach(() => {
  vi.clearAllMocks();
  previewFindMany.mockResolvedValue([]);
  previewDeleteMany.mockResolvedValue({ count: 0 });
  walletFindFirst.mockResolvedValue({ id: "gw1" });
});

describe("google-wallet-global-preview", () => {
  it("priorise l'aperçu QA sur la sélection live", async () => {
    previewFindUnique.mockResolvedValueOnce({
      expiresAt: new Date(Date.now() + 60_000),
      adRequest: adRow,
    });
    const { resolveGlobalWalletCampaignModule } = await import("../src/lib/google-wallet-global-preview");
    const mod = await resolveGlobalWalletCampaignModule("qa-customer");
    expect(mod?.title).toBe("Voir");
    expect(mod?.imagePathOrUrl).toBe("https://cdn.example.com/banner.png");
    const { selectSponsoredForGoogleWalletGlobal } = await import("@/lib/sponsored-selection");
    expect(selectSponsoredForGoogleWalletGlobal).not.toHaveBeenCalled();
  });

  it("expire l'aperçu et resynchronise avec retrait d'encart", async () => {
    previewDeleteMany.mockResolvedValueOnce({ count: 1 });
    const { expireGoogleWalletGlobalAdPreview } = await import("../src/lib/google-wallet-global-preview");
    await expireGoogleWalletGlobalAdPreview("qa-customer");
    expect(syncGlobal).toHaveBeenCalledWith("qa-customer", { clearCampaignModule: true });
  });

  it("refuse le démarrage sans objet Wallet global", async () => {
    adFindUnique.mockResolvedValueOnce(adRow);
    walletFindFirst.mockResolvedValueOnce(null);
    const { startGoogleWalletGlobalAdPreview } = await import("../src/lib/google-wallet-global-preview");
    const result = await startGoogleWalletGlobalAdPreview({ adRequestId: "ad_test", startedById: "admin" });
    expect(result.needsWalletSave).toBe(true);
    expect(previewUpsert).not.toHaveBeenCalled();
  });

  it("active l'aperçu uniquement pour le client QA", async () => {
    adFindUnique.mockResolvedValueOnce(adRow);
    previewUpsert.mockResolvedValueOnce({});
    previewUpdate.mockResolvedValueOnce({});
    syncGlobal.mockResolvedValueOnce(undefined);
    const { startGoogleWalletGlobalAdPreview } = await import("../src/lib/google-wallet-global-preview");
    const result = await startGoogleWalletGlobalAdPreview({ adRequestId: "ad_test", startedById: "admin" });
    expect(result.needsWalletSave).toBe(false);
    expect(previewUpsert).toHaveBeenCalledWith(expect.objectContaining({ where: { userId: "qa-customer" } }));
    expect(syncGlobal).toHaveBeenCalledWith("qa-customer");
  });

  it("arrête seulement l'aperçu de la campagne concernée", async () => {
    previewFindUnique.mockResolvedValueOnce({ adRequestId: "ad_test" });
    previewDeleteMany.mockResolvedValueOnce({ count: 1 });
    const { stopGoogleWalletGlobalAdPreview } = await import("../src/lib/google-wallet-global-preview");
    const result = await stopGoogleWalletGlobalAdPreview({ adRequestId: "ad_test" });
    expect(result.stopped).toBe(true);
    previewFindUnique.mockResolvedValueOnce({ adRequestId: "other" });
    const noop = await stopGoogleWalletGlobalAdPreview({ adRequestId: "ad_test" });
    expect(noop.stopped).toBe(false);
  });
});
