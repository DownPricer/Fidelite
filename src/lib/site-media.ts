import { resolveMediaFilePath } from "@/lib/media-storage";

/**
 * Médias marketing du site public (hors Git).
 * En production : placer `fideto-presentation.mp4` dans `{UPLOADS_DIR}/site/`
 * (ex. `/var/lib/fifelite/uploads/site/`). URL stable : `https://fideto.fr/api/media/site/fideto-presentation.mp4`.
 */
/** Fichier MP4 servi via `/api/media/site/fideto-presentation.mp4`. */
export const SITE_MEDIA_FIDETO_PRESENTATION = "fideto-presentation.mp4";

const ALLOWED_SITE_MEDIA = new Set<string>([SITE_MEDIA_FIDETO_PRESENTATION]);

export function isAllowedSiteMediaFile(filename: string) {
  return ALLOWED_SITE_MEDIA.has(filename);
}

export function siteMediaPublicPath(filename: string) {
  return `/api/media/site/${filename}`;
}

export function resolveSiteMediaFilePath(filename: string) {
  if (!isAllowedSiteMediaFile(filename)) {
    throw new Error("Fichier média site non autorisé.");
  }
  return resolveMediaFilePath("site", filename);
}
