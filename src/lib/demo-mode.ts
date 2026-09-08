/** Mode démo public — accessible sans authentification (désactivable via PUBLIC_DEMO_MODE=false). */
export const CLIENT_DEMO_COOKIE = "fife_client_demo";
export const MERCHANT_DEMO_COOKIE = "fife_merchant_demo";
export const EMPLOYEE_DEMO_COOKIE = "fife_employee_demo";

export function isPublicDemoEnabled() {
  return process.env.PUBLIC_DEMO_MODE !== "false";
}

export function isDemoCookie(value: string | undefined) {
  return isPublicDemoEnabled() && value === "1";
}

export function isClientDemoMode(
  searchParams?: { demo?: string; sheet?: string; toast?: string },
  cookie?: string,
) {
  if (!isPublicDemoEnabled()) return false;
  if (searchParams?.demo === "0") return false;
  if (searchParams?.demo === "1") return true;
  if (isDemoCookie(cookie)) return true;
  if (searchParams?.sheet) return true;
  if (searchParams?.toast) return true;
  if (process.env.NODE_ENV === "development") return true;
  return false;
}
