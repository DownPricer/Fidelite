import { requireMerchantAdmin, requireMutatingRequest } from "@/lib/api-guard";
import { resolveAppOriginFromRequestHost } from "@/lib/hosts";
import { jsonError, jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { canReadStripeMode, createBillingPortalSession } from "@/lib/stripe";
import { getActiveStripeMode } from "@/lib/stripe-mode";

/**
 * Ouvre le portail de facturation Stripe (moyen de paiement, factures) pour le client Stripe de CE
 * commerce. Nécessite que le portail soit configuré dans le Dashboard Stripe ; l'arrêt de
 * l'abonnement, lui, est géré dans Fideto (confirmation + date effective).
 */
export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const mode = getActiveStripeMode();
  if (!mode || !canReadStripeMode(mode)) return jsonError("Stripe n'est pas disponible pour le moment.", 503);
  const customer = await prisma.merchantStripeCustomer.findUnique({
    where: { merchantId_mode: { merchantId: staff.membership.merchantId, mode } },
  });
  if (!customer) {
    return jsonError("Aucun compte de facturation Stripe n'existe encore pour votre commerce (il est créé au premier paiement).", 409, { code: "NO_STRIPE_CUSTOMER" });
  }
  try {
    const origin = resolveAppOriginFromRequestHost(req.headers.get("host") ?? "");
    const session = await createBillingPortalSession(customer.stripeCustomerId, mode, `${origin}/app/outils/facturation`);
    return jsonOk({ url: session.url });
  } catch {
    return jsonError("Le portail de facturation Stripe n'est pas disponible (à configurer dans le Dashboard Stripe).", 502, { code: "PORTAL_UNAVAILABLE" });
  }
}
