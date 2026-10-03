import { env } from "./env";

/** URL utilisable par le navigateur (chemins relatifs → origine app). */
export function resolveSponsoredImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/")) {
    const base = env.appUrl.replace(/\/$/, "");
    return `${base}${url}`;
  }
  return url;
}
