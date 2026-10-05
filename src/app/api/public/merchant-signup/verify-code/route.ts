import { requireMutatingRequest } from "@/lib/api-guard";
import { clientIp, jsonError, jsonOk, readJson } from "@/lib/http";
import { isMerchantSignupBetaForm } from "@/lib/merchant-signup-mode";
import { verifyMerchantSignupCode } from "@/lib/merchant-signup-service";
import { merchantSignupVerifyCodeSchema, zodMerchantSignupError } from "@/lib/merchant-signup-validation";
import { LIMITS, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  if (!isMerchantSignupBetaForm()) {
    return jsonError("Ce parcours n'est pas actif.", 404);
  }

  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;

  const parsed = merchantSignupVerifyCodeSchema.safeParse(await readJson(req));
  if (!parsed.success) {
    return jsonError(zodMerchantSignupError(parsed.error));
  }

  const ip = clientIp(req);
  const email = parsed.data.email.toLowerCase();
  const limitedIp = rateLimit(`merchant-signup-code:ip:${ip}`, LIMITS.merchantSignupCode.limit, LIMITS.merchantSignupCode.windowMs);
  const limitedEmail = rateLimit(
    `merchant-signup-code:email:${email}`,
    LIMITS.merchantSignupCode.limit,
    LIMITS.merchantSignupCode.windowMs,
  );
  if (!limitedIp.ok || !limitedEmail.ok) {
    return jsonError("Trop de tentatives. Réessayez plus tard.", 429);
  }

  const result = await verifyMerchantSignupCode(email, parsed.data.code);
  if (!result.ok) {
    return jsonError(result.error, 400);
  }

  return jsonOk({ ok: true, nextUrl: "/app/compte-commercant" });
}
