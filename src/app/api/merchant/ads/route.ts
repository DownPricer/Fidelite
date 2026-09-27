import { requireMerchantAdmin, requireMutatingRequest } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { priceSponsoredHours, scheduleToUtcIntervals, validateSponsoredSchedule } from "@/lib/sponsored-hours-pricing";
import { adRequestCreateSchema, zodErrorMessage } from "@/lib/validation";

/** Partie 12 étapes 1-2 : le commerçant envoie sa demande de bandeau, qui part en attente Fideto. */
export async function GET(req: Request) {
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const ads = await prisma.adRequest.findMany({
    where: { merchantId: staff.membership.merchantId },
    orderBy: { createdAt: "desc" },
    include: { campaign: { include: { payment: true } }, images: { orderBy: { position: "asc" } } },
  });
  return jsonOk({ ads });
}

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const parsed = adRequestCreateSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const scheduleCheck = validateSponsoredSchedule(parsed.data.hourlySchedule);
  if (!scheduleCheck.ok) return jsonError(scheduleCheck.error);

  const intervals = scheduleToUtcIntervals(parsed.data.hourlySchedule);
  if (intervals.length === 0) return jsonError("Aucun créneau diffusable dans ce planning.");
  const start = new Date(intervals[0].start);
  const end = new Date(intervals[intervals.length - 1].end);

  const merchantId = staff.membership.merchantId;
  const days = parsed.data.hourlySchedule.length;
  const pricingEstimate = priceSponsoredHours(parsed.data.hourlySchedule);

  const visualMode = parsed.data.visualMode;
  const requestedImageUrl = visualMode === "SELF" ? (parsed.data.requestedImageUrl ?? null) : null;
  const requestedImageUrls = visualMode === "FIDETO" ? (parsed.data.requestedImageUrls ?? []) : [];

  const result = await prisma.$transaction(async (tx) => {
    const campaign = await tx.campaign.create({
      data: {
        merchantId,
        channel: "SPONSORED_AD",
        audienceType: null,
        status: "PENDING_REVIEW",
        title: `Publicité sponsorisée (${days} j, ${pricingEstimate.totalHours} h)`,
        body: parsed.data.requestedText,
        // Visuel déjà final (SELF) affiché tel quel une fois approuvé ; FIDETO reste sans image
        // tant que le super-admin n'a pas choisi finalImageUrl (jamais les brouillons envoyés).
        imageUrl: requestedImageUrl,
        actionLabel: parsed.data.ctaLabel ?? null,
        actionUrl: parsed.data.ctaUrl ?? null,
        quotaKind: "SPONSORED_DAY",
        createdBy: staff.user!.id,
      },
    });
    const adRequest = await tx.adRequest.create({
      data: {
        merchantId,
        campaignId: campaign.id,
        status: "PENDING_REVIEW",
        requestedText: parsed.data.requestedText,
        visualMode,
        requestedImageUrl,
        objective: parsed.data.objective ?? null,
        ctaLabel: parsed.data.ctaLabel ?? null,
        ctaUrl: parsed.data.ctaUrl ?? null,
        startDate: start,
        endDate: end,
        hourlySchedule: parsed.data.hourlySchedule,
        hourlyIntervals: intervals,
      },
    });
    if (requestedImageUrls.length > 0) {
      await tx.adRequestImage.createMany({
        data: requestedImageUrls.map((url, position) => ({ adRequestId: adRequest.id, url, position })),
      });
    }
    return { campaign, adRequest };
  });

  await writeAudit({
    actorId: staff.user.id,
    merchantId,
    action: "AD_REQUEST_CREATED",
    metadata: { adRequestId: result.adRequest.id, campaignId: result.campaign.id, days },
    ip: clientIp(req),
    userAgent: userAgent(req),
  });

  return jsonOk({ adRequest: result.adRequest, campaign: result.campaign });
}
