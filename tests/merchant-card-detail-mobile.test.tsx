// @vitest-environment happy-dom

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MerchantCardDetail } from "@/components/fife-life/merchant-detail";
import { PREVIEW_CARDS, PREVIEW_HISTORY } from "@/components/fife-life/preview-data";
import type { CustomerMerchantRewardProgress } from "@/lib/customer-reward-progress-types";
import { resetQrCache } from "@/components/fife-life/qr-cache";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    "aria-label"?: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const card = PREVIEW_CARDS[0]!;

function baseProgress(overrides?: Partial<CustomerMerchantRewardProgress>): CustomerMerchantRewardProgress {
  return {
    merchantId: card.merchantId,
    merchantName: card.name,
    merchantSlug: card.slug,
    balance: 7,
    mode: "VISITS",
    unit: "passages",
    nextTarget: null,
    availableRewards: [],
    conservedRewards: [],
    upcomingRewards: [],
    laterRewards: [],
    ...overrides,
  };
}

// Ordre attendu sur mobile : carte -> actions -> prochain avantage -> avantages -> reste.
const orderedClasses = [
  "merchant-card-block",
  "merchant-action-row",
  "merchant-reward-progress",
  "merchant-advantages-block",
  "merchant-activity-block",
  "merchant-program-block",
  "merchant-conditions-block",
];

function classIndex(html: string, className: string) {
  const match = new RegExp(`class="[^"]*\\b${className}\\b[^"]*"`).exec(html);
  return match ? match.index : -1;
}

describe("MerchantCardDetail — ordre mobile de la fiche commerçant", () => {
  beforeEach(() => {
    resetQrCache();
  });

  it("rend carte, actions, prochain avantage puis avantages dans cet ordre (aperçu)", () => {
    const html = renderToStaticMarkup(
      <MerchantCardDetail
        slug={card.slug}
        preview
        walletEnabled={false}
        merchant={card}
        history={PREVIEW_HISTORY}
        rewardProgress={baseProgress()}
      />,
    );

    const indices = orderedClasses.map((className) => classIndex(html, className));
    indices.forEach((index, i) => {
      expect(index, `classe "${orderedClasses[i]}" doit être présente`).toBeGreaterThan(-1);
    });
    for (let i = 1; i < indices.length; i += 1) {
      expect(indices[i], `${orderedClasses[i]} doit suivre ${orderedClasses[i - 1]}`).toBeGreaterThan(
        indices[i - 1]!,
      );
    }
  });

  it("expose une seule barre d'actions avec le QR et le partage, sans doublon de bouton", () => {
    const html = renderToStaticMarkup(
      <MerchantCardDetail
        slug={card.slug}
        preview
        walletEnabled={false}
        merchant={card}
        history={PREVIEW_HISTORY}
        rewardProgress={baseProgress()}
      />,
    );

    expect((html.match(/\bmerchant-action-row\b/g) ?? []).length).toBe(1);
    expect((html.match(/Ouvrir le QR code/g) ?? []).length).toBe(1);
    expect((html.match(/Partager la carte/g) ?? []).length).toBe(1);
    // pas de deuxième bloc "Prochaine récompense" dupliqué à côté du panneau canonique
    expect((html.match(/Prochaine récompense/g) ?? []).length).toBe(0);
    expect((html.match(/Prochain avantage/g) ?? []).length).toBe(1);
  });

  it("affiche toutes les récompenses actives publiées quand plusieurs existent", () => {
    const html = renderToStaticMarkup(
      <MerchantCardDetail
        slug={card.slug}
        preview={false}
        walletEnabled={false}
        merchant={card}
        history={PREVIEW_HISTORY}
        rewardProgress={baseProgress()}
        programView={{
          mode: "POINTS_BY_AMOUNT",
          unit: "points",
          balance: 40,
          progressTarget: 150,
          programTitle: "Points fixes par achat",
          programDescription: null,
          minimumPurchaseLabel: null,
          rewards: [
            { id: "r1", name: "Café offert", threshold: 30, thresholdUnit: "points", description: null },
            { id: "r2", name: "Croissant offert", threshold: 60, thresholdUnit: "points", description: null },
            { id: "r3", name: "Menu offert", threshold: 150, thresholdUnit: "points", description: null },
          ],
          nextBenefit: null,
          upcomingRewardName: "Croissant offert",
          upcomingRemaining: 20,
        }}
      />,
    );

    expect(html).toContain("Café offert");
    expect(html).toContain("Croissant offert");
    expect(html).toContain("Menu offert");
    expect(html).not.toContain("Aucun avantage actif publié pour ce mode.");
  });

  it("affiche le message exact quand aucune récompense active compatible n'existe", () => {
    const html = renderToStaticMarkup(
      <MerchantCardDetail
        slug={card.slug}
        preview={false}
        walletEnabled={false}
        merchant={card}
        history={PREVIEW_HISTORY}
        rewardProgress={baseProgress()}
        programView={{
          mode: "POINTS_BY_AMOUNT",
          unit: "points",
          balance: 40,
          progressTarget: 40,
          programTitle: "Points fixes par achat",
          programDescription: null,
          minimumPurchaseLabel: null,
          rewards: [],
          nextBenefit: null,
          upcomingRewardName: null,
          upcomingRemaining: null,
        }}
      />,
    );

    expect(html).toContain("Aucun avantage actif publié pour ce mode.");
    expect(html).not.toContain("Aucun avantage configuré pour ce programme.");
  });

  it("n'encode jamais d'identifiant de récompense dans un QR par avantage", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/fife-life/merchant-reward-progress-panel.tsx"),
      "utf8",
    );
    // Le bouton "Utiliser cet avantage" ouvre l'overlay QR canonique (qrSrc partagé),
    // il ne doit jamais générer de QR spécifique à la récompense.
    expect(source).toContain("qrSrc={qrSrc}");
    expect(source).not.toMatch(/qrSrc=\{.*reward\.(id|threshold)/i);
  });
});

describe("MerchantCardDetail — partage sans donnée sensible", () => {
  it("partage une URL sûre sans token QR ni identifiant d'adhésion", () => {
    const source = readFileSync(join(process.cwd(), "src/components/fife-life/merchant-detail.tsx"), "utf8");
    expect(source).toContain("const shareUrl = `${window.location.origin}/c/${slug}`;");
    expect(source).not.toMatch(/shareUrl.*qr/i);
    expect(source).not.toMatch(/shareUrl.*token/i);
    expect(source).not.toMatch(/shareUrl.*membership/i);
  });

  it("ignore l'annulation du partage sans afficher d'erreur", () => {
    const source = readFileSync(join(process.cwd(), "src/components/fife-life/merchant-detail.tsx"), "utf8");
    expect(source).toContain('if ((err as Error).name !== "AbortError")');
  });
});

describe("MerchantCardDetail — repli presse-papiers", () => {
  it("copie le lien sûr via navigator.clipboard puis affiche « Copié ! » sans erreur", () => {
    const source = readFileSync(join(process.cwd(), "src/components/fife-life/merchant-detail.tsx"), "utf8");
    expect(source).toContain("await navigator.clipboard.writeText(url);");
    expect(source).toContain("setShareSuccess(true);");
    expect(source).toContain("Copié !");
  });

  it("n'affiche pas d'erreur rouge pour une annulation de partage (AbortError)", () => {
    const source = readFileSync(join(process.cwd(), "src/components/fife-life/merchant-detail.tsx"), "utf8");
    // en cas d'AbortError, on ne bascule pas sur le repli presse-papiers ni sur setError
    expect(source).toMatch(/AbortError[\s\S]{0,80}fallbackCopyLink/);
  });
});
