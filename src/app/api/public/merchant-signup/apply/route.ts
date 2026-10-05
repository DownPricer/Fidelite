import { requireMutatingRequest } from "@/lib/api-guard";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { isMerchantSignupBetaForm } from "@/lib/merchant-signup-mode";
import { parseMerchantSignupApplication } from "@/lib/merchant-signup-application-input";
import { submitMerchantSignupApplication } from "@/lib/merchant-signup-service";
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

  const body = await readJson(req);
  if (body === null) {
    return jsonError("Corps de requête invalide.", 400, { fieldErrors: {} });
  }

  const parsed = parseMerchantSignupApplication(body);
  if (!parsed.ok) {
    return jsonError(parsed.message, 400, { fieldErrors: parsed.fieldErrors });
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

  const { record, emailDelivery } = await submitMerchantSignupApplication(parsed.data);

  void userAgent(req);

  const response: {
    ok: true;
    message: string;
    requestId: string;
    emailWarning?: string;
  } = {
    ok: true,
    requestId: record.id,
    message:
      "Votre demande a bien été enregistrée. Un conseiller Fideto vous contactera rapidement. Aucun paiement n'est demandé à cette étape.",
  };

  if (!emailDelivery.ackSent || !emailDelivery.adminNotified) {
    response.emailWarning =
      "Votre demande est bien enregistrée. L'envoi d'un e-mail de confirmation a échoué : notre équipe a été alertée et pourra vous recontacter.";
    console.error("[merchant-signup] échec partiel e-mail après enregistrement", {
      requestId: record.id,
      ackSent: emailDelivery.ackSent,
      adminNotified: emailDelivery.adminNotified,
    });
  }

  return jsonOk(response);
}
