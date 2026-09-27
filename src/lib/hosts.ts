import { env } from "./env";

function hostnameOf(hostHeader: string) {
  return hostHeader.split(":")[0]?.toLowerCase() ?? "";
}

function hostMatches(hostHeader: string, ...candidates: string[]) {
  const name = hostnameOf(hostHeader);
  return candidates.some((candidate) => candidate.split(",").some((item) => item.trim().toLowerCase() === name && name !== ""));
}

/** Nouveau domaine correspondant à un ancien hôte (null si l'hôte n'est pas un alias hérité). */
export function legacyRedirectOrigin(hostHeader: string): string | null {
  const name = hostnameOf(hostHeader);
  if (!name) return null;
  const pairs: Array<[string, string]> = [
    [env.legacyCustomerHost, env.customerOrigin],
    [env.legacyAppHost, env.appOrigin],
    [env.legacyAdminHost, env.adminOrigin],
    [env.legacyEmployeeHost, env.employeeOrigin],
  ];
  for (const [legacy, origin] of pairs) {
    if (legacy.trim().toLowerCase() !== name) continue;
    const target = origin.replace(/\/$/, "");
    // Garde anti-boucle : origine encore configurée sur l'ancien domaine → pas de redirection.
    if (new URL(target).hostname.toLowerCase() === name) return null;
    return target;
  }
  return null;
}

/**
 * Origine à utiliser pour les retours Stripe Checkout du solde marketing : dérivée du `Host`
 * de la requête entrante quand il correspond à un hôte commerçant connu (nouveau ou legacy),
 * sinon repli sur APP_ORIGIN. Évite qu'une valeur APP_ORIGIN périmée renvoie le commerçant sur
 * une origine différente de celle qui a posé son cookie de session (perte de session au retour).
 */
export function resolveAppOriginFromRequestHost(hostHeader: string): string {
  const name = hostnameOf(hostHeader);
  if (name && (isAppHost(hostHeader) || isLocalHost(hostHeader))) {
    const scheme = isLocalHost(hostHeader) ? "http" : "https";
    return `${scheme}://${hostHeader}`;
  }
  return env.appOrigin;
}

export function isLocalHost(host: string) {
  const name = hostnameOf(host);
  return name === "localhost" || name === "127.0.0.1";
}

export function isAdminHost(host: string) {
  return hostMatches(host, env.adminHost, env.legacyAdminHost);
}

export function isAppHost(host: string) {
  return hostMatches(host, env.appHost, env.legacyAppHost);
}

export function isCustomerHost(host: string) {
  return hostMatches(host, env.customerHost, env.legacyCustomerHost);
}

export function isEmployeeHost(host: string) {
  return hostMatches(host, env.employeeHost, env.legacyEmployeeHost);
}

export function employeeInvitationUrl(token: string) {
  const base = env.employeeAppUrl.replace(/\/$/, "");
  return `${base}/invitation?token=${encodeURIComponent(token)}`;
}

export function publicCustomerUrl(path = "/") {
  if (env.customerOrigin) {
    return `${env.customerOrigin.replace(/\/$/, "")}${path}`;
  }
  return path;
}
