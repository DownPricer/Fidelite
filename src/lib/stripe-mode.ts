import { env } from "./env";

/**
 * Mode Stripe actif du déploiement (STRIPE_MODE=test|live), lu une seule fois au démarrage par
 * `web` et `worker`. Le TEST et le LIVE cohabitent dans la même base mais ne se mélangent jamais :
 * soldes, historiques, paiements et campagnes financées portent leur mode.
 */
export type StripeModeValue = "TEST" | "LIVE";

/** null = valeur invalide : rien ne peut être payé (jamais de retombée silencieuse sur le réel). */
export function getActiveStripeMode(): StripeModeValue | null {
  const value = env.stripeMode.trim().toLowerCase();
  if (value === "live") return "LIVE";
  if (value === "test" || value === "") return "TEST";
  return null;
}

const KEY_PREFIXES: Record<StripeModeValue, string[]> = {
  TEST: ["sk_test_", "rk_test_"],
  LIVE: ["sk_live_", "rk_live_"],
};

/** Clé API du mode demandé ; vide si absente ou si son préfixe ne correspond pas au mode (garde-fou anti-inversion). */
export function stripeSecretKeyFor(mode: StripeModeValue): string {
  const key = (mode === "LIVE" ? env.stripeLiveSecretKey : env.stripeTestSecretKey).trim();
  return KEY_PREFIXES[mode].some((prefix) => key.startsWith(prefix)) ? key : "";
}

export function stripeWebhookSecretFor(mode: StripeModeValue): string {
  return (mode === "LIVE" ? env.stripeLiveWebhookSecret : env.stripeTestWebhookSecret).trim();
}

/** Paiements possibles : mode valide + clé API du mode actif + secret webhook du mode actif. */
export function isStripeConfigured(): boolean {
  const mode = getActiveStripeMode();
  return Boolean(mode && stripeSecretKeyFor(mode) && stripeWebhookSecretFor(mode));
}

function testMerchantIds(): Set<string> {
  return new Set(
    env.stripeTestMerchantIds
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean),
  );
}

/**
 * En mode réel, tous les commerçants peuvent payer. En mode test, seuls les commerces listés dans
 * STRIPE_TEST_MERCHANT_IDS : les autres ne peuvent pas obtenir de campagne « payée » fictivement.
 */
export function isPaymentAllowedForMerchant(merchantId: string): boolean {
  const mode = getActiveStripeMode();
  if (mode === "LIVE") return true;
  if (mode === "TEST") return testMerchantIds().has(merchantId);
  return false;
}
