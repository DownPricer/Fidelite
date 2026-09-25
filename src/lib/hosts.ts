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
