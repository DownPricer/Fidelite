import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import {
  NEXT_REWARD_STYLE_LABELS,
  NEXT_REWARD_STYLE_VARIANTS,
  buildNextRewardViewModel,
  defaultNextRewardStyle,
} from "@/lib/next-reward-styles";
import { allowedElementTypesForSlot } from "@/lib/loyalty-widget";
import { cardTemplateConfigSchema } from "@/lib/card-template-schema";

describe("prochain avantage — styles", () => {
  it("expose au moins huit styles distincts", () => {
    expect(NEXT_REWARD_STYLE_VARIANTS.length).toBeGreaterThanOrEqual(8);
    for (const variant of NEXT_REWARD_STYLE_VARIANTS) {
      expect(NEXT_REWARD_STYLE_LABELS[variant].length).toBeGreaterThan(3);
    }
  });

  it("construit un modèle dynamique sans nom fictif enregistré", () => {
    const model = buildNextRewardViewModel(
      {
        current: 3,
        target: 10,
        label: "Encore 7 · Boisson offerte",
        nextRewardName: "Boisson offerte",
        nextRewardHeadline: "Prochain avantage",
      },
      "VISITS",
    );
    expect(model.title).toBe("Prochain avantage");
    expect(model.subtitle).toBe("Encore 7 passages");
    expect(model.allUnlocked).toBe(false);
  });

  it("accepte nextRewardStyle dans le schéma de gabarit", () => {
    const style = defaultNextRewardStyle();
    const parsed = cardTemplateConfigSchema.safeParse({
      schemaVersion: 1,
      aspectRatio: 1.586,
      background: { url: "/bg.png", fit: "cover", position: { x: 0.5, y: 0.5 }, scale: 1 },
      elements: [
        {
          id: "nr-1",
          type: "nextReward",
          x: 0.1,
          y: 0.7,
          width: 0.4,
          height: 0.1,
          zIndex: 2,
          locked: false,
          hidden: false,
          anchor: "top-left",
          nextRewardStyle: style,
        },
      ],
    });
    expect(parsed.success).toBe(true);
  });
});

describe("prochain avantage — éditeurs", () => {
  it("est autorisé sur toutes les cartes", () => {
    for (const slot of ["GENERAL", "VISITS", "POINTS_BY_AMOUNT", "FIXED_POINTS", "AMOUNT_TIERS"] as const) {
      expect(allowedElementTypesForSlot(slot)).toContain("nextReward");
    }
  });
});

describe("QR agrandissable", () => {
  it("utilise le composant partagé dans le renderer et le wallet", () => {
    const renderer = readFileSync(
      resolve(process.cwd(), "src/components/fife-life/merchant-card-renderer.tsx"),
      "utf8",
    );
    const enlarged = readFileSync(
      resolve(process.cwd(), "src/components/fife-life/qr-enlarged-view.tsx"),
      "utf8",
    );
    const deck = readFileSync(resolve(process.cwd(), "src/components/fife-life/card-deck.tsx"), "utf8");

    expect(renderer).toContain("ExpandableQrCode");
    expect(enlarged).toContain("min(78vw,360px)");
    expect(deck).toContain("qrZoomEnabled");
  });

  it("réduit le padding du QR pour conserver la taille visuelle", () => {
    const css = readFileSync(resolve(process.cwd(), "src/app/globals.css"), "utf8");
    expect(css).toContain(".merchant-card-qr-shell");
    expect(css).toMatch(/padding:\s*2%/);
    expect(css).toContain("width: 18cqw");
  });

  it("affiche les actions QR et Google Wallet sans bouton imbriqué sur le wallet", () => {
    const walletHome = readFileSync(resolve(process.cwd(), "src/components/fife-life/wallet-home.tsx"), "utf8");
    const merchantDetail = readFileSync(resolve(process.cwd(), "src/components/fife-life/merchant-detail.tsx"), "utf8");
    const qrAction = readFileSync(resolve(process.cwd(), "src/components/fife-life/wallet-qr-action.tsx"), "utf8");

    expect(walletHome).toContain("wallet-primary-actions");
    expect(walletHome).toContain("<WalletQrAction");
    expect(walletHome).toContain("googleWalletEndpoint");
    expect(walletHome).toContain("/api/customer/google-wallet/global");
    expect(walletHome).toContain("/api/customer/google-wallet/merchant/");
    expect(merchantDetail).toContain("<WalletQrAction");
    expect(merchantDetail).toContain("/api/customer/google-wallet/merchant/");
    expect(qrAction).toContain("data-no-card-expand");
    expect(qrAction).toContain("QrEnlargedView");
    expect(qrAction).not.toMatch(/<button[\s\S]*<button/);
  });

  it("rend le wallet mobile scrollable et garde l'accueil centré sur carte/actions/récompense/flèche", () => {
    const css = readFileSync(resolve(process.cwd(), "src/app/globals.css"), "utf8");
    const walletHome = readFileSync(resolve(process.cwd(), "src/components/fife-life/wallet-home.tsx"), "utf8");

    expect(css).toContain("min-height: 100dvh");
    expect(css).not.toContain("body:has(.wallet-shell) {\n  overflow: hidden");
    expect(walletHome).not.toContain("wallet-cards-rail");
    expect(walletHome).not.toContain("wallet-activity-block");
    expect(walletHome).not.toContain("Activité récente");
    expect(walletHome.indexOf("wallet-primary-actions")).toBeLessThan(walletHome.indexOf("wallet-reward-block"));
    expect(walletHome.indexOf("wallet-reward-block")).toBeLessThan(walletHome.indexOf("wallet-sheet-trigger"));
    expect(walletHome).toContain("setSheetOpen(true)");
    const sheet = readFileSync(resolve(process.cwd(), "src/components/fife-life/cards-sheet.tsx"), "utf8");
    expect(sheet).toContain("enablePublicSearch={false}");
  });

  it("conserve l'activité et les avantages utilisés dans le profil", () => {
    const profile = readFileSync(resolve(process.cwd(), "src/components/fife-life/profile/profile-page.tsx"), "utf8");
    expect(profile).toContain("/api/customer/history");
    expect(profile).toContain("/api/customer/benefits");
    expect(profile).toContain("Historique général");
    expect(profile).toContain("Avantages utilisés");
  });

  it("publie l'apparence Google Wallet sans retour aux valeurs par défaut", () => {
    const api = readFileSync(
      resolve(process.cwd(), "src/app/api/super-admin/merchants/[id]/google-wallet/route.ts"),
      "utf8",
    );
    const detail = readFileSync(
      resolve(process.cwd(), "src/app/super-admin/commerces/[id]/merchant-detail.tsx"),
      "utf8",
    );
    expect(api).toContain("parseWalletAction(req).catch");
    expect(api).toContain("jsonError(\"Requête Google Wallet illisible.\"");
    expect(api).toContain("publishedMediaExists");
    expect(detail).toContain("FormData");
    expect(detail).toContain('action: kind, appearance: walletAppearance');
    expect(detail).toContain("walletFailedAction");
    expect(detail).toContain("Réessayer");
    expect(detail).toContain("config.draftAppearance ?? config.publishedAppearance");
  });
});

describe("vignette jauge", () => {
  it("réutilise le composant de jauge dans le sélecteur", () => {
    const picker = readFileSync(
      resolve(process.cwd(), "src/components/super-admin/loyalty-widget-style-picker.tsx"),
      "utf8",
    );
    expect(picker).toContain("LoyaltyGaugeThumbnail");
    expect(picker).toContain('variant === "gauge" ? (');
    expect(picker).toContain("<LoyaltyGaugeThumbnail");
  });
});

describe("caisse mobile compacte", () => {
  it("priorise montant et validation, widget vert et solde en bas", () => {
    const checkout = readFileSync(
      resolve(process.cwd(), "src/components/caisse/cashier-checkout.tsx"),
      "utf8",
    );
    expect(checkout).toContain("cashier-checkout__primary");
    expect(checkout).toContain("cashier-rewards-widget");
    expect(checkout).toContain("Solde actuel");
    expect(checkout).not.toContain("MerchantCardScanResult");
    expect(checkout).toContain("Vérification…");
  });
});
