import { z } from "zod";
import { applyAdVisualCropFromStagedOriginal, cropStateSchema } from "@/lib/apply-ad-visual-crop";
import { requireMerchantAdmin, requireMutatingRequest } from "@/lib/api-guard";
import { jsonError, jsonOk, readJson } from "@/lib/http";
import { zodErrorMessage } from "@/lib/validation";

const bodySchema = z.object({
  merchantId: z.string().min(1),
  originalUrl: z.string().min(1),
  target: z.enum(["banniere", "google-wallet-hero"]),
  crop: cropStateSchema,
});

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const parsed = bodySchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const auth = await requireMerchantAdmin(req, parsed.data.merchantId);
  if (auth.error || !auth.membership) return auth.error ?? jsonError("Accès refusé.", 403);

  const result = await applyAdVisualCropFromStagedOriginal({
    merchantId: parsed.data.merchantId,
    originalUrl: parsed.data.originalUrl,
    target: parsed.data.target,
    crop: parsed.data.crop,
  });
  if (!result.ok) return jsonError(result.error, 400);
  return jsonOk(result);
}
