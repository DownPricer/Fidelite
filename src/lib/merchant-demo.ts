import { isDemoCookie, isPublicDemoEnabled, MERCHANT_DEMO_COOKIE } from "@/lib/demo-mode";

export { MERCHANT_DEMO_COOKIE };

/** Fallback sans session : actif en local ou via cookie démo. */
export function isMerchantDevDemo(user: unknown) {
  return isPublicDemoEnabled() && !user && process.env.NODE_ENV === "development";
}

export function isMerchantDemoCookie(value: string | undefined) {
  return isDemoCookie(value);
}
