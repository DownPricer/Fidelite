import { z } from "zod";
import { requireMutatingRequest, requireSuperAdmin } from "@/lib/api-guard";
import { stageAdFile } from "@/lib/ad-visuals";
import { jsonError, jsonOk, readJson } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { zodErrorMessage } from "@/lib/validation";

const uploadSchema = z.object({ dataUrl: z.string().min(1), kind: z.enum(["banniere", "original"]) });

/** Téléversement (non diffusé) du bandeau préparé par Fideto — stocké dans l'espace privé du commerce de la demande. */
export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const auth = await requireSuperAdmin(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Accès refusé.", 403);

  const { id } = await context.params;
  const ad = await prisma.adRequest.findUnique({ where: { id }, select: { merchantId: true } });
  if (!ad) return jsonError("Demande introuvable.", 404);
  const parsed = uploadSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const result = await stageAdFile(ad.merchantId, parsed.data.dataUrl, parsed.data.kind);
  if (!result.ok) return jsonError(result.error, 400);
  return jsonOk(result);
}
