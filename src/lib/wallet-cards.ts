import type { CardTemplateConfig } from "./card-template-schema";
import { prisma } from "./prisma";

export async function attachPublishedTemplates<T extends { merchantId: string; loyaltyMode?: string }>(
  cards: T[],
) {
  if (cards.length === 0) return cards;
  const merchantIds = [...new Set(cards.map((c) => c.merchantId))];
  const templates = await prisma.merchantCardTemplate.findMany({
    where: { merchantId: { in: merchantIds }, status: "PUBLISHED" },
    orderBy: [{ isDefault: "desc" }, { publishedAt: "desc" }],
  });

  const byMerchant = new Map<string, (typeof templates)[number]>();
  for (const template of templates) {
    if (!byMerchant.has(template.merchantId)) byMerchant.set(template.merchantId, template);
  }

  return cards.map((card) => {
    const template = byMerchant.get(card.merchantId);
    if (!template) return { ...card, cardTemplate: null };
    return {
      ...card,
      cardTemplate: {
        backgroundUrl: template.backgroundUrl,
        config: template.config as CardTemplateConfig,
        loyaltyMode: template.loyaltyMode,
      },
    };
  });
}
