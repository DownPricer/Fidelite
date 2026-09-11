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
