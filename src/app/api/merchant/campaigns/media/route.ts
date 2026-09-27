import { z } from "zod";
import { requireMerchantAdmin, requireMutatingRequest } from "@/lib/api-guard";
import { jsonError, jsonOk, readJson } from "@/lib/http";
import { deleteCampaignMedia, saveCampaignMedia } from "@/lib/media-storage";
import { campaignMediaUploadSchema, mediaPathOrUrlSchema, zodErrorMessage } from "@/lib/validation";

/** Upload d'image de campagne/publicité — jamais stockée en base64 en base (Partie 14). */
export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const parsed = campaignMediaUploadSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  try {
    const url = await saveCampaignMedia(staff.membership.merchantId, parsed.data.dataUrl);
    return jsonOk({ url });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Image invalide.", 400);
  }
}

const deleteSchema = z.object({ url: mediaPathOrUrlSchema });

/** Retire une image ajoutée mais pas encore utilisée dans une demande envoyée (bouton « Supprimer »). */
export async function DELETE(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const parsed = deleteSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  await deleteCampaignMedia(staff.membership.merchantId, parsed.data.url);
  return jsonOk({ ok: true });
}
