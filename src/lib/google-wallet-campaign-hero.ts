import type { AdRequest } from "@prisma/client";

/** Hero Google Wallet : uniquement le fichier final dédié, jamais le bandeau in-app. */
export function approvedGoogleWalletHeroUrl(
  ad: Pick<AdRequest, "googleWalletVisualStatus" | "googleWalletHeroUrl" | "finalImageUrl">,
): string | null {
  if (ad.googleWalletVisualStatus !== "APPROVED") return null;
  const url = ad.googleWalletHeroUrl?.trim();
  if (!url) return null;
  if (ad.finalImageUrl && url === ad.finalImageUrl) return null;
  return url;
}
