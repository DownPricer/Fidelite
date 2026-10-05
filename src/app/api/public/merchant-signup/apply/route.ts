import { requireMutatingRequest } from "@/lib/api-guard";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { isMerchantSignupBetaForm } from "@/lib/merchant-signup-mode";
import { submitMerchantSignupApplication } from "@/lib/merchant-signup-service";
import { merchantSignupApplicationSchema, zodMerchantSignupError } from "@/lib/merchant-signup-validation";
import { LIMITS, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  if (!isMerchantSignupBetaForm()) {
    return jsonError("Ce formulaire n'est pas actif.", 404);
  }

  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;

  const ip = clientIp(req);
  const limitedIp = rateLimit(`merchant-signup-apply:ip:${ip}`, LIMITS.merchantSignupApply.limit, LIMITS.merchantSignupApply.windowMs);
  if (!limitedIp.ok) {
    return jsonError("Trop de demandes. Réessayez plus tard.", 429);
  }

  const parsed = merchantSignupApplicationSchema.safeParse(await readJson(req));
  if (!parsed.success) {
    return jsonError(zodMerchantSignupError(parsed.error));
  }

  const email = parsed.data.email.toLowerCase();
  const limitedEmail = rateLimit(
    `merchant-signup-apply:email:${email}`,
    LIMITS.merchantSignupApply.limit,
    LIMITS.merchantSignupApply.windowMs,
  );
  if (!limitedEmail.ok) {
    return jsonError("Trop de demandes. Réessayez plus tard.", 429);
  }

  await submitMerchantSignupApplication(parsed.data);

  void userAgent(req);
  return jsonOk({
    ok: true,
    message:
      "Votre demande a bien été enregistrée. Un conseiller Fideto vous contactera rapidement. Aucun paiement n'est demandé à cette étape.",
  });
}
