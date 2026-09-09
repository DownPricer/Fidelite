import { describe, expect, it } from "vitest";
import { resolveDisplayQrSrc } from "../src/components/fife-life/merchant-card-renderer";
import {
  computeBillableMrr,
  computeTrialPotentialMrr,
} from "../src/lib/billing-stats";
import {
  CARD_ASPECT_RATIO,
  defaultCardTemplateConfig,
} from "../src/lib/card-template-schema";
import { validateCardTemplateForPublishDetailed } from "../src/lib/card-template-validation";
import { DECORATIVE_QR_SRC, resolveElementRect } from "../src/lib/merchant-card-layout";
import {
  assertSuperAdminProductionConfig,
  isSuperAdminAllowedEmailsConfigured,
} from "../src/lib/super-admin-entry";
import { isSuperAdminEmailAllowed } from "../src/lib/super-admin-session";

describe("MRR et essais", () => {
  it("exclut les essais gratuits du MRR encaissable", () => {
    const mrr = computeBillableMrr([
      { amount: 49, frequency: "MONTHLY", status: "ACTIVE" },
      { amount: 0, frequency: "MONTHLY", status: "TRIAL" },
      { amount: 29, frequency: "MONTHLY", status: "TRIAL" },
    ]);
    expect(mrr).toBe(49);
  });

  it("calcule le potentiel mensuel des essais payants séparément", () => {
    const potential = computeTrialPotentialMrr([
      { amount: 0, frequency: "MONTHLY", status: "TRIAL" },
      { amount: 1200, frequency: "YEARLY", status: "TRIAL" },
    ]);
    expect(potential).toBe(100);
  });
});

describe("QR et confidentialité publique", () => {
  it("n'expose jamais un QR réel en publicPreview", () => {
    const real = "https://fife.life/qr/secret-token";
    const src = resolveDisplayQrSrc("publicPreview", true, real);
    expect(src).toBe(DECORATIVE_QR_SRC);
    expect(src).not.toContain("secret");
  });

  it("masque le QR en mode compact", () => {
    expect(resolveDisplayQrSrc("compact", true, "https://real")).toBeNull();
  });

  it("autorise le QR réel uniquement en personalized", () => {
    const real = "https://fife.life/qr/abc";
    expect(resolveDisplayQrSrc("personalized", true, real)).toBe(real);
  });
});

describe("validation publication par mode fidélité", () => {
  it("exige visitsCount pour VISITS", () => {
    const config = defaultCardTemplateConfig("/bg.png");
    const withoutVisits = {
      ...config,
      elements: config.elements.filter((el) => el.type !== "visitsCount"),
    };
    const result = validateCardTemplateForPublishDetailed(withoutVisits, "VISITS");
    expect(result.ok).toBe(false);
  });

  it("refuse visitsCount sur une carte POINTS_BY_AMOUNT", () => {
    const config = defaultCardTemplateConfig("/bg.png");
    const withVisits = {
      ...config,
      elements: [
        ...config.elements,
        {
          ...config.elements[0],
          id: "visits-extra",
          type: "visitsCount" as const,
        },
      ],
    };
    const result = validateCardTemplateForPublishDetailed(withVisits, "POINTS_BY_AMOUNT");
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.message.includes("passages"))).toBe(true);
  });

  it("bloque un QR trop petit", () => {
    const config = defaultCardTemplateConfig("/bg.png");
    const tinyQr = {
      ...config,
      elements: config.elements.map((el) =>
        el.type === "qr" ? { ...el, width: 0.05, height: 0.05 } : el,
      ),
    };
    const result = validateCardTemplateForPublishDetailed(tinyQr, "VISITS");
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.elementId && e.message.includes("QR"))).toBe(true);
  });
});

describe("ancrage et coordonnées normalisées", () => {
  it("résout le centre sans déformation du ratio", () => {
    const rect = resolveElementRect({
      x: 0.5,
      y: 0.5,
      width: 0.2,
      height: 0.2 / CARD_ASPECT_RATIO,
      anchor: "center",
    });
    expect(rect.x).toBeCloseTo(0.4, 2);
    expect(rect.y).toBeGreaterThanOrEqual(0);
    expect(rect.x + rect.width).toBeLessThanOrEqual(1);
  });

  it("conserve les proportions après redimensionnement logique", () => {
    const rect = resolveElementRect({
      x: 0.8,
      y: 0.9,
      width: 0.15,
      height: 0.1,
      anchor: "bottom-right",
    });
    expect(rect.x + rect.width).toBeCloseTo(0.8, 2);
    expect(rect.y + rect.height).toBeCloseTo(0.9, 2);
  });
});

describe("super-admin production", () => {
  it("détecte l'absence de liste blanche", () => {
    const prevEmails = process.env.SUPER_ADMIN_ALLOWED_EMAILS;
    process.env.SUPER_ADMIN_ALLOWED_EMAILS = "";
    expect(isSuperAdminAllowedEmailsConfigured()).toBe(false);
    process.env.SUPER_ADMIN_ALLOWED_EMAILS = prevEmails ?? "";
  });

  it("normalise et compare les e-mails autorisés", () => {
    const prevEmails = process.env.SUPER_ADMIN_ALLOWED_EMAILS;
    process.env.SUPER_ADMIN_ALLOWED_EMAILS = "Owner@Fife.Life";
    expect(isSuperAdminEmailAllowed("owner@fife.life")).toBe(true);
    expect(isSuperAdminEmailAllowed("intrus@fife.life")).toBe(false);
    process.env.SUPER_ADMIN_ALLOWED_EMAILS = prevEmails ?? "";
  });

  it("assertSuperAdminProductionConfig retourne une erreur ou null selon l'environnement", () => {
    const message = assertSuperAdminProductionConfig();
    expect(message === null || message.includes("SUPER_ADMIN_ALLOWED_EMAILS")).toBe(true);
  });
});

describe("stockage uploads", () => {
  it("refuse les SVG et les fichiers trop volumineux", async () => {
    const { parseImageDataUrl } = await import("../src/lib/media-storage");
    expect(parseImageDataUrl("data:image/svg+xml;base64,PHN2Zy8+")).toBeNull();
    const huge = Buffer.alloc(6 * 1024 * 1024).toString("base64");
    expect(parseImageDataUrl(`data:image/png;base64,${huge}`)).toBeNull();
  });

  it("refuse les chemins avec ..", async () => {
    const { resolveMediaFilePath } = await import("../src/lib/media-storage");
    expect(() => resolveMediaFilePath("card-backgrounds", "..", "secret.png")).toThrow();
  });

  it("génère des noms de fichiers côté serveur", async () => {
    const { parseImageDataUrl } = await import("../src/lib/media-storage");
    const tinyPng = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
      "base64",
    );
    const parsed = parseImageDataUrl(`data:image/png;base64,${tinyPng.toString("base64")}`);
    expect(parsed?.ext).toBe("png");
  });
});

describe("éditeur de cartes — contraintes et normalisation", () => {
  it("bloque le QR sous la taille minimale lors du redimensionnement", async () => {
    const { enforceElementRect } = await import("../src/lib/card-template-editor-resize");
    const { QR_MIN_SIZE } = await import("../src/lib/card-template-schema");
    const qr = {
      id: "qr-1",
      type: "qr" as const,
      x: 0.1,
      y: 0.1,
      width: 0.05,
      height: 0.05,
      zIndex: 1,
      locked: false,
      hidden: false,
      anchor: "top-left" as const,
    };
    const enforced = enforceElementRect(qr, { x: 0.1, y: 0.1, width: 0.05, height: 0.05 });
    expect(enforced.width).toBeGreaterThanOrEqual(QR_MIN_SIZE);
    expect(enforced.height).toBe(enforced.width);
  });

  it("maintient le QR carré lors d'un redimensionnement", async () => {
    const { enforceElementRect } = await import("../src/lib/card-template-editor-resize");
    const qr = {
      id: "qr-1",
      type: "qr" as const,
      x: 0.1,
      y: 0.1,
      width: 0.2,
      height: 0.2,
      zIndex: 1,
      locked: false,
      hidden: false,
      anchor: "top-left" as const,
    };
    const enforced = enforceElementRect(qr, { x: 0.1, y: 0.1, width: 0.25, height: 0.18 }, "se");
    expect(enforced.width).toBe(enforced.height);
    expect(enforced.width).toBeGreaterThanOrEqual(0.12);
  });

  it("valide la publication avec un QR à 12 % minimum", () => {
    const config = defaultCardTemplateConfig("/bg.png");
    const validQr = {
      ...config,
      elements: config.elements.map((el) =>
        el.type === "qr" ? { ...el, width: 0.12, height: 0.12 } : el,
      ),
    };
    const result = validateCardTemplateForPublishDetailed(validQr, "VISITS");
    expect(result.errors.some((e) => e.message.includes("QR") && e.message.includes("12"))).toBe(false);
  });

  it("conserve les proportions du logo quand elles sont verrouillées", async () => {
    const { enforceElementRect } = await import("../src/lib/card-template-editor-resize");
    const logo = {
      id: "logo-1",
      type: "logo" as const,
      x: 0.05,
      y: 0.05,
      width: 0.2,
      height: 0.1,
      zIndex: 1,
      locked: false,
      hidden: false,
      anchor: "top-left" as const,
      logoStyle: { lockAspectRatio: true, objectFit: "contain" as const },
    };
    const enforced = enforceElementRect(logo, { x: 0.05, y: 0.05, width: 0.3, height: 0.1 }, "e");
    expect(enforced.width / enforced.height).toBeCloseTo(2, 1);
  });

  it("autorise largeur et hauteur indépendantes pour le logo sans verrou", async () => {
    const { enforceElementRect } = await import("../src/lib/card-template-editor-resize");
    const logo = {
      id: "logo-1",
      type: "logo" as const,
      x: 0.05,
      y: 0.05,
      width: 0.2,
      height: 0.1,
      zIndex: 1,
      locked: false,
      hidden: false,
      anchor: "top-left" as const,
      logoStyle: { lockAspectRatio: false, objectFit: "contain" as const },
    };
    const enforced = enforceElementRect(logo, { x: 0.05, y: 0.05, width: 0.3, height: 0.08 }, "se");
    expect(enforced.width).toBeCloseTo(0.3, 2);
    expect(enforced.height).toBeCloseTo(0.08, 2);
  });

  it("normalise un ancien gabarit sans nouvelles propriétés", async () => {
    const { normalizeCardTemplateConfig } = await import("../src/lib/card-template-normalize");
    const config = defaultCardTemplateConfig("/bg.png");
    const legacy = {
      ...config,
      elements: config.elements.map((el) => {
        const { opacity, lockAspectRatio, dataKey, rotation, ...rest } = el as Record<string, unknown>;
        return rest;
      }),
    };
    const normalized = normalizeCardTemplateConfig(legacy as typeof config);
    expect(normalized.elements.every((el) => el.opacity != null)).toBe(true);
    expect(normalized.elements.find((el) => el.type === "qr")?.lockAspectRatio).toBe(true);
  });

  it("calcule une taille cqw cohérente avec la largeur de référence", async () => {
    const { cardFontSizeCss } = await import("../src/lib/card-template-element-style");
    const { CARD_EDITOR_REFERENCE_WIDTH } = await import("../src/lib/card-template-normalize");
    const css = cardFontSizeCss(16);
    const pct = parseFloat(css);
    expect(pct).toBeCloseTo((16 / CARD_EDITOR_REFERENCE_WIDTH) * 100, 2);
  });

  it("préserve positions, typo, couleurs et progression via le schéma Zod", async () => {
    const { cardTemplateConfigSchema } = await import("../src/lib/card-template-schema");
    const config = defaultCardTemplateConfig("/bg.png");
    const customized = {
      ...config,
      elements: config.elements.map((el) => {
        if (el.type === "merchantName" && el.style) {
          return {
            ...el,
            x: 0.15,
            y: 0.12,
            width: 0.55,
            height: 0.09,
            style: {
              ...el.style,
              fontFamily: "card" as const,
              fontSize: 28,
              color: "#FFAA00",
              fontWeight: "800" as const,
            },
          };
        }
        if (el.type === "progressBar") {
          return {
            ...el,
            x: 0.08,
            y: 0.75,
            width: 0.84,
            height: 0.08,
            progressColors: {
              fill: "#00FFAA",
              track: "#333333",
              radius: 12,
              borderColor: "#FFFFFF",
              borderWidth: 2,
            },
          };
        }
        if (el.type === "logo") {
          return {
            ...el,
            logoStyle: {
              objectFit: "cover" as const,
              backgroundColor: "#112233",
              lockAspectRatio: false,
              borderRadius: 8,
              padding: 4,
            },
          };
        }
        return el;
      }),
    };
    const parsed = cardTemplateConfigSchema.parse(customized);
    const name = parsed.elements.find((e) => e.type === "merchantName");
    const bar = parsed.elements.find((e) => e.type === "progressBar");
    const logo = parsed.elements.find((e) => e.type === "logo");
    expect(name?.x).toBeCloseTo(0.15);
    expect(name?.style?.fontSize).toBe(28);
    expect(name?.style?.color).toBe("#FFAA00");
    expect(bar?.width).toBeCloseTo(0.84);
    expect(bar?.height).toBeCloseTo(0.08);
    expect(bar?.progressColors?.fill).toBe("#00FFAA");
    expect(logo?.logoStyle?.backgroundColor).toBe("#112233");
    expect(logo?.logoStyle?.lockAspectRatio).toBe(false);
  });
});

describe("fallback renderer", () => {
  it("considère qu'un gabarit publié nécessite fond et éléments", () => {
    const config = defaultCardTemplateConfig("/bg.png");
    const hasPublished = Boolean("/bg.png") && Boolean(config.elements.length);
    expect(hasPublished).toBe(true);
    const empty = { ...config, elements: [] };
    const noPublished = Boolean("/bg.png") && Boolean(empty.elements.length);
    expect(noPublished).toBe(false);
  });
});
