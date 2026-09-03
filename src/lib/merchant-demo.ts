/** Mode démo commerçant : actif en local sans session (pas de base requise). */
export function isMerchantDevDemo(user: unknown) {
  return process.env.NODE_ENV === "development" && !user;
}

export const MERCHANT_DEMO_COOKIE = "fife_merchant_demo";

export function isMerchantDemoCookie(value: string | undefined) {
  return process.env.NODE_ENV === "development" && value === "1";
}
