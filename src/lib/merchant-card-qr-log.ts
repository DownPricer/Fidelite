type MerchantCardQrStep =
  | "renderer personnalisé"
  | "source présente"
  | "source absente"
  | "élément trouvé"
  | "élément absent"
  | "dimensions calculées"
  | "image chargée";

export function logMerchantCardQr(
  step: MerchantCardQrStep,
  context: {
    slug?: string;
    displayMode?: string;
    elementCount?: number;
    widthPct?: number;
    heightPct?: number;
  } = {},
) {
  console.info("[merchant-card-qr]", step, context);
}
