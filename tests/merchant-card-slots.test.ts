import { beforeEach, describe, expect, it, vi } from "vitest";

import { defaultCardTemplateConfig } from "@/lib/card-template-schema";
import { isUnlockEventType } from "@/lib/wallet-unlock";
import { resolveDisplayQrSrc } from "@/components/fife-life/merchant-card-renderer";
import {
  ALL_MERCHANT_CARD_SLOTS,
  CARD_SLOT_TITLES,
  cardSlotEditorPath,
  merchantCardsGalleryPath,
  parseCardSlotSlug,
} from "@/lib/merchant-card-slots";
import {
  duplicateTemplateToSlots,
  pickCanonicalTemplate,
  resolvePublishedMerchantCardTemplate,
  summarizeTemplateForSlot,
} from "@/lib/merchant-card-template-service";

const merchantCardTemplateFindFirst = vi.fn();
const merchantCardTemplateFindUnique = vi.fn();
const merchantCardTemplateCreate = vi.fn();
const merchantCardTemplateUpdate = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    merchantCardTemplate: {
      findFirst: (...args: unknown[]) => merchantCardTemplateFindFirst(...args),
      findUnique: (...args: unknown[]) => merchantCardTemplateFindUnique(...args),
      create: (...args: unknown[]) => merchantCardTemplateCreate(...args),
      update: (...args: unknown[]) => merchantCardTemplateUpdate(...args),
    },
  },
}));

describe("cinq emplacements de cartes commerçant", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("expose exactement cinq emplacements", () => {
    expect(ALL_MERCHANT_CARD_SLOTS).toHaveLength(5);
    expect(CARD_SLOT_TITLES.GENERAL).toBe("Carte générale du commerce");
  });

  it("résume cinq emplacements avec aperçu possible", () => {
    const templates = ALL_MERCHANT_CARD_SLOTS.map((cardSlot, index) => ({
      id: `tpl-${cardSlot}`,
      cardSlot,
      status: index === 0 ? ("PUBLISHED" as const) : ("DRAFT" as const),
      version: 1,
      backgroundUrl: `/bg-${cardSlot}.png`,
      updatedAt: new Date("2026-09-10T10:00:00.000Z"),
      publishedAt: index === 0 ? new Date("2026-09-10T10:00:00.000Z") : null,
      isDefault: false,
    }));

    const summaries = ALL_MERCHANT_CARD_SLOTS.map((cardSlot) =>
      summarizeTemplateForSlot(templates, cardSlot, "VISITS"),
    );

    expect(summaries).toHaveLength(5);
    expect(summaries.every((summary) => summary.title.length > 0)).toBe(true);
    expect(summaries.find((summary) => summary.status === "unconfigured")).toBeUndefined();
  });

  it("signale une carte à créer quand l’emplacement est vide", () => {
    const summary = summarizeTemplateForSlot([], "FIXED_POINTS", "VISITS");
    expect(summary.displayStatus).toBe("Carte à créer");
    expect(summary.templateId).toBeNull();
  });

  it("signale une carte modifiable quand un brouillon existe", () => {
    const summary = summarizeTemplateForSlot(
      [
        {
          id: "draft-1",
          cardSlot: "VISITS",
          status: "DRAFT",
          version: 1,
          backgroundUrl: "/bg.png",
          updatedAt: new Date("2026-09-10T10:00:00.000Z"),
          publishedAt: null,
          isDefault: false,
        },
      ],
      "VISITS",
      "VISITS",
    );
    expect(summary.displayStatus).toBe("Brouillon");
    expect(summary.templateId).toBe("draft-1");
  });

  it("marque l’emplacement actif selon le programme réel", () => {
    const templates = [
      {
        id: "visits-pub",
        cardSlot: "VISITS" as const,
        status: "PUBLISHED" as const,
        version: 2,
        backgroundUrl: "/v.png",
        updatedAt: new Date("2026-09-10T10:00:00.000Z"),
        publishedAt: new Date("2026-09-10T10:00:00.000Z"),
        isDefault: true,
      },
      {
        id: "general-pub",
        cardSlot: "GENERAL" as const,
        status: "PUBLISHED" as const,
        version: 1,
        backgroundUrl: "/g.png",
        updatedAt: new Date("2026-09-09T10:00:00.000Z"),
        publishedAt: new Date("2026-09-09T10:00:00.000Z"),
        isDefault: false,
      },
    ];

    const visitsSummary = summarizeTemplateForSlot(templates, "VISITS", "VISITS");
    const generalSummary = summarizeTemplateForSlot(templates, "GENERAL", "VISITS");
    expect(visitsSummary.isCurrentlyUsed).toBe(true);
    expect(generalSummary.isCurrentlyUsed).toBe(false);
  });

  it("utilise la carte générale si la variante programme est absente", async () => {
    merchantCardTemplateFindFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        id: "general",
        backgroundUrl: "/general.png",
        config: defaultCardTemplateConfig("/general.png"),
        cardSlot: "GENERAL",
        loyaltyMode: null,
        version: 1,
      });

    const resolved = await resolvePublishedMerchantCardTemplate("merchant-1", "FIXED_POINTS");
    expect(resolved?.usedFallback).toBe(true);
    expect(resolved?.cardSlot).toBe("GENERAL");
    expect(resolved?.loyaltyMode).toBe("FIXED_POINTS");
  });

  it("sélectionne la variante programme quand elle est publiée", async () => {
    merchantCardTemplateFindFirst.mockResolvedValueOnce({
      id: "fixed",
      backgroundUrl: "/fixed.png",
      config: defaultCardTemplateConfig("/fixed.png"),
      cardSlot: "FIXED_POINTS",
      loyaltyMode: "FIXED_POINTS",
      version: 1,
    });

    const resolved = await resolvePublishedMerchantCardTemplate("merchant-1", "FIXED_POINTS");
    expect(resolved?.usedFallback).toBe(false);
    expect(resolved?.cardSlot).toBe("FIXED_POINTS");
  });

  it("duplique vers un brouillon indépendant sans écraser une version publiée", async () => {
    merchantCardTemplateFindUnique.mockResolvedValue({
      id: "source",
      merchantId: "merchant-1",
      cardSlot: "GENERAL",
      backgroundUrl: "/bg.png",
      config: defaultCardTemplateConfig("/bg.png"),
    });
    merchantCardTemplateFindFirst.mockImplementation(({ where }) => {
      if (where?.status === "DRAFT") return Promise.resolve(null);
      if (where?.cardSlot === "VISITS" && where?.status === "PUBLISHED") {
        return Promise.resolve({ id: "published-visits" });
      }
      return Promise.resolve(null);
    });

    await expect(
      duplicateTemplateToSlots("source", ["VISITS"], "admin-1"),
    ).rejects.toThrow(/version publiée/i);
    expect(merchantCardTemplateCreate).not.toHaveBeenCalled();
  });

  it("ne déclenche pas d’animation de déblocage lors d’une mise à jour de carte", () => {
    expect(isUnlockEventType("MERCHANT_CARD_UPDATED")).toBe(false);
  });

  it("conserve le QR réel en mode personnalisé", () => {
    expect(resolveDisplayQrSrc("personalized", true, "data:image/png;base64,real-qr")).toBe(
      "data:image/png;base64,real-qr",
    );
  });

  it("conserve les gabarits canoniques par emplacement", () => {
    const canonical = pickCanonicalTemplate(
      [
        {
          cardSlot: "AMOUNT_TIERS",
          status: "DRAFT",
          isDefault: false,
          updatedAt: new Date("2026-09-11T10:00:00.000Z"),
        },
        {
          cardSlot: "AMOUNT_TIERS",
          status: "PUBLISHED",
          isDefault: true,
          updatedAt: new Date("2026-09-10T10:00:00.000Z"),
        },
      ],
      "AMOUNT_TIERS",
    );
    expect(canonical?.status).toBe("PUBLISHED");
  });

  it("expose les routes galerie et éditeur par variante", () => {
    expect(merchantCardsGalleryPath("merchant-1")).toBe("/super-admin/commerces/merchant-1/cartes");
    expect(cardSlotEditorPath("merchant-1", "VISITS")).toBe(
      "/super-admin/cartes/merchant-1/visits/editeur",
    );
    expect(parseCardSlotSlug("general")).toBe("GENERAL");
  });
});
