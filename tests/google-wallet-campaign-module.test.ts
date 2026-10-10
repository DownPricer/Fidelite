import { describe, expect, it, vi } from "vitest";

describe("Google Wallet campagne (carte globale)", () => {
  it("expose une URL hero https pour le visuel campagne", async () => {
    vi.resetModules();
    process.env.GOOGLE_WALLET_ORIGIN = "https://fideto.fr";
    const { resolveGlobalWalletCampaignHeroUrl, globalWalletCampaignDetailUri } = await import(
      "../src/lib/google-wallet-campaign-module"
    );
    expect(globalWalletCampaignDetailUri({ merchantSlug: "boulangerie", ctaUrl: null })).toBe(
      "https://fideto.fr/c/boulangerie",
    );
    expect(resolveGlobalWalletCampaignHeroUrl("https://cdn.example.com/banner.png")).toBe("https://cdn.example.com/banner.png");
    expect(resolveGlobalWalletCampaignHeroUrl("/api/media/visuels/m1/ad.png")).toBe(
      "https://fideto.fr/api/media/visuels/m1/ad.png",
    );
    expect(resolveGlobalWalletCampaignHeroUrl("http://insecure.example/x.png")).toBeNull();
  });

  it("construit encore un ValueAddedModule pour validation interne (non envoyé à Google)", async () => {
    vi.resetModules();
    process.env.GOOGLE_WALLET_ORIGIN = "https://fideto.fr";
    const { buildGlobalWalletValueAddedModule } = await import("../src/lib/google-wallet-campaign-module");
    const module = buildGlobalWalletValueAddedModule({
      id: "ad1",
      title: "Voir l'offre",
      description: "-20 % sur le pain",
      imagePathOrUrl: "https://cdn.example.com/banner.png",
      detailUri: "https://boulangerie.example/offre",
    }) as Record<string, unknown>;
    expect(module.uri).toBe("https://boulangerie.example/offre");
  });

  it("n'ajoute pas valueAddedModuleData sur l'objet commerçant", async () => {
    vi.resetModules();
    process.env.GOOGLE_WALLET_ISSUER_ID = "3388000000023198536";
    process.env.GOOGLE_WALLET_GLOBAL_CLASS_ID = "3388000000023198536.3388000000023198536.fifelife_global";
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

  it("remplace le hero Bronze par le visuel campagne et vide les modules recommandations", async () => {
    vi.resetModules();
    process.env.GOOGLE_WALLET_ISSUER_ID = "3388000000023198536";
    process.env.GOOGLE_WALLET_GLOBAL_CLASS_ID = "3388000000023198536.3388000000023198536.fifelife_global";
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
        imagePathOrUrl: "https://fideto.fr/api/media/visuels/m1/google-wallet-hero-campaign.png",
        detailUri: "https://fideto.fr/c/boulangerie",
      },
    })) as Record<string, unknown>;
    expect((withCampaign.heroImage as { sourceUri: { uri: string } }).sourceUri.uri).toBe(
      "https://fideto.fr/api/media/visuels/m1/google-wallet-hero-campaign.png",
    );
    expect(withCampaign.valueAddedModuleData).toEqual([]);
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
    expect((without.heroImage as { sourceUri: { uri: string } }).sourceUri.uri).toContain("/cards/bronze-good.png");
    expect(without.valueAddedModuleData).toEqual([]);
  });

  it("conserve le hero Bronze si le module tente d'utiliser le bandeau", async () => {
    vi.resetModules();
    process.env.GOOGLE_WALLET_ISSUER_ID = "3388000000023198536";
    process.env.GOOGLE_WALLET_GLOBAL_CLASS_ID = "3388000000023198536.3388000000023198536.fifelife_global";
    process.env.GOOGLE_WALLET_ORIGIN = "https://fideto.fr";
    const { globalObjectBody } = await import("../src/lib/google-wallet");
    const body = await globalObjectBody({
      user: {
        id: "u1",
        firstName: "Ada",
        lastName: null,
        clientNumber: "100001",
        fifeLifePoints: 20,
        isActive: true,
      },
      objectId: "obj",
      qrValue: "qr",
      activeCardCount: 1,
      nextReward: null,
      availableRewardsCount: 0,
      campaignModule: {
        id: "ad1",
        title: "Offre",
        description: "Texte",
        imagePathOrUrl: "/api/media/visuels/m1/banniere-red.png",
        detailUri: "https://fideto.fr/c/boulangerie",
      },
    });
    expect(body.heroImage?.sourceUri?.uri).toContain("/cards/bronze-good.png");
  });

  it("conserve le hero Bronze si le visuel campagne Wallet n'est pas une URL https publique", async () => {
    vi.resetModules();
    process.env.GOOGLE_WALLET_ISSUER_ID = "3388000000023198536";
    process.env.GOOGLE_WALLET_GLOBAL_CLASS_ID = "3388000000023198536.3388000000023198536.fifelife_global";
    process.env.GOOGLE_WALLET_ORIGIN = "https://fideto.fr";
    const { globalObjectBody } = await import("../src/lib/google-wallet");
    const body = await globalObjectBody({
      user: {
        id: "u1",
        firstName: "Ada",
        lastName: null,
        clientNumber: "100001",
        fifeLifePoints: 20,
        isActive: true,
      },
      objectId: "obj",
      qrValue: "qr",
      activeCardCount: 1,
      nextReward: null,
      availableRewardsCount: 0,
      campaignModule: {
        id: "ad1",
        title: "Offre",
        description: "Texte",
        imagePathOrUrl: "http://bad.example/b.png",
        detailUri: "https://fideto.fr/c/boulangerie",
      },
    });
    expect(body.heroImage?.sourceUri?.uri).toContain("/cards/bronze-good.png");
  });
});
