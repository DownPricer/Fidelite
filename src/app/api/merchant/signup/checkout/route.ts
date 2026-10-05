import { requireMutatingRequest, requireMerchantAdmin } from "@/lib/api-guard";
import { jsonError, jsonOk } from "@/lib/http";
import { startMerchantSignupCheckout } from "@/lib/merchant-signup-service";
import { prisma } from "@/lib/prisma";

/** Relance le paiement Stripe pour une demande déjà rattachée (abandon ou refus de paiement). */
export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;

  const auth = await requireMerchantAdmin(req);
  if (auth.error || !auth.membership) return auth.error ?? jsonError("Accès refusé.", 403);

  const merchantId = auth.membership.merchantId;
  const signup = await prisma.merchantSignupRequest.findFirst({
    where: { merchantId, status: "ACCOUNT_LINKED" },
    orderBy: { updatedAt: "desc" },
  });
  if (!signup) {
    return jsonError("Aucune demande d'inscription éligible au paiement.", 404);
  }

  const sub = await prisma.merchantSubscription.findUnique({ where: { merchantId } });
  if (sub?.status === "ACTIVE" || sub?.status === "TRIAL") {
    return jsonError("Votre abonnement est déjà actif.", 409);
  }

  const checkout = await startMerchantSignupCheckout({
    grantRequestId: signup.id,
    grantEmail: signup.email,
  });
  if (!checkout.ok) {
    return jsonError(checkout.error, 503);
  }

  return jsonOk({ ok: true, checkoutUrl: checkout.checkoutUrl });
}
