/** Chemin interne autorisé après connexion commerçant (évite les redirections ouvertes). */
export function sanitizeMerchantNextPath(value: string | undefined | null): string {
  if (!value || !value.startsWith("/app") || value.startsWith("//")) return "/app";
  return value;
}

export function merchantLoginRedirectPath(nextPath = "/app"): string {
  const safe = sanitizeMerchantNextPath(nextPath);
  return `/app/connexion?next=${encodeURIComponent(safe)}`;
}
