import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, expect, it } from "vitest";

describe("Google Wallet publication — garde-fous post-approbation", () => {
  it("ne définit plus UNDER_REVIEW en dur sur les corps de classe", () => {
    const source = readFileSync(resolve(process.cwd(), "src/lib/google-wallet.ts"), "utf8");
    expect(source).toContain("resolveLoyaltyClassReviewStatusForWrite");
    expect(source).toContain('reviewStatus: input.reviewStatus ?? "UNDER_REVIEW"');
    // Aucun littéral forcé : le statut distant APPROVED doit être préservé à l'écriture.
    expect(source).toContain("if (remoteStatus === \"APPROVED\") return \"APPROVED\"");
    expect(source.match(/reviewStatus:\s*"UNDER_REVIEW"/g) ?? []).toHaveLength(0);
  });

  it("conserve la diffusion test globale et son périmètre cartes globales uniquement", () => {
    const broadcast = readFileSync(resolve(process.cwd(), "src/lib/sponsored-test-broadcast.ts"), "utf8");
    const ui = readFileSync(
      resolve(process.cwd(), "src/app/super-admin/campagnes/fiche/[id]/ad-detail.tsx"),
      "utf8",
    );
    expect(broadcast).toContain("syncAllGoogleWalletGlobalObjects");
    expect(broadcast).toContain("merchantId: null");
    expect(broadcast).toContain("customerMembershipId: null");
    expect(ui).toContain("Diffuser en test partout");
    expect(ui).toContain("Diffusion test globale active — cette campagne est visible sur tous les comptes Fideto");
    expect(ui).toContain("Arrêter la diffusion test");
    expect(ui).toContain("test-broadcast-warning");
  });

  it("ne couple pas Google Wallet à STRIPE_MODE", () => {
    const envSource = readFileSync(resolve(process.cwd(), "src/lib/env.ts"), "utf8");
    expect(envSource).toContain("stripeMode");
    expect(envSource).toContain("googleWalletEnabled");
    expect(envSource).not.toMatch(/GOOGLE_WALLET_MODE/);
    expect(envSource).not.toMatch(/googleWalletMode/);
  });
});
