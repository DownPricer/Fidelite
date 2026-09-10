type WalletQrClientStep = "chargement commencé" | "QR chargé" | "échec HTTP" | "réponse non JSON";

export function logWalletQrClient(
  step: WalletQrClientStep,
  context: { slug?: string; status?: number; path?: string; contentType?: string } = {},
) {
  console.info("[wallet-qr-client]", step, context);
}
