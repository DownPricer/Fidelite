import { requireMerchantAdmin } from "@/lib/api-guard";
import { jsonError, jsonOkPrivate } from "@/lib/http";
import { listMerchantInvoices } from "@/lib/merchant-billing";

/** Factures Stripe (abonnement et paiements ponctuels) du client Stripe de CE commerce — PDF et page Stripe. */
export async function GET(req: Request) {
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);
  return jsonOkPrivate(await listMerchantInvoices(staff.membership.merchantId));
}
