import { requireSuperAdmin } from "@/lib/api-guard";
import { jsonError, jsonOkPrivate } from "@/lib/http";
import { diagnoseGoogleWalletLoyaltyClasses } from "@/lib/google-wallet-class-diagnostic";
import { publicGoogleWalletError } from "@/lib/google-wallet";

/** Rapport LoyaltyClass (API Google réelle) — lecture seule, super-admin. */
export async function GET(req: Request) {
  const auth = await requireSuperAdmin(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Accès refusé.", 403);
  try {
    const report = await diagnoseGoogleWalletLoyaltyClasses();
    return jsonOkPrivate(report);
  } catch (error) {
    return jsonError(publicGoogleWalletError(error), 502);
  }
}
