import type { MerchantPlanId } from "./merchant-plans";
import { isMerchantSignupBetaForm } from "./merchant-signup-mode";

/** Destination après « Démarrer avec Fideto » sur /tarifs (selon MERCHANT_SIGNUP_MODE). */
export function merchantSignupEntryHref(planId: MerchantPlanId): string {
  if (isMerchantSignupBetaForm()) {
    return `/demarrer?plan=${encodeURIComponent(planId)}`;
  }
  return `/app/connexion?plan=${encodeURIComponent(planId)}`;
}
