type MerchantCardSwitchStep =
  | "mode sélectionné"
  | "mode publié"
  | "mode actif en base"
  | "variante demandée"
  | "gabarit trouvé"
  | "wallet rafraîchi";

type MerchantCardSwitchContext = {
  merchantId?: string;
  mode?: string;
  cardSlot?: string;
  templateId?: string | null;
  templateVersion?: number | null;
  usedFallback?: boolean;
};

export function logMerchantCardSwitch(step: MerchantCardSwitchStep, context: MerchantCardSwitchContext = {}) {
  console.info("[merchant-card-switch]", step, context);
}
