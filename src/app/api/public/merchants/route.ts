import { jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import type { CardTemplateConfig } from "@/lib/card-template-schema";

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
      cardTemplates: {
        where: { status: "PUBLISHED" },
        orderBy: [{ isDefault: "desc" }, { publishedAt: "desc" }],
        take: 1,
      },
    },
    orderBy: { name: "asc" },
    take: limit,
  });

  return jsonOk({
    merchants: merchants.map((merchant) => {
      const template = merchant.cardTemplates[0] ?? null;
      return {
        slug: merchant.slug,
        name: merchant.name,
        logoUrl: merchant.logoUrl,
        primaryColor: merchant.primaryColor,
        category: merchant.category,
        shortDescription: merchant.shortDescription,
        rewardLabel: merchant.program?.rewardLabel ?? "Récompense",
        visitsRequired: merchant.program?.visitsRequired ?? 10,
        loyaltyMode: merchant.program?.mode ?? "VISITS",
        cardTemplate: template
          ? {
              backgroundUrl: template.backgroundUrl,
              config: template.config as CardTemplateConfig,
              loyaltyMode: template.loyaltyMode,
            }
          : null,
      };
    }),
  });
}
