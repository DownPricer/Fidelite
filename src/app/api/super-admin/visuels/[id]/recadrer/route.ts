import { z } from "zod";
import { applyAdVisualCropFromStagedOriginal, cropStateSchema } from "@/lib/apply-ad-visual-crop";
import { requireMutatingRequest, requireSuperAdmin } from "@/lib/api-guard";
import { jsonError, jsonOk, readJson } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { zodErrorMessage } from "@/lib/validation";

const bodySchema = z.object({
  originalUrl: z.string().min(1),
  target: z.enum(["banniere", "google-wallet-hero"]),
  crop: cropStateSchema,
});

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const auth = await requireSuperAdmin(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Accès refusé.", 403);

  const { id } = await context.params;
  const ad = await prisma.adRequest.findUnique({ where: { id }, select: { merchantId: true } });
  if (!ad) return jsonError("Demande introuvable.", 404);

  const parsed = bodySchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const result = await applyAdVisualCropFromStagedOriginal({
    merchantId: ad.merchantId,
    originalUrl: parsed.data.originalUrl,
    target: parsed.data.target,
    crop: parsed.data.crop,
  });
  if (!result.ok) return jsonError(result.error, 400);
  return jsonOk(result);
}
