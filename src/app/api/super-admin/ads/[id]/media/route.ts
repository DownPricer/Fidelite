import { requireMutatingRequest, requireSuperAdmin } from "@/lib/api-guard";
import { jsonError, jsonOk, readJson } from "@/lib/http";
import { saveCampaignMedia } from "@/lib/media-storage";
import { prisma } from "@/lib/prisma";
import { campaignMediaUploadSchema, zodErrorMessage } from "@/lib/validation";

/**
 * Upload du visuel final préparé par Fideto pour une demande de bandeau (éditeur super-admin).
 * Réutilise le même stockage que les images commerçant (saveCampaignMedia), scopé au
 * merchantId de la demande — jamais un merchantId fourni par le client.
 */
export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const auth = await requireSuperAdmin(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Accès refusé.", 403);

  const { id } = await context.params;
  const adRequest = await prisma.adRequest.findUnique({ where: { id }, select: { merchantId: true } });
  if (!adRequest) return jsonError("Demande introuvable.", 404);

  const parsed = campaignMediaUploadSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  try {
    const url = await saveCampaignMedia(adRequest.merchantId, parsed.data.dataUrl);
    return jsonOk({ url });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Image invalide.", 400);
  }
}
