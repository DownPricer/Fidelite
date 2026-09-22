import { requireMerchantAdmin, requireMutatingRequest } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { adRequestCreateSchema, zodErrorMessage } from "@/lib/validation";

/** Partie 12 étapes 1-2 : le commerçant envoie sa demande de bandeau, qui part en attente Fidelo. */
export async function GET(req: Request) {
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const ads = await prisma.adRequest.findMany({
    where: { merchantId: staff.membership.merchantId },
    orderBy: { createdAt: "desc" },
    include: { campaign: { include: { payment: true } } },
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

  const start = new Date(parsed.data.startDate);
  const end = new Date(parsed.data.endDate);
  if (end <= start) return jsonError("La date de fin doit être après la date de début.");

  const merchantId = staff.membership.merchantId;
  const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86_400_000));

  const result = await prisma.$transaction(async (tx) => {
    const campaign = await tx.campaign.create({
      data: {
        merchantId,
        channel: "SPONSORED_AD",
        audienceType: null,
        status: "PENDING_REVIEW",
        title: `Publicité sponsorisée (${days} j)`,
        body: parsed.data.requestedText,
        imageUrl: parsed.data.requestedImageUrl ?? null,
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
        requestedImageUrl: parsed.data.requestedImageUrl ?? null,
        objective: parsed.data.objective ?? null,
        ctaLabel: parsed.data.ctaLabel ?? null,
        ctaUrl: parsed.data.ctaUrl ?? null,
        startDate: start,
        endDate: end,
      },
    });
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
