import type { CardTemplateConfig } from "@/lib/card-template-schema";
import { jsonOk } from "@/lib/http";
import { normalizeResolvedPublishedTemplate, resolvePublishedMerchantCardTemplate } from "@/lib/merchant-card-template-service";
import { prisma } from "@/lib/prisma";
import { isWithinUtcIntervals, type UtcInterval } from "@/lib/sponsored-hours-pricing";

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
              { city: { contains: q, mode: "insensitive" } },
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
        city: merchant.city,
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

  const now = new Date();
  const candidateAds = q
    ? []
    : await prisma.adRequest.findMany({
        where: {
          // Le worker peut avoir déjà basculé le statut affiché en LIVE (Partie 15bis) ; dans les
          // deux cas, la diffusion réelle reste décidée uniquement par hourlyIntervals ci-dessous.
          status: { in: ["SCHEDULED", "LIVE"] },
          startDate: { lte: now },
          endDate: { gte: now },
          // Une mise en avant payée en mode test n'est jamais publiée.
          OR: [{ fundingMode: null }, { fundingMode: "LIVE" }],
        },
        include: { merchant: { select: { slug: true, name: true, logoUrl: true } } },
        orderBy: { createdAt: "desc" },
        take: 20,
      });
  // startDate/endDate ne sont que les bornes globales : pour les demandes tarifées à l'heure
  // (hourlyIntervals renseigné), seuls les créneaux réellement choisis doivent diffuser — sinon
  // les heures non payées entre deux créneaux seraient diffusées gratuitement. Les anciennes
  // demandes (hourlyIntervals = null) gardent la diffusion continue historique.
  const liveAds = candidateAds
    .filter((ad) => (Array.isArray(ad.hourlyIntervals) ? isWithinUtcIntervals(now, ad.hourlyIntervals as UtcInterval[]) : true))
    .slice(0, 5);

  return jsonOk({
    merchants: merchantsWithTemplates,
    // Toujours marquées "Sponsorisé" côté UI — jamais mélangées aux résultats organiques.
    sponsored: liveAds.map((ad) => ({
      id: ad.id,
      merchantSlug: ad.merchant.slug,
      merchantName: ad.merchant.name,
      merchantLogoUrl: ad.merchant.logoUrl,
      imageUrl: ad.finalImageUrl ?? ad.requestedImageUrl,
      text: ad.requestedText,
      ctaLabel: ad.ctaLabel,
      impressionUrl: `/api/public/ads/${ad.id}/impression`,
      clickUrl: `/api/public/ads/${ad.id}/click`,
    })),
  });
}
