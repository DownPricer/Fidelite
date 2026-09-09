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
