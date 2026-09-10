import type { CardTemplateConfig } from "@/lib/card-template-schema";
import { jsonOk } from "@/lib/http";
import { normalizeResolvedPublishedTemplate, resolvePublishedMerchantCardTemplate } from "@/lib/merchant-card-template-service";
import { prisma } from "@/lib/prisma";

/** Annuaire public — aucune donnée client, gabarit publié uniquement. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim() ?? "";
  const limit = Math.min(30, Math.max(1, Number(url.searchParams.get("limit") ?? 20)));

  const merchants = await prisma.merchant.findMany({
    where: {
      isActive: true,
      visibleInSearch: true,
      status: { in: ["ACTIVE", "TRIAL"] },
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { slug: { contains: q, mode: "insensitive" } },
              { category: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      program: true,
    },
    orderBy: { name: "asc" },
    take: limit,
  });

  const merchantsWithTemplates = await Promise.all(
    merchants.map(async (merchant) => {
      const activeMode = merchant.program?.mode ?? "VISITS";
      const published = await resolvePublishedMerchantCardTemplate(merchant.id, activeMode);
      const cardTemplate = normalizeResolvedPublishedTemplate(published);
      return {
        slug: merchant.slug,
        name: merchant.name,
        logoUrl: merchant.logoUrl,
        primaryColor: merchant.primaryColor,
        category: merchant.category,
        shortDescription: merchant.shortDescription,
        rewardLabel: merchant.program?.rewardLabel ?? "Récompense",
        visitsRequired: merchant.program?.visitsRequired ?? 10,
        loyaltyMode: activeMode,
        cardTemplate: cardTemplate
          ? {
              backgroundUrl: cardTemplate.backgroundUrl,
              config: cardTemplate.config as CardTemplateConfig,
              loyaltyMode: cardTemplate.loyaltyMode,
            }
          : null,
      };
    }),
  );

  return jsonOk({ merchants: merchantsWithTemplates });
}
