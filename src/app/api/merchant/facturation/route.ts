import { requireMerchantAdmin } from "@/lib/api-guard";
import { jsonError, jsonOkPrivate } from "@/lib/http";
import { attachReceipts, listMerchantTransactions, syncSubscriptionFromStripeView, toSubscriptionView } from "@/lib/merchant-billing";
import { prisma } from "@/lib/prisma";
import { canReadStripeMode, retrieveStripeSubscription } from "@/lib/stripe";
import { getActiveStripeMode } from "@/lib/stripe-mode";

/**
 * Réglages et facturation (commerçant) : abonnement et transactions DE SON commerce uniquement
 * (le commerce vient de la session, jamais d'un paramètre). Les factures sont servies à part
 * (/api/merchant/facturation/factures) car elles dépendent de Stripe.
 */
export async function GET(req: Request) {
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);
  const merchantId = staff.membership.merchantId;

  let sub = await prisma.merchantSubscription.findUnique({ where: { merchantId } });
  // Abonnement Stripe lié : Stripe est la source de vérité, on resynchronise (sans bloquer la page si Stripe est indisponible).
  if (sub?.stripeSubscriptionId && sub.stripeMode && canReadStripeMode(sub.stripeMode)) {
    try {
      await syncSubscriptionFromStripeView(await retrieveStripeSubscription(sub.stripeSubscriptionId, sub.stripeMode));
      sub = await prisma.merchantSubscription.findUnique({ where: { merchantId } });
    } catch {
      // On affiche le dernier état connu.
    }
  }

  const transactions = await attachReceipts(await listMerchantTransactions(merchantId));
  const balances = await prisma.marketingBalance.findMany({ where: { merchantId } });
  return jsonOkPrivate({
    subscription: toSubscriptionView(sub),
    transactions,
    activeStripeMode: getActiveStripeMode(),
    balances: balances.map((b) => ({ mode: b.mode, balanceCents: b.balanceCents })),
  });
}
