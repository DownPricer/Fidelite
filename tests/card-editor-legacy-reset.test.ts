import { describe, expect, it, vi } from "vitest";
import { defaultCardTemplateConfig } from "@/lib/card-template-schema";
import {
  applyEditorAutoFix,
  migrateLegacyOnLoad,
  summarizeEditorValidation,
} from "@/lib/card-template-editor-validation";
import { normalizeCardTemplateForSlot } from "@/lib/card-template-normalize";
import {
  findLegacyLoyaltyElements,
  migrateLegacyLoyaltyElements,
} from "@/lib/loyalty-widget";
import {
  freshDraftConfigForSlot,
  restoreDraftFromPublished,
  resetDraftForSlot,
} from "@/lib/merchant-card-template-service";

const merchantFindFirst = vi.fn();
const templateFindFirst = vi.fn();
const templateUpdate = vi.fn();
const templateCreate = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    merchantCardTemplate: {
      findFirst: (...args: unknown[]) => templateFindFirst(...args),
      update: (...args: unknown[]) => templateUpdate(...args),
      create: (...args: unknown[]) => templateCreate(...args),
    },
  },
}));

function legacyHeavyConfig() {
  const base = defaultCardTemplateConfig("/bg.png");
  return {
    ...base,
    elements: [
      ...base.elements.filter((el) => el.type !== "loyaltyWidget"),
      {
        id: "visits-1",
        type: "visitsCount" as const,
        x: 0.1,
        y: 0.5,
        width: 0.2,
        height: 0.08,
        zIndex: 4,
        locked: false,
        hidden: false,
        anchor: "top-left" as const,
      },
      {
        id: "points-1",
        type: "pointsBalance" as const,
        x: 0.1,
        y: 0.58,
        width: 0.2,
        height: 0.08,
        zIndex: 5,
        locked: false,
        hidden: false,
        anchor: "top-left" as const,
      },
      {
        id: "bar-1",
        type: "progressBar" as const,
        x: 0.06,
        y: 0.62,
        width: 0.88,
        height: 0.08,
        zIndex: 6,
        locked: false,
        hidden: false,
        anchor: "top-left" as const,
        progressColors: { fill: "#FF0000", track: "#333333", radius: 6 },
      },
    ],
  };
}

describe("éditeur — éléments legacy et réinitialisation", () => {
  it("convertit plusieurs éléments atomiques en un seul loyaltyWidget", () => {
    const migrated = migrateLegacyLoyaltyElements(legacyHeavyConfig(), "FIXED_POINTS");
    expect(migrated.elements.filter((el) => el.type === "loyaltyWidget")).toHaveLength(1);
    expect(findLegacyLoyaltyElements(migrated)).toHaveLength(0);
    const widget = migrated.elements.find((el) => el.type === "loyaltyWidget");
    expect(widget?.loyaltyWidget?.loyaltyMode).toBe("FIXED_POINTS");
  });

  it("normalise côté client et serveur de la même manière", () => {
    const raw = legacyHeavyConfig();
    const client = normalizeCardTemplateForSlot(raw, "FIXED_POINTS");
    const server = normalizeCardTemplateForSlot(raw, "FIXED_POINTS");
    expect(client.elements.map((el) => el.type)).toEqual(server.elements.map((el) => el.type));
    expect(findLegacyLoyaltyElements(client)).toHaveLength(0);
  });

  it("affiche une seule alerte legacy", () => {
    const summary = summarizeEditorValidation(legacyHeavyConfig(), "FIXED_POINTS");
    const legacyIssues = summary.issues.filter((issue) => issue.code === "legacy_loyalty_elements");
    expect(legacyIssues).toHaveLength(1);
    expect(legacyIssues[0]?.autoFix).toBe("migrate_legacy");
  });

  it("corrige automatiquement les éléments legacy", () => {
    const fixed = applyEditorAutoFix(legacyHeavyConfig(), "FIXED_POINTS", "migrate_legacy");
    expect(findLegacyLoyaltyElements(fixed)).toHaveLength(0);
    expect(fixed.elements.some((el) => el.type === "loyaltyWidget")).toBe(true);
    expect(summarizeEditorValidation(fixed, "FIXED_POINTS").issues.some((i) => i.code === "legacy_loyalty_elements")).toBe(false);
  });

  it("propose d’ajouter le bloc obligatoire manquant", () => {
    const base = defaultCardTemplateConfig("/bg.png");
    const withoutWidget = {
      ...base,
      elements: base.elements.filter((el) => el.type !== "loyaltyWidget"),
    };
    const summary = summarizeEditorValidation(withoutWidget, "FIXED_POINTS");
    const missing = summary.issues.find((issue) => issue.code === "missing_loyalty_widget");
    expect(missing).toBeTruthy();
    expect(missing?.autoFix).toBe("add_loyalty_widget");
    const fixed = applyEditorAutoFix(withoutWidget, "FIXED_POINTS", "add_loyalty_widget");
    expect(fixed.elements.some((el) => el.type === "loyaltyWidget")).toBe(true);
  });

  it("migre au chargement sans laisser d’éléments invisibles", () => {
    const { config, migrated } = migrateLegacyOnLoad(legacyHeavyConfig(), "FIXED_POINTS");
    expect(migrated).toBe(true);
    expect(findLegacyLoyaltyElements(config)).toHaveLength(0);
    expect(config.elements.some((el) => el.type === "loyaltyWidget")).toBe(true);
  });

  it("freshDraftConfigForSlot FIXED_POINTS contient QR et bloc obligatoires", () => {
    const fresh = freshDraftConfigForSlot("FIXED_POINTS");
    expect(fresh.elements.some((el) => el.type === "merchantName")).toBe(true);
    expect(fresh.elements.some((el) => el.type === "clientName")).toBe(true);
    expect(fresh.elements.some((el) => el.type === "qr")).toBe(true);
    expect(fresh.elements.some((el) => el.type === "loyaltyWidget")).toBe(true);
    expect(fresh.elements.some((el) => el.type === "nextReward")).toBe(true);
    expect(fresh.background.url).toBe("");
  });

  it("freshDraftConfigForSlot GENERAL n’a pas de bloc fidélité", () => {
    const fresh = freshDraftConfigForSlot("GENERAL");
    expect(fresh.elements.some((el) => el.type === "loyaltyWidget")).toBe(false);
    expect(findLegacyLoyaltyElements(fresh)).toHaveLength(0);
  });

  it("resetDraftForSlot ne touche qu’un brouillon du slot demandé", async () => {
    vi.clearAllMocks();
    templateFindFirst.mockResolvedValue({ id: "draft-fixed", merchantId: "m1", cardSlot: "FIXED_POINTS" });
    templateUpdate.mockResolvedValue({ id: "draft-fixed", cardSlot: "FIXED_POINTS", status: "DRAFT" });
    await resetDraftForSlot("m1", "FIXED_POINTS");
    expect(templateFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { merchantId: "m1", cardSlot: "FIXED_POINTS", status: "DRAFT" } }),
    );
    expect(templateUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ backgroundUrl: null }),
      }),
    );
  });

  it("restoreDraftFromPublished reprend la version publiée", async () => {
    vi.clearAllMocks();
    const publishedConfig = freshDraftConfigForSlot("FIXED_POINTS");
    templateFindFirst
      .mockResolvedValueOnce({
        id: "pub-1",
        merchantId: "m1",
        cardSlot: "FIXED_POINTS",
        status: "PUBLISHED",
        backgroundUrl: "/published-bg.png",
        config: publishedConfig,
        authorId: "admin-1",
      })
      .mockResolvedValueOnce({ id: "draft-1", merchantId: "m1", cardSlot: "FIXED_POINTS", status: "DRAFT" });
    templateUpdate.mockResolvedValue({
      id: "draft-1",
      cardSlot: "FIXED_POINTS",
      status: "DRAFT",
      backgroundUrl: "/published-bg.png",
      config: publishedConfig,
    });

    const result = await restoreDraftFromPublished("m1", "FIXED_POINTS");
    expect(result.error).toBeNull();
    expect(result.template?.backgroundUrl).toBe("/published-bg.png");
    expect(templateUpdate).toHaveBeenCalled();
  });

  it("restoreDraftFromPublished échoue sans version publiée", async () => {
    vi.clearAllMocks();
    templateFindFirst.mockResolvedValueOnce(null);
    const result = await restoreDraftFromPublished("m1", "VISITS");
    expect(result.error).toBe("no_published");
  });
});
