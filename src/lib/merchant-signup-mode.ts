import { env } from "./env";

export type MerchantSignupMode = "beta_form" | "open";

export function getMerchantSignupMode(): MerchantSignupMode {
  const raw = (process.env.MERCHANT_SIGNUP_MODE ?? env.merchantSignupMode).trim().toLowerCase();
  if (raw === "open") return "open";
  return "beta_form";
}

export function isMerchantSignupBetaForm() {
  return getMerchantSignupMode() === "beta_form";
}
