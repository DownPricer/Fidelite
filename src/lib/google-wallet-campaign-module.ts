import { isSafeAdUrl } from "./ad-links";
import { env } from "./env";

/** URL https publique du visuel campagne pour le hero de la carte globale Google Wallet. */
export function resolveGlobalWalletCampaignHeroUrl(pathOrUrl: string) {
  if (pathOrUrl.startsWith("https://")) {
    try {
      const url = new URL(pathOrUrl);
      if (url.protocol === "https:" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1") return pathOrUrl;
    } catch {
      return null;
    }
  }
  if (pathOrUrl.startsWith("/")) {
    return `${env.googleWalletOrigin.replace(/\/$/, "")}${pathOrUrl}`;
  }
  return null;
}

export type GlobalWalletCampaignModule = {
  id: string;
  title: string;
  description: string;
  imagePathOrUrl: string;
  detailUri: string;
  /** Fenêtre globale de la campagne (indicatif côté Google — la diffusion réelle suit les syncs Fideto). */
  displayStart?: Date;
  displayEnd?: Date;
};

function localized(value: string) {
  return { defaultValue: { language: "fr-FR" as const, value } };
}

function walletHttpsUri(uri: string) {
  try {
    const url = new URL(uri);
    if (url.protocol !== "https:") return null;
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") return null;
    return url.toString();
  } catch {
    return null;
  }
}

/** URL publique vers la fiche commerce ou le lien CTA approuvé — sans compteur de clic facturable. */
export function globalWalletCampaignDetailUri(input: { merchantSlug: string; ctaUrl: string | null }) {
  const origin = env.googleWalletOrigin.replace(/\/$/, "");
  const fallback = `${origin}/c/${encodeURIComponent(input.merchantSlug)}`;
  if (input.ctaUrl && isSafeAdUrl(input.ctaUrl)) {
    return walletHttpsUri(input.ctaUrl) ?? fallback;
  }
  return fallback;
}

export function buildGlobalWalletValueAddedModule(input: GlobalWalletCampaignModule) {
  const uri = walletHttpsUri(input.detailUri);
  if (!uri) return null;

  const title = input.title.trim().slice(0, 60);
  if (!title) return null;

  const module: Record<string, unknown> = {
    header: localized(title),
    body: localized(input.description.trim().slice(0, 50)),
    uri,
    sortIndex: 0,
  };
  const imageUrl = resolveGlobalWalletCampaignHeroUrl(input.imagePathOrUrl);
  if (imageUrl) {
    module.image = { sourceUri: { uri: imageUrl } };
  }
  return module;
}
