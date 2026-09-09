import { describe, expect, it } from "vitest";
import {
  CARD_ASPECT_RATIO,
  cardTemplateConfigSchema,
  defaultCardTemplateConfig,
} from "../src/lib/card-template-schema";
import {
  containsForbiddenTechnicalLabel,
  ELEMENT_TYPE_LABELS,
  elementTypeLabel,
} from "../src/lib/card-template-i18n";
import { enforceElementRect } from "../src/lib/card-template-editor-resize";
import {
  normalizeQrElementRect,
  qrRecommendedRect,
  qrVisuallySquare,
  qrVisuallySquareInPixels,
} from "../src/lib/card-template-qr-geometry";
import { normalizeCardTemplateConfig } from "../src/lib/card-template-normalize";
import { validateCardTemplateForPublishDetailed } from "../src/lib/card-template-validation";
import { buildCardBackgroundImageStyle } from "../src/lib/card-template-background-style";
import {
  hasAnimatedCard,
  hasSeenWalletEvent,
  markCardAnimated,
  markWalletEventSeen,
  resetWalletEventDedupForTests,
  shouldPlayNewCardAnimation,
} from "../src/lib/wallet-event-dedup";
import { qrNormalizedHeight } from "../src/lib/card-template-qr-geometry";

describe("traductions éditeur", () => {
  it("couvre tous les types d’éléments en français", () => {
    for (const label of Object.values(ELEMENT_TYPE_LABELS)) {
      expect(label.length).toBeGreaterThan(2);
      expect(containsForbiddenTechnicalLabel(label)).toBe(false);
    }
  });

  it("n’expose pas d’identifiants techniques dans les libellés", () => {
    expect(elementTypeLabel("merchantName")).toBe("Nom du commerce");
    expect(elementTypeLabel("qr")).toBe("QR code");
    expect(containsForbiddenTechnicalLabel(elementTypeLabel("clientName"))).toBe(false);
  });
});

describe("géométrie QR sur carte 1.586:1", () => {
  it("calcule height = width × 1.586", () => {
    const rect = { x: 0.1, y: 0.1, width: 0.12, height: 0.12 * CARD_ASPECT_RATIO };
    expect(qrVisuallySquare(rect)).toBe(true);
    expect(qrVisuallySquareInPixels(rect, 920)).toBe(true);
  });

  it("détecte un faux carré normalisé width === height", () => {
    const wrong = { x: 0.1, y: 0.1, width: 0.18, height: 0.18 };
    expect(qrVisuallySquare(wrong)).toBe(false);
    expect(qrVisuallySquareInPixels(wrong, 920)).toBe(false);
  });

  it("taille recommandée visuellement carrée en pixels", () => {
    const rec = qrRecommendedRect();
    expect(qrVisuallySquare(rec)).toBe(true);
    expect(qrVisuallySquareInPixels(rec, 1000)).toBe(true);
  });

  it("enforceElementRect produit un carré visuel", () => {
    const qr = {
      id: "qr",
      type: "qr" as const,
      x: 0.1,
      y: 0.1,
      width: 0.18,
      height: 0.18,
      zIndex: 1,
      locked: false,
      hidden: false,
      anchor: "top-left" as const,
    };
    const enforced = enforceElementRect(qr, { x: 0.1, y: 0.1, width: 0.15, height: 0.15 }, "se");
    expect(qrVisuallySquare(enforced)).toBe(true);
    expect(enforced.width).toBeGreaterThanOrEqual(0.12);
  });

  it("normalise un ancien QR incorrect (width ≈ height)", () => {
    const fixed = normalizeQrElementRect(0.22, 0.22);
    expect(fixed.width).toBeCloseTo(0.22, 3);
    expect(fixed.height).toBeCloseTo(0.22 * CARD_ASPECT_RATIO, 3);
  });

  it("valide la publication avec le nouveau ratio visuel", () => {
    const base = defaultCardTemplateConfig("/bg.png");
    const config = normalizeCardTemplateConfig({
      ...base,
      elements: [
        ...base.elements,
        {
          id: "client-1",
          type: "clientName" as const,
          x: 0.06,
          y: 0.28,
          width: 0.5,
          height: 0.08,
          zIndex: 2,
          locked: false,
          hidden: false,
          anchor: "top-left" as const,
          style: {
            fontFamily: "system" as const,
            fontSize: 16,
            fontWeight: "600" as const,
            color: "#FFFFFF",
            textAlign: "left" as const,
            opacity: 1,
            lineHeight: 1.2,
            shadow: false,
            borderRadius: 0,
          },
        },
        {
          id: "visits-1",
          type: "visitsCount" as const,
          x: 0.06,
          y: 0.4,
          width: 0.3,
          height: 0.08,
          zIndex: 2,
          locked: false,
          hidden: false,
          anchor: "top-left" as const,
          style: {
            fontFamily: "system" as const,
            fontSize: 16,
            fontWeight: "600" as const,
            color: "#FFFFFF",
            textAlign: "left" as const,
            opacity: 1,
            lineHeight: 1.2,
            shadow: false,
            borderRadius: 0,
          },
        },
        {
          id: "reward-1",
          type: "nextReward" as const,
          x: 0.06,
          y: 0.52,
          width: 0.5,
          height: 0.08,
          zIndex: 2,
          locked: false,
          hidden: false,
          anchor: "top-left" as const,
          style: {
            fontFamily: "system" as const,
            fontSize: 16,
            fontWeight: "600" as const,
            color: "#FFFFFF",
            textAlign: "left" as const,
            opacity: 1,
            lineHeight: 1.2,
            shadow: false,
            borderRadius: 0,
          },
        },
      ],
    });
    const qr = config.elements.find((e) => e.type === "qr");
    expect(qr).toBeTruthy();
    expect(qr!.height).toBeCloseTo(qrNormalizedHeight(qr!.width), 3);
    const result = validateCardTemplateForPublishDetailed(config, "VISITS");
    expect(result.ok).toBe(true);
  });
});

describe("recadrage fond non destructif", () => {
  it("restitue position et zoom via le schéma", () => {
    const config = defaultCardTemplateConfig("/bg.png");
    const patched = {
      ...config,
      background: {
        ...config.background,
        position: { x: 0.35, y: 0.62 },
        scale: 1.4,
        fit: "cover" as const,
      },
    };
    const parsed = cardTemplateConfigSchema.parse(patched);
    expect(parsed.background.position.x).toBeCloseTo(0.35);
    expect(parsed.background.scale).toBe(1.4);
    const styles = buildCardBackgroundImageStyle(parsed.background);
    expect(styles.img.transform).toBe("translate(-50%, -50%)");
  });
});

describe("cycle wallet — déduplication animation", () => {
  it("ne rejoue pas l’animation pour un événement déjà vu", () => {
    resetWalletEventDedupForTests();
    markWalletEventSeen("evt-1");
    expect(hasSeenWalletEvent("evt-1")).toBe(true);
    expect(
      shouldPlayNewCardAnimation("evt-1", "membership-1", false),
    ).toBe(false);
  });

  it("ne joue pas l’animation si la carte est déjà dans le wallet (legacy client)", () => {
    expect(
      shouldPlayNewCardAnimation("evt-new", "membership-2", true),
    ).toBe(false);
  });

  it("joue l’animation une seule fois par carte", () => {
    resetWalletEventDedupForTests();
    markCardAnimated("membership-3");
    expect(hasAnimatedCard("membership-3")).toBe(true);
    expect(
      shouldPlayNewCardAnimation("evt-fresh", "membership-3", false),
    ).toBe(false);
  });
});
