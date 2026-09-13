import { describe, expect, it, vi } from "vitest";

async function walletModule() {
  vi.resetModules();
  process.env.GOOGLE_WALLET_ISSUER_ID = "3388000000023198536";
  process.env.GOOGLE_WALLET_GLOBAL_CLASS_ID = "3388000000023198536.3388000000023198536.fifelife_global";
  process.env.GOOGLE_WALLET_ORIGIN = "https://fidelite.sitereadyshd.fr";
  return import("../src/lib/google-wallet");
}

describe("Google Wallet IDs", () => {
  it("réutilise la classe générale existante", async () => {
    const { buildGoogleWalletIds } = await walletModule();
    expect(buildGoogleWalletIds({}).globalClassId).toBe(
      "3388000000023198536.3388000000023198536.fifelife_global",
    );
  });

  it("crée une seule classe opaque par commerce", async () => {
    const { buildGoogleWalletIds } = await walletModule();
    const first = buildGoogleWalletIds({ merchantId: "merchant_abc123" }).merchantClassId;
    const second = buildGoogleWalletIds({ merchantId: "merchant_abc123" }).merchantClassId;
    expect(first).toBe(second);
    expect(first).toMatch(/^3388000000023198536\.merchant_[a-f0-9]{32}$/);
  });

  it("ne place pas d'e-mail, téléphone ou nom client dans les identifiants", async () => {
    const { buildGoogleWalletIds } = await walletModule();
    const ids = buildGoogleWalletIds({
      userId: "user@example.com +33 6 12 34 56 78 Alice",
      merchantId: "merchant@example.com +33 1 23",
      membershipId: "membership Bob +33",
    });
    const joined = Object.values(ids).join("|");
    expect(joined).not.toContain("@");
    expect(joined).not.toContain("+");
    expect(joined).not.toContain(" ");
  });

  it("réutilise le même objet pour la même adhésion", async () => {
    const { buildGoogleWalletIds } = await walletModule();
    expect(buildGoogleWalletIds({ membershipId: "cm123" }).merchantObjectId).toBe(
      buildGoogleWalletIds({ membershipId: "cm123" }).merchantObjectId,
    );
  });

  it("produit deux classes commerçantes différentes pour deux commerces", async () => {
    const { buildGoogleWalletIds } = await walletModule();
    expect(buildGoogleWalletIds({ merchantId: "merchant-a" }).merchantClassId).not.toBe(
      buildGoogleWalletIds({ merchantId: "merchant-b" }).merchantClassId,
    );
  });

  it("deux clients du même commerce partagent la classe mais pas l'objet", async () => {
    const { buildGoogleWalletIds } = await walletModule();
    const classA = buildGoogleWalletIds({ merchantId: "merchant-a", membershipId: "membership-1" });
    const classB = buildGoogleWalletIds({ merchantId: "merchant-a", membershipId: "membership-2" });
    expect(classA.merchantClassId).toBe(classB.merchantClassId);
    expect(classA.merchantObjectId).not.toBe(classB.merchantObjectId);
  });
});

describe("Google Wallet payloads", () => {
  function merchantContext(mode: "VISITS" | "POINTS_BY_AMOUNT" | "FIXED_POINTS" | "AMOUNT_TIERS") {
    const rewards = [
      {
        id: "reward-1",
        name: "Café offert",
        threshold: 10,
        thresholdUnit: mode === "VISITS" || mode === "AMOUNT_TIERS" ? "visits" : "points",
        isActive: true,
      },
    ];
    return {
      merchant: {
        id: "merchant-a",
        name: "Café Nova",
        slug: "cafe-nova",
        logoUrl: "https://cdn.example.com/logo.png",
        primaryColor: "#123456",
        isActive: true,
        status: "ACTIVE",
      },
      mode,
      programTitle: mode === "VISITS" ? "Par passages" : "Points selon le montant",
      primaryRewardLabel: "Café offert",
      cardTemplateMeta: {
        id: "tpl-1",
        backgroundUrl: "/api/media/card-backgrounds/merchant-a/bg.png",
        config: {} as never,
        cardSlot: "VISITS",
        loyaltyMode: mode,
        version: 7,
        usedFallback: false,
      },
      config: { mode, rules: {}, rewards },
      rewards,
    } as any;
  }

  const membership = {
    id: "membership-1",
    points: 8,
    user: {
      id: "user-1",
      firstName: "Alice",
      lastName: "Martin",
      clientNumber: "482917",
      isActive: true,
    },
    merchant: { name: "Café Nova", slug: "cafe-nova", isActive: true, status: "ACTIVE" },
  };

  it("la classe commerçante est distincte de la classe globale et utilise image publique/appLink", async () => {
    const { buildGoogleWalletIds, merchantClassBody } = await walletModule();
    const ids = buildGoogleWalletIds({ merchantId: "merchant-a" });
    const body = merchantClassBody({
      classId: ids.merchantClassId!,
      merchant: merchantContext("VISITS").merchant,
      mode: "VISITS",
      rewardLabel: "Café offert",
      heroImageUrl: "/api/media/card-backgrounds/merchant-a/bg.png",
    }) as any;
    expect(body.id).not.toBe(buildGoogleWalletIds({}).globalClassId);
    expect(body.heroImage.sourceUri.uri).toBe(
      "https://fidelite.sitereadyshd.fr/api/media/card-backgrounds/merchant-a/bg.png",
    );
    expect(body.linksModuleData).toBeUndefined();
    expect(body.homepageUri).toBeUndefined();
    expect(body.appLinkData.displayText.defaultValue.value).toBe("Voir ma carte");
  });

  it("la personnalisation publiée du commerce surcharge couleur, hero et libellé", async () => {
    const { merchantClassBody } = await walletModule();
    const body = merchantClassBody({
      classId: "3388000000023198536.merchant_hash",
      merchant: merchantContext("VISITS").merchant,
      mode: "VISITS",
      rewardLabel: "Café offert",
      heroImageUrl: "/api/media/card-backgrounds/merchant-a/bg.png",
      appearance: {
        backgroundColor: "#5B3FD8",
        heroImageUrl: "/google-wallet/media/merchant/merchant-a/hero?v=1",
        logoUrl: "/google-wallet/media/merchant/merchant-a/logo?v=1",
        appLinkLabel: "Carte Nova",
      },
    }) as any;
    expect(body.hexBackgroundColor).toBe("#5B3FD8");
    expect(body.heroImage.sourceUri.uri).toBe(
      "https://fidelite.sitereadyshd.fr/google-wallet/media/merchant/merchant-a/hero?v=1",
    );
    expect(body.programLogo.sourceUri.uri).toBe(
      "https://fidelite.sitereadyshd.fr/google-wallet/media/merchant/merchant-a/logo?v=1",
    );
    expect(body.appLinkData.displayText.defaultValue.value).toBe("Carte Nova");
  });

  it("omet hero et logo large absents, avec fallback logo principal", async () => {
    const { merchantClassBody } = await walletModule();
    const merchant = { ...merchantContext("VISITS").merchant, logoUrl: null };
    const body = merchantClassBody({
      classId: "3388000000023198536.merchant_hash",
      merchant,
      mode: "VISITS",
      rewardLabel: "Café offert",
      heroImageUrl: null,
      appearance: { backgroundColor: "#000000" },
    }) as any;
    expect(body.hexBackgroundColor).toBe("#000000");
    expect(body.heroImage).toBeUndefined();
    expect(body.wideProgramLogo).toBeUndefined();
    expect(body.programLogo.sourceUri.uri).toContain("/google-wallet/fife-life-logo.png");
  });

  it("ignore un logo commerce relatif nu pour éviter une URL 404 Google", async () => {
    const { merchantClassBody } = await walletModule();
    const merchant = { ...merchantContext("VISITS").merchant, logoUrl: "/cmtx76vmw0000lc0104evr5rd" };
    const body = merchantClassBody({
      classId: "3388000000023198536.merchant_hash",
      merchant,
      mode: "VISITS",
      rewardLabel: "Café offert",
      heroImageUrl: null,
    }) as any;
    expect(body.programLogo.sourceUri.uri).toContain("/google-wallet/fife-life-logo.png");
    expect(body.programLogo.sourceUri.uri).not.toContain("/cmtx76vmw0000lc0104evr5rd");
  });

  it("la carte globale varie par niveau via l'objet, jamais par la classe", async () => {
    const { globalClassPatchBody, globalObjectBody } = await walletModule();
    const bronze = (await globalObjectBody({
      user: { id: "u1", firstName: "Ada", lastName: null, clientNumber: "100001", fifeLifePoints: 20, isActive: true },
      objectId: "3388000000023198536.user_bronze",
      qrValue: "qr",
      activeCardCount: 1,
      nextReward: "Niveau Silver",
      availableRewardsCount: 0,
    })) as any;
    const gold = (await globalObjectBody({
      user: { id: "u2", firstName: "Lina", lastName: null, clientNumber: "100002", fifeLifePoints: 300, isActive: true },
      objectId: "3388000000023198536.user_gold",
      qrValue: "qr",
      activeCardCount: 2,
      nextReward: "Niveau Diamond",
      availableRewardsCount: 1,
    })) as any;
    expect(bronze.heroImage.sourceUri.uri).toContain("/cards/bronze-good.png");
    expect(gold.heroImage.sourceUri.uri).toContain("/cards/or-good.png");
    expect(bronze.textModulesData).toEqual(expect.arrayContaining([expect.objectContaining({ id: "tier", body: "Niveau Bronze" })]));
    expect(gold.textModulesData).toEqual(expect.arrayContaining([expect.objectContaining({ id: "tier", body: "Niveau Or" })]));
    expect(globalClassPatchBody({ classId: "global" })).not.toHaveProperty("heroImage");
  });

  it("les liens de l'objet commerce ne sont pas dupliqués", async () => {
    const { merchantObjectBody } = await walletModule();
    const body = merchantObjectBody({
      membership,
      classId: "3388000000023198536.merchant_hash",
      objectId: "3388000000023198536.membership_hash",
      qrValue: "signed.qr.token",
      context: merchantContext("VISITS"),
    }) as any;
    expect(body.linksModuleData).toBeUndefined();
    expect(body.homepageUri).toBeUndefined();
    expect(body.appLinkData.webAppLinkInfo.appTarget.targetUri.uri).toBe(
      "https://fidelite.sitereadyshd.fr/carte/cafe-nova",
    );
  });

  it.each([
    ["VISITS", "Passages", "Encore 2 passages"],
    ["POINTS_BY_AMOUNT", "Points", "Encore 2 points"],
    ["FIXED_POINTS", "Points", "Encore 2 points"],
    ["AMOUNT_TIERS", "Passages", "Encore 2 passages"],
  ] as const)("%s utilise l'unité canonique", async (mode, label, remaining) => {
    const { merchantObjectBody } = await walletModule();
    const body = merchantObjectBody({
      membership,
      classId: "3388000000023198536.merchant_hash",
      objectId: "3388000000023198536.membership_hash",
      qrValue: "signed.qr.token",
      context: merchantContext(mode),
    }) as any;
    expect(body.loyaltyPoints.label).toBe(label);
    expect(body.textModulesData).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: "remaining", body: remaining })]),
    );
  });

  it("le QR contient le jeton signé attendu", async () => {
    const { merchantObjectBody } = await walletModule();
    const body = merchantObjectBody({
      membership,
      classId: "3388000000023198536.merchant_hash",
      objectId: "3388000000023198536.membership_hash",
      qrValue: "signed.qr.token",
      context: merchantContext("VISITS"),
    }) as any;
    expect(body.barcode).toMatchObject({ type: "QR_CODE", value: "signed.qr.token" });
  });
});

describe("Google Wallet appearance validation", () => {
  it("valide les couleurs lisibles et rejette les couleurs trop claires", async () => {
    const { googleWalletHexSchema, isReadableGoogleWalletColor } = await import("../src/lib/google-wallet-appearance");
    expect(googleWalletHexSchema.parse("#5b3fd8")).toBe("#5B3FD8");
    expect(isReadableGoogleWalletColor("#000000")).toBe(true);
    expect(isReadableGoogleWalletColor("#0B0B12")).toBe(true);
    expect(isReadableGoogleWalletColor("#FFFFFF")).toBe(false);
  });

  it("valide les ratios média Google Wallet", async () => {
    const { validateGoogleWalletMedia } = await import("../src/lib/media-storage");
    const png = Buffer.alloc(24);
    png.writeUInt8(0x89, 0);
    png.write("PNG", 1, "ascii");
    png.writeUInt32BE(1032, 16);
    png.writeUInt32BE(812, 20);
    expect(validateGoogleWalletMedia("hero", png, "image/png").ok).toBe(true);
    png.writeUInt32BE(900, 20);
    expect(validateGoogleWalletMedia("hero", png, "image/png").ok).toBe(false);
  });
});
