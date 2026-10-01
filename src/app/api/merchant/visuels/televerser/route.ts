import { z } from "zod";
import { requireMerchantAdmin, requireMutatingRequest } from "@/lib/api-guard";
import { deleteAdVisualFileByUrl, isAdVisualUrlOfMerchant, stageAdFile } from "@/lib/ad-visuals";
import { jsonError, jsonOk, readJson } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { zodErrorMessage } from "@/lib/validation";

const uploadSchema = z.object({
  dataUrl: z.string().min(1),
  kind: z.enum(["source", "banniere", "original"]),
});

/** Téléversement privé d'un fichier de visuel (source, original ou bandeau au format exact) — espace du commerce uniquement. */
export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const parsed = uploadSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));
  const result = await stageAdFile(staff.membership.merchantId, parsed.data.dataUrl, parsed.data.kind);
  if (!result.ok) return jsonError(result.error, 400);
  return jsonOk(result);
}

/** Retire un fichier téléversé mais pas encore rattaché à une demande (jamais un fichier conservé en historique). */
export async function DELETE(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const body = (await readJson<{ url?: string }>(req)) ?? {};
  const url = body.url ?? "";
  const merchantId = staff.membership.merchantId;
  if (!isAdVisualUrlOfMerchant(url, merchantId)) return jsonError("Fichier non autorisé.", 403);

  const [inVersion, inSource, inAd] = await Promise.all([
    prisma.adVisualVersion.findFirst({ where: { OR: [{ url }, { originalUrl: url }] }, select: { id: true } }),
    prisma.adRequestImage.findFirst({ where: { url }, select: { id: true } }),
    prisma.adRequest.findFirst({ where: { OR: [{ requestedImageUrl: url }, { finalImageUrl: url }] }, select: { id: true } }),
  ]);
  if (!inVersion && !inSource && !inAd) await deleteAdVisualFileByUrl(url);
  return jsonOk({ ok: true });
}
