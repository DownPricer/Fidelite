import { requireSuperAdmin } from "@/lib/api-guard";
import { jsonError, jsonOkPrivate } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { diagnoseAdDelivery } from "@/lib/sponsored-selection";
import { getActiveStripeMode, isPaymentAllowedForMerchant } from "@/lib/stripe-mode";

/**
 * Diagnostic de toutes les mises en avant validées/programmées : pourquoi chacune apparaît (ou non)
 * chez les clients (mode Stripe test/réel, commerce de test, paiement, créneaux, audience).
 */
export async function GET(req: Request) {
  const auth = await requireSuperAdmin(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Accès refusé.", 403);

  const mode = getActiveStripeMode();
  const ads = await prisma.adRequest.findMany({
    where: { status: { in: ["APPROVED", "SCHEDULED", "LIVE", "SUSPENDED"] } },
    include: { merchant: { select: { id: true, name: true, city: true, postalCode: true } } },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  const items = [];
  for (const ad of ads) {
    const delivery = await diagnoseAdDelivery(ad.id);
    items.push({
      id: ad.id,
      status: ad.status,
      fundingMode: ad.fundingMode,
      merchant: ad.merchant,
      // Commerce de test : en mode test, ses envois (même gratuits) sont simulés.
      testMerchant: mode === "TEST" && isPaymentAllowedForMerchant(ad.merchantId),
      hourlyIntervals: ad.hourlyIntervals,
      delivery,
    });
  }
  return jsonOkPrivate({ stripeMode: mode, items });
}
