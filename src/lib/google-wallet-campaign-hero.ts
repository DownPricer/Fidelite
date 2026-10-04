import type { AdRequest } from "@prisma/client";
import { resolveGlobalWalletCampaignHeroUrl } from "./google-wallet-campaign-module";

export type WalletHeroRejectReason =
  | "ok"
  | "not_approved"
  | "missing_url"
  | "same_as_banner"
  | "not_dedicated_filename"
  | "invalid_public_https";

export type WalletHeroResolution = {
  storedUrl: string | null;
  httpsUrl: string | null;
  reason: WalletHeroRejectReason;
};

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
  return explainWalletHeroResolution(ad).httpsUrl;
}

/** Diagnostic assaini : pourquoi un hero Wallet est accepté ou refusé (sans secrets). */
export function explainWalletHeroResolution(
  ad: Pick<AdRequest, "googleWalletVisualStatus" | "googleWalletHeroUrl" | "finalImageUrl">,
): WalletHeroResolution {
  if (ad.googleWalletVisualStatus !== "APPROVED") {
    return { storedUrl: null, httpsUrl: null, reason: "not_approved" };
  }
  const url = ad.googleWalletHeroUrl?.trim();
  if (!url) {
    return { storedUrl: null, httpsUrl: null, reason: "missing_url" };
  }
  if (ad.finalImageUrl && url === ad.finalImageUrl) {
    return { storedUrl: null, httpsUrl: null, reason: "same_as_banner" };
  }
  if (!isDedicatedWalletHeroStorageUrl(url)) {
    return { storedUrl: null, httpsUrl: null, reason: "not_dedicated_filename" };
  }
  const httpsUrl = resolveGlobalWalletCampaignHeroUrl(url);
  if (!httpsUrl) {
    return { storedUrl: url, httpsUrl: null, reason: "invalid_public_https" };
  }
  return { storedUrl: url, httpsUrl, reason: "ok" };
}

/** Ne jamais envoyer un bandeau ou une vignette comme hero de campagne sur l'objet Google. */
export function resolveCampaignModuleHeroPathOrUrl(imagePathOrUrl: string | null | undefined): string {
  const raw = (imagePathOrUrl ?? "").trim();
  if (!raw || !isDedicatedWalletHeroStorageUrl(raw)) return "";
  return raw;
}
