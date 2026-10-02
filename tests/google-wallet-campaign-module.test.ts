import { describe, expect, it, vi } from "vitest";

describe("Google Wallet encart campagne (carte globale)", () => {
  it("construit un ValueAddedModuleData cliquable avec image https", async () => {
    vi.resetModules();
    process.env.GOOGLE_WALLET_ORIGIN = "https://fideto.fr";
    const { buildGlobalWalletValueAddedModule, globalWalletCampaignDetailUri } = await import(
      "../src/lib/google-wallet-campaign-module"
    );
    expect(globalWalletCampaignDetailUri({ merchantSlug: "boulangerie", ctaUrl: null })).toBe(
      "https://fideto.fr/c/boulangerie",
    );
    const module = buildGlobalWalletValueAddedModule({
      id: "ad1",
      title: "Voir l'offre",
      description: "-20 % sur le pain",
      imagePathOrUrl: "https://cdn.example.com/banner.png",
      detailUri: "https://boulangerie.example/offre",
      displayStart: new Date("2026-10-05T09:00:00.000Z"),
      displayEnd: new Date("2026-10-05T12:00:00.000Z"),
    }) as Record<string, unknown>;
    expect(module.uri).toBe("https://boulangerie.example/offre");
    expect((module.header as { defaultValue: { value: string } }).defaultValue.value).toBe("Voir l'offre");
    expect((module.image as { sourceUri: { uri: string } }).sourceUri.uri).toBe("https://cdn.example.com/banner.png");
    expect(module.viewConstraints).toBeDefined();
  });

  it("n'ajoute pas valueAddedModuleData sur l'objet commerçant", async () => {
    vi.resetModules();
    process.env.GOOGLE_WALLET_ISSUER_ID = "3388000000023198536";
    process.env.GOOGLE_WALLET_GLOBAL_CLASS_ID = "3388000000023198536.fifelife_global";
    process.env.GOOGLE_WALLET_ORIGIN = "https://fideto.fr";
    const { merchantObjectBody } = await import("../src/lib/google-wallet");
    const context = {
      merchant: {
        id: "m1",
        name: "Café",
        slug: "cafe",
        logoUrl: "https://cdn.example.com/logo.png",
        primaryColor: "#111",
        isActive: true,
        status: "ACTIVE",
      },
      mode: "VISITS" as const,
      programTitle: "Passages",
      programDescription: "1 passage",
      primaryRewardLabel: "Café",
      cardTemplateMeta: null,
      config: { mode: "VISITS" as const, rules: {}, rewards: [] },
      unit: "passages" as const,
      rewards: [],
      isOperational: true,
    };
    const body = merchantObjectBody({
      membership: {
        id: "cm1",
        points: 3,
        user: { id: "u1", firstName: "A", lastName: null, clientNumber: "1", isActive: true },
        merchant: { name: "Café", slug: "cafe", isActive: true, status: "ACTIVE" },
      },
      classId: "class",
      objectId: "obj",
      qrValue: "qr",
      context: context as never,
    }) as Record<string, unknown>;
    expect(body.valueAddedModuleData).toBeUndefined();
  });

  it("inclut ou retire l'encart sur la carte globale selon la campagne", async () => {
    vi.resetModules();
    process.env.GOOGLE_WALLET_ISSUER_ID = "3388000000023198536";
    process.env.GOOGLE_WALLET_GLOBAL_CLASS_ID = "3388000000023198536.fifelife_global";
    process.env.GOOGLE_WALLET_ORIGIN = "https://fideto.fr";
    const { globalObjectBody } = await import("../src/lib/google-wallet");
    const user = {
      id: "u1",
      firstName: "Ada",
      lastName: null,
      clientNumber: "100001",
      fifeLifePoints: 20,
      isActive: true,
    };
    const withCampaign = (await globalObjectBody({
      user,
      objectId: "obj",
      qrValue: "qr",
      activeCardCount: 1,
      nextReward: null,
      availableRewardsCount: 0,
      campaignModule: {
        id: "ad1",
        title: "Offre",
        description: "Texte",
        imagePathOrUrl: "https://cdn.example.com/b.png",
        detailUri: "https://fideto.fr/c/boulangerie",
      },
    })) as Record<string, unknown>;
    expect(withCampaign.valueAddedModuleData).toHaveLength(1);
    expect(withCampaign.notifyPreference).toBe("DO_NOT_NOTIFY");
    expect(withCampaign.barcode).toMatchObject({ type: "QR_CODE", value: "qr" });

    const without = (await globalObjectBody({
      user,
      objectId: "obj",
      qrValue: "qr",
      activeCardCount: 1,
      nextReward: null,
      availableRewardsCount: 0,
      campaignModule: null,
    })) as Record<string, unknown>;
    expect(without.valueAddedModuleData).toEqual([]);
  });
});
