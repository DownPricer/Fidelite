import { beforeEach, describe, expect, it, vi } from "vitest";

import { defaultCardTemplateConfig } from "@/lib/card-template-schema";
import { isUnlockEventType } from "@/lib/wallet-unlock";
import { resolveDisplayQrSrc } from "@/components/fife-life/merchant-card-renderer";
import {
  ALL_LOYALTY_MODES,
  adaptTemplateConfigForLoyaltyMode,
  createAllModeTemplatesForMerchant,
  duplicateTemplateToModes,
  hasPublishedTemplateForMode,
  pickCanonicalTemplate,
  resolvePublishedMerchantCardTemplate,
  summarizeTemplateForMode,
} from "@/lib/merchant-card-template-service";

const merchantCardTemplateFindFirst = vi.fn();
const merchantCardTemplateFindMany = vi.fn();
const merchantCardTemplateFindUnique = vi.fn();
const merchantCardTemplateCount = vi.fn();
const merchantCardTemplateCreate = vi.fn();
const merchantCardTemplateUpdate = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    merchantCardTemplate: {
      findFirst: (...args: unknown[]) => merchantCardTemplateFindFirst(...args),
      findMany: (...args: unknown[]) => merchantCardTemplateFindMany(...args),
      findUnique: (...args: unknown[]) => merchantCardTemplateFindUnique(...args),
      count: (...args: unknown[]) => merchantCardTemplateCount(...args),
      create: (...args: unknown[]) => merchantCardTemplateCreate(...args),
      update: (...args: unknown[]) => merchantCardTemplateUpdate(...args),
    },
  },
}));

describe("cartes par mode de fidélité", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("expose les quatre modes réels", () => {
    expect(ALL_LOYALTY_MODES).toEqual([
      "VISITS",
      "POINTS_BY_AMOUNT",
      "FIXED_POINTS",
      "AMOUNT_TIERS",
    ]);
  });

  it("permet de résumer quatre variantes indépendantes", () => {
    const templates = ALL_LOYALTY_MODES.map((loyaltyMode, index) => ({
      id: `tpl-${loyaltyMode}`,
      cardSlot: loyaltyMode,
      loyaltyMode,
      status: index === 0 ? ("PUBLISHED" as const) : ("DRAFT" as const),
      version: index + 1,
      backgroundUrl: `/bg-${loyaltyMode}.png`,
      updatedAt: new Date(`2026-09-0${index + 1}T10:00:00.000Z`),
      publishedAt: index === 0 ? new Date("2026-09-01T10:00:00.000Z") : null,
      isDefault: loyaltyMode === "VISITS",
    }));

    const summaries = ALL_LOYALTY_MODES.map((mode) =>
      summarizeTemplateForMode(templates, mode, "VISITS"),
    );

    expect(summaries).toHaveLength(4);
    expect(new Set(summaries.map((summary) => summary.templateId)).size).toBe(4);
    expect(summaries.find((summary) => summary.loyaltyMode === "VISITS")?.status).toBe("PUBLISHED");
    expect(summaries.find((summary) => summary.loyaltyMode === "POINTS_BY_AMOUNT")?.status).toBe(
      "DRAFT",
    );
  });

  it("sélectionne VISITS pour le mode passages", async () => {
    merchantCardTemplateFindFirst.mockResolvedValue({
      id: "visits-published",
      backgroundUrl: "/visits.png",
      config: defaultCardTemplateConfig("/visits.png"),
      cardSlot: "VISITS",
      loyaltyMode: "VISITS",
      version: 2,
    });

    const resolved = await resolvePublishedMerchantCardTemplate("merchant-1", "VISITS");
    expect(resolved?.loyaltyMode).toBe("VISITS");
    expect(merchantCardTemplateFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { merchantId: "merchant-1", cardSlot: "VISITS", status: "PUBLISHED" },
      }),
    );
  });

  it("sélectionne POINTS_BY_AMOUNT pour sa propre variante", async () => {
    merchantCardTemplateFindFirst.mockResolvedValue({
      id: "points-amount",
      backgroundUrl: "/points.png",
      config: defaultCardTemplateConfig("/points.png"),
      loyaltyMode: "POINTS_BY_AMOUNT",
      version: 1,
    });

    const resolved = await resolvePublishedMerchantCardTemplate("merchant-1", "POINTS_BY_AMOUNT");
    expect(resolved?.id).toBe("points-amount");
  });

  it("sélectionne FIXED_POINTS pour sa propre variante", async () => {
    merchantCardTemplateFindFirst.mockResolvedValue({
      id: "fixed-points",
      backgroundUrl: "/fixed.png",
      config: defaultCardTemplateConfig("/fixed.png"),
      loyaltyMode: "FIXED_POINTS",
      version: 1,
    });

    const resolved = await resolvePublishedMerchantCardTemplate("merchant-1", "FIXED_POINTS");
    expect(resolved?.loyaltyMode).toBe("FIXED_POINTS");
  });

  it("sélectionne AMOUNT_TIERS pour sa propre variante", async () => {
    merchantCardTemplateFindFirst.mockResolvedValue({
      id: "amount-tiers",
      backgroundUrl: "/tiers.png",
      config: defaultCardTemplateConfig("/tiers.png"),
      loyaltyMode: "AMOUNT_TIERS",
      version: 1,
    });

    const resolved = await resolvePublishedMerchantCardTemplate("merchant-1", "AMOUNT_TIERS");
    expect(resolved?.loyaltyMode).toBe("AMOUNT_TIERS");
  });

  it("adapte les éléments dynamiques selon le mode sans figer de valeurs", () => {
    const base = defaultCardTemplateConfig("/bg.png");
    const config = {
      ...base,
      elements: [
        ...base.elements,
        {
          id: "visits-1",
          type: "visitsCount" as const,
          x: 0.1,
          y: 0.5,
          width: 0.2,
          height: 0.08,
          zIndex: 2,
          locked: false,
          hidden: false,
          anchor: "top-left" as const,
        },
        {
          id: "points-1",
          type: "pointsBalance" as const,
          x: 0.1,
          y: 0.6,
          width: 0.2,
          height: 0.08,
          zIndex: 2,
          locked: false,
          hidden: false,
          anchor: "top-left" as const,
        },
      ],
    };
    const visitsConfig = adaptTemplateConfigForLoyaltyMode(config, "VISITS");
    const pointsConfig = adaptTemplateConfigForLoyaltyMode(config, "POINTS_BY_AMOUNT");

    expect(visitsConfig.elements.find((element) => element.type === "visitsCount")?.hidden).toBe(
      false,
    );
    expect(pointsConfig.elements.find((element) => element.type === "pointsBalance")?.hidden).toBe(
      false,
    );
    expect(pointsConfig.elements.find((element) => element.type === "visitsCount")?.hidden).toBe(
      true,
    );
  });

  it("ne déclenche pas d’animation de déblocage lors d’une mise à jour de carte", () => {
    expect(isUnlockEventType("MERCHANT_CARD_UPDATED")).toBe(false);
    expect(isUnlockEventType("CARD_UNLOCKED")).toBe(true);
  });

  it("n’empêche plus la publication du programme si une variante manque", async () => {
    await expect(hasPublishedTemplateForMode("merchant-1", "FIXED_POINTS")).resolves.toBe(true);
  });

  it("conserve le gabarit canonique par mode lors d’historiques multiples", () => {
    const templates = [
      {
        id: "old-published",
        cardSlot: "VISITS" as const,
        loyaltyMode: "VISITS" as const,
        status: "ARCHIVED" as const,
        isDefault: false,
        updatedAt: new Date("2026-08-01T10:00:00.000Z"),
      },
      {
        id: "current-published",
        cardSlot: "VISITS" as const,
        loyaltyMode: "VISITS" as const,
        status: "PUBLISHED" as const,
        isDefault: true,
        updatedAt: new Date("2026-09-01T10:00:00.000Z"),
      },
      {
        id: "draft-visits",
        cardSlot: "VISITS" as const,
        loyaltyMode: "VISITS" as const,
        status: "DRAFT" as const,
        isDefault: false,
        updatedAt: new Date("2026-09-02T10:00:00.000Z"),
      },
    ];

    expect(pickCanonicalTemplate(templates, "VISITS")?.id).toBe("current-published");
  });

  it("duplique vers un brouillon sans remplacer une version publiée existante", async () => {
    merchantCardTemplateFindUnique.mockResolvedValue({
      id: "source",
      merchantId: "merchant-1",
      cardSlot: "GENERAL",
      loyaltyMode: null,
      backgroundUrl: "/bg.png",
      config: defaultCardTemplateConfig("/bg.png"),
    });
    merchantCardTemplateFindFirst.mockImplementation(({ where }) => {
      if (where?.status === "DRAFT") return Promise.resolve(null);
      if (where?.status === "PUBLISHED") return Promise.resolve(null);
      return Promise.resolve(null);
    });

    const createdDraft = {
      id: "new-draft",
      cardSlot: "POINTS_BY_AMOUNT",
      loyaltyMode: "POINTS_BY_AMOUNT",
      status: "DRAFT",
    };
    merchantCardTemplateCreate.mockResolvedValue(createdDraft);

    const result = await duplicateTemplateToModes("source", ["POINTS_BY_AMOUNT"], "admin-1");
    expect(result).toHaveLength(1);
    expect(merchantCardTemplateCreate).toHaveBeenCalled();
    expect(merchantCardTemplateUpdate).not.toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "existing-published" } }),
    );
  });

  it("crée quatre variantes pour un nouveau commerce", async () => {
    merchantCardTemplateFindFirst.mockResolvedValue(null);
    merchantCardTemplateCreate.mockImplementation(({ data }) =>
      Promise.resolve({ id: `new-${data.loyaltyMode}`, ...data }),
    );

    const created = await createAllModeTemplatesForMerchant({
      merchantId: "merchant-new",
      activeMode: "VISITS",
      backgroundUrl: "/shared.png",
      duplicateToAll: true,
    });

    expect(created).toHaveLength(5);
    expect(merchantCardTemplateCreate).toHaveBeenCalledTimes(5);
  });

  it("conserve le QR réel en mode personnalisé", () => {
    const qrSrc = resolveDisplayQrSrc("personalized", true, "data:image/png;base64,real-qr");
    expect(qrSrc).toBe("data:image/png;base64,real-qr");
  });

  it("conserve un QR décoratif en aperçu public", () => {
    const qrSrc = resolveDisplayQrSrc("publicPreview", true, "data:image/png;base64,real-qr");
    expect(qrSrc).not.toBe("data:image/png;base64,real-qr");
    expect(qrSrc).toContain("data:image");
  });

  it("filtre la résolution par commerce et mode", async () => {
    merchantCardTemplateFindFirst.mockResolvedValue(null);
    await resolvePublishedMerchantCardTemplate("merchant-a", "VISITS");
    expect(merchantCardTemplateFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ merchantId: "merchant-a", cardSlot: "VISITS" }),
      }),
    );
  });
});
