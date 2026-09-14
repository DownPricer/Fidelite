import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, expect, it } from "vitest";

describe("Google Wallet publication media order", () => {
  it("enregistre la configuration publiée avant l'appel Google", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/app/api/super-admin/merchants/[id]/google-wallet/route.ts"),
      "utf8",
    );

    const publishIndex = source.indexOf("publishGoogleWalletConfig(withDraft.configByMode)");
    const testIndex = source.indexOf("await testGoogleWalletMerchantConfig(id)");
    const syncIndex = source.indexOf("await syncGoogleWalletMerchant");

    expect(publishIndex).toBeGreaterThan(-1);
    expect(testIndex).toBeGreaterThan(publishIndex);
    expect(syncIndex).toBeGreaterThan(testIndex);
    expect(source).toContain("assertPublishedGoogleWalletMediaReadable");
  });

  it("publie les trois références média présentes dans le brouillon", async () => {
    const { publishGoogleWalletConfig } = await import("../src/lib/google-wallet-appearance");
    const published = publishGoogleWalletConfig({
      draftAppearance: {
        backgroundColor: "#000000",
        appLinkLabel: "Voir ma carte",
        heroImageUrl: "/google-wallet/media/merchant/m1/hero?v=1789382155550-m35m9f21",
        logoUrl: "/google-wallet/media/merchant/m1/logo?v=1789382174660-u2ve742w",
        wideLogoUrl: "/google-wallet/media/merchant/m1/wideLogo?v=1789382180000-a1b2c3d4",
      },
    });

    expect(published.publishedAppearance).toMatchObject({
      heroImageUrl: "/google-wallet/media/merchant/m1/hero?v=1789382155550-m35m9f21",
      logoUrl: "/google-wallet/media/merchant/m1/logo?v=1789382174660-u2ve742w",
      wideLogoUrl: "/google-wallet/media/merchant/m1/wideLogo?v=1789382180000-a1b2c3d4",
    });
  });
});
