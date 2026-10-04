import type { AdRequest } from "@prisma/client";
import { resolveGlobalWalletCampaignHeroUrl } from "./google-wallet-campaign-module";

/** Hero Google Wallet : uniquement le fichier final dédié, jamais le bandeau in-app. */
export function approvedGoogleWalletHeroUrl(
  ad: Pick<AdRequest, "googleWalletVisualStatus" | "googleWalletHeroUrl" | "finalImageUrl">,
): string | null {
  if (ad.googleWalletVisualStatus !== "APPROVED") return null;
  const url = ad.googleWalletHeroUrl?.trim();
  if (!url) return null;
  if (ad.finalImageUrl && url === ad.finalImageUrl) return null;
  if (!isDedicatedWalletHeroStorageUrl(url)) return null;
  return url;
}

/** Seuls les fichiers `google-wallet-hero-*` (ou HTTPS externes dédiées) alimentent le hero Wallet. */
export function isDedicatedWalletHeroStorageUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return false;
  return trimmed.includes("/google-wallet-hero-") || trimmed.includes("google-wallet-hero-");
}

/** URL https publique pour Google Wallet (après validation commerçant). */
export function resolveApprovedWalletHeroForGoogle(
  ad: Pick<AdRequest, "googleWalletVisualStatus" | "googleWalletHeroUrl" | "finalImageUrl">,
): string | null {
  const stored = approvedGoogleWalletHeroUrl(ad);
  if (!stored) return null;
  return resolveGlobalWalletCampaignHeroUrl(stored);
}

/** Ne jamais envoyer un bandeau ou une vignette comme hero de campagne sur l'objet Google. */
export function resolveCampaignModuleHeroPathOrUrl(imagePathOrUrl: string | null | undefined): string {
  const raw = (imagePathOrUrl ?? "").trim();
  if (!raw || !isDedicatedWalletHeroStorageUrl(raw)) return "";
  return raw;
}
