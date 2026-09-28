// Source unique des offres commerçant publiques (page /tarifs). Toute création de paiement
// (Stripe ou autre) pour l'abonnement commerçant doit lire ces montants ici plutôt que de les
// dupliquer, afin que l'affichage public et la facturation restent toujours identiques.

export type MerchantPlanId = "fideto" | "fideto-phone";

export type MerchantPlan = {
  id: MerchantPlanId;
  name: string;
  /** Abonnement mensuel Fideto, identique pour les deux offres. */
  monthlyPriceCents: number;
  /** Montant facturé à la commande (uniquement pour le pack matériel). */
  setupPriceCents: number | null;
  firstMonthIncluded: boolean;
};

export const MERCHANT_PLANS: Record<MerchantPlanId, MerchantPlan> = {
  fideto: {
    id: "fideto",
    name: "Fideto",
    monthlyPriceCents: 1999,
    setupPriceCents: null,
    firstMonthIncluded: false,
  },
  "fideto-phone": {
    id: "fideto-phone",
    name: "Fideto + téléphone",
    monthlyPriceCents: 1999,
    setupPriceCents: 19900,
    firstMonthIncluded: true,
  },
};

export function isMerchantPlanId(value: string | null | undefined): value is MerchantPlanId {
  return value === "fideto" || value === "fideto-phone";
}

export function formatEurosFromCents(cents: number): string {
  const euros = Math.floor(cents / 100);
  const dec = String(cents % 100).padStart(2, "0");
  return dec === "00" ? `${euros.toLocaleString("fr-FR")} €` : `${euros.toLocaleString("fr-FR")},${dec} €`;
}
