import { z } from "zod";
import { requireMerchantAdmin, requireMutatingRequest } from "@/lib/api-guard";
import { adVisualFileSize, validateStagedAdFile, AD_SOURCE_MAX_IMAGES } from "@/lib/ad-visuals";
import { notifySuperAdmin, setAdSources, submitMerchantVersion } from "@/lib/ad-visual-workflow";
import { writeAudit } from "@/lib/audit";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { zodErrorMessage } from "@/lib/validation";

const schema = z.object({
  displayUrl: z.string().min(1).max(500).optional(),
  originalUrl: z.string().min(1).max(500).optional(),
  sourceUrls: z.array(z.string().min(1).max(500)).max(AD_SOURCE_MAX_IMAGES).optional(),
  brief: z.string().trim().max(500).nullable().optional(),
});

/**
 * Le commerçant (re)soumet son visuel : tant que la demande est en brouillon ou lui a été renvoyée
 * pour correction (NEEDS_CHANGES). Bandeau perso (SELF) → nouvelle version SUBMITTED ; Fideto crée
 * (FIDETO) → sources remplacées/retirées. Les anciennes versions et fichiers sont conservés.
 */
export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const { id } = await context.params;
  const merchantId = staff.membership.merchantId;
  const parsed = schema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const ad = await prisma.adRequest.findFirst({ where: { id, merchantId }, include: { images: true } });
  if (!ad) return jsonError("Demande introuvable.", 404);
  if (ad.status !== "DRAFT" && ad.status !== "NEEDS_CHANGES") {
    return jsonError("Le visuel ne peut plus être remplacé : il est déjà soumis ou validé.", 409, { code: "NOT_EDITABLE" });
  }

  if (ad.visualMode === "SELF") {
    if (!parsed.data.displayUrl) return jsonError("Ajoutez votre bandeau avant de soumettre.", 400);
    const display = await validateStagedAdFile(parsed.data.displayUrl, merchantId, { requireExactFormat: true });
    if (!display.ok) return jsonError(display.error, 400);
    const originalUrl = parsed.data.originalUrl ?? parsed.data.displayUrl;
    if (originalUrl !== parsed.data.displayUrl) {
      const original = await validateStagedAdFile(originalUrl, merchantId);
      if (!original.ok) return jsonError(original.error, 400);
    }
    await prisma.$transaction((tx) =>
      submitMerchantVersion(
        tx,
        ad,
        {
          url: parsed.data.displayUrl!,
          originalUrl,
          width: display.image.width,
          height: display.image.height,
          reframed: originalUrl !== parsed.data.displayUrl,
        },
        staff.user!.id,
      ),
    );
  } else {
    const urls = parsed.data.sourceUrls ?? ad.images.map((image) => image.url);
    if (urls.length < 1 || urls.length > AD_SOURCE_MAX_IMAGES) {
      return jsonError(`Envoyez entre 1 et ${AD_SOURCE_MAX_IMAGES} images.`, 400);
    }
    const sources: { url: string; sizeBytes: number | null }[] = [];
    for (const url of urls) {
      const check = await validateStagedAdFile(url, merchantId);
      if (!check.ok) return jsonError(check.error, 400);
      sources.push({ url, sizeBytes: await adVisualFileSize(url) });
    }
    await prisma.$transaction(async (tx) => {
      await setAdSources(tx, ad.id, sources);
      await tx.adRequest.update({
        where: { id: ad.id },
        data: {
          status: "PENDING_REVIEW",
          rejectionReason: null,
          ...(parsed.data.brief !== undefined ? { visualBrief: parsed.data.brief } : {}),
        },
      });
      if (ad.campaignId) {
        await tx.campaign.update({ where: { id: ad.campaignId }, data: { status: "PENDING_REVIEW", rejectionReason: null } });
      }
      await notifySuperAdmin(tx, ad, "MERCHANT_IMAGES_SENT", "Un commerçant a envoyé des images pour une création Fideto.");
    });
  }

  await writeAudit({
    actorId: staff.user.id,
    merchantId,
    action: "AD_VISUAL_SUBMITTED",
    metadata: { adRequestId: id, mode: ad.visualMode },
    ip: clientIp(req),
    userAgent: userAgent(req),
  });
  return jsonOk({ ok: true });
}
