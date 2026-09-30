/** Un lien de bandeau n'est jamais diffusé ou approuvé s'il n'est pas http(s) — jamais javascript:/data:/etc. */
export function isSafeAdUrl(url: string | null | undefined): url is string {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
