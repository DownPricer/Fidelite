import type { LoyaltyMode } from "@prisma/client";
import { prisma } from "./prisma";
import type { CardTemplateConfig } from "./card-template-schema";

export async function getPublishedCardTemplate(merchantId: string, loyaltyMode?: LoyaltyMode) {
  const template = await prisma.merchantCardTemplate.findFirst({
    where: {
      merchantId,
      status: "PUBLISHED",
      ...(loyaltyMode ? { loyaltyMode } : {}),
    },
    orderBy: [{ isDefault: "desc" }, { publishedAt: "desc" }],
  });
  if (!template) return null;
  return {
    id: template.id,
    backgroundUrl: template.backgroundUrl,
    config: template.config as CardTemplateConfig,
    loyaltyMode: template.loyaltyMode,
    version: template.version,
  };
}
