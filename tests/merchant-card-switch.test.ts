import { describe, expect, it, vi, beforeEach } from "vitest";

import { defaultCardTemplateConfig } from "@/lib/card-template-schema";
import { mergeMerchantCardUpdate } from "@/lib/merchant-card-update";
import { isUnlockEventType } from "@/lib/wallet-unlock";
import {
  normalizeResolvedPublishedTemplate,
  resolvePublishedMerchantCardTemplate,
} from "@/lib/merchant-card-template-service";
import { attachPublishedTemplates } from "@/lib/wallet-cards";

const merchantCardTemplateFindFirst = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    merchantCardTemplate: {
      findFirst: (...args: unknown[]) => merchantCardTemplateFindFirst(...args),
    },
  },
}));

describe("changement de programme → variante de carte", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("résout VISITS via cardSlot explicite", async () => {
    merchantCardTemplateFindFirst.mockResolvedValueOnce({
      id: "visits-tpl",
      backgroundUrl: "/visits.png",
      config: defaultCardTemplateConfig("/visits.png"),
      cardSlot: "VISITS",
      version: 3,
    });

    const resolved = await resolvePublishedMerchantCardTemplate("merchant-1", "VISITS");
    expect(resolved?.id).toBe("visits-tpl");
    expect(resolved?.usedFallback).toBe(false);
    expect(merchantCardTemplateFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { merchantId: "merchant-1", cardSlot: "VISITS", status: "PUBLISHED" },
      }),
    );
  });

  it("résout POINTS_BY_AMOUNT sans retourner VISITS", async () => {
    merchantCardTemplateFindFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        id: "general-tpl",
        backgroundUrl: "/general.png",
        config: defaultCardTemplateConfig("/general.png"),
        cardSlot: "GENERAL",
        version: 1,
      });

    const resolved = await resolvePublishedMerchantCardTemplate("merchant-1", "POINTS_BY_AMOUNT");
    expect(resolved?.usedFallback).toBe(true);
    expect(resolved?.cardSlot).toBe("GENERAL");
    expect(merchantCardTemplateFindFirst).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        where: { merchantId: "merchant-1", cardSlot: "POINTS_BY_AMOUNT", status: "PUBLISHED" },
      }),
    );
    expect(merchantCardTemplateFindFirst).not.toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ cardSlot: "VISITS" }),
      }),
    );
  });

  it("attache la variante selon le mode actif du programme", async () => {
    merchantCardTemplateFindFirst.mockResolvedValue({
      id: "fixed-tpl",
      backgroundUrl: "/fixed.png",
      config: defaultCardTemplateConfig("/fixed.png"),
      cardSlot: "FIXED_POINTS",
      version: 2,
    });

    const [card] = await attachPublishedTemplates([
      {
        merchantId: "merchant-1",
        loyaltyMode: "FIXED_POINTS",
      },
    ]);

    expect(card.cardTemplateId).toBe("fixed-tpl");
    expect(card.cardTemplateVersion).toBe(2);
    expect(card.loyaltyMode).toBe("FIXED_POINTS");
  });

  it("merge MERCHANT_CARD_UPDATED sans déclencher CARD_UNLOCKED", () => {
    const base = {
      id: "mem-1",
      merchantId: "merchant-1",
      slug: "demo",
      name: "Demo",
      logoUrl: null,
      primaryColor: "#8557ff",
      points: 40,
      visitsRequired: 10,
      rewardLabel: "Cadeau",
      loyaltyMode: "VISITS" as const,
      cardTemplate: null,
    };
    const normalized = normalizeResolvedPublishedTemplate({
      id: "points-tpl",
      backgroundUrl: "/points.png",
      config: defaultCardTemplateConfig("/points.png"),
      cardSlot: "POINTS_BY_AMOUNT",
      loyaltyMode: "POINTS_BY_AMOUNT",
      version: 4,
      usedFallback: false,
    });
    const merged = mergeMerchantCardUpdate(base, {
      loyaltyMode: "POINTS_BY_AMOUNT",
      templateId: "points-tpl",
      templateVersion: 4,
      cardTemplate: normalized,
    });
    expect(merged.loyaltyMode).toBe("POINTS_BY_AMOUNT");
    expect(merged.cardTemplate?.loyaltyMode).toBe("POINTS_BY_AMOUNT");
    expect(isUnlockEventType("MERCHANT_CARD_UPDATED")).toBe(false);
  });

  it("n'utilise jamais l'ancienne variante comme fallback intermédiaire", async () => {
    merchantCardTemplateFindFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        id: "general-only",
        backgroundUrl: "/g.png",
        config: defaultCardTemplateConfig("/g.png"),
        cardSlot: "GENERAL",
        version: 1,
      });

    const resolved = await resolvePublishedMerchantCardTemplate("merchant-1", "AMOUNT_TIERS");
    expect(resolved?.id).toBe("general-only");
    expect(merchantCardTemplateFindFirst.mock.calls).toHaveLength(2);
    expect(merchantCardTemplateFindFirst.mock.calls[0][0].where.cardSlot).toBe("AMOUNT_TIERS");
    expect(merchantCardTemplateFindFirst.mock.calls[1][0].where.cardSlot).toBe("GENERAL");
  });
});
