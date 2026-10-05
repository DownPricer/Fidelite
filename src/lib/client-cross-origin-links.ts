/**
 * Liens absolus vers les espaces commerçant / employé depuis le site client (fideto.fr).
 * Évite les navigations RSC Next.js vers un autre sous-domaine.
 */
function defaultAppOrigin() {
  return "https://app.fideto.fr";
}

function defaultEmployeeOrigin() {
  return "https://employe.fideto.fr";
}

function resolveOrigin(configured: string | undefined, fallback: string) {
  const trimmed = configured?.trim().replace(/\/$/, "");
  return trimmed || fallback;
}

export function clientMerchantAppHref(path: string) {
  const origin = resolveOrigin(process.env.NEXT_PUBLIC_APP_ORIGIN ?? process.env.APP_ORIGIN, defaultAppOrigin());
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${normalized}`;
}

export function clientEmployeeAppHref(path: string) {
  const origin = resolveOrigin(
    process.env.NEXT_PUBLIC_EMPLOYEE_ORIGIN ?? process.env.EMPLOYEE_ORIGIN,
    defaultEmployeeOrigin(),
  );
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${normalized}`;
}
