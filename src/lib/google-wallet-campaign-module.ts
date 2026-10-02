import { isSafeAdUrl } from "./ad-links";
import { env } from "./env";

function publicCampaignImageUrl(pathOrUrl: string) {
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

/** URL publique vers la fiche commerce ou le lien CTA approuvé — sans compteur de clic facturable. */
export function globalWalletCampaignDetailUri(input: { merchantSlug: string; ctaUrl: string | null }) {
  if (input.ctaUrl && isSafeAdUrl(input.ctaUrl)) return input.ctaUrl;
  const origin = env.googleWalletOrigin.replace(/\/$/, "");
  return `${origin}/c/${encodeURIComponent(input.merchantSlug)}`;
}

export function buildGlobalWalletValueAddedModule(input: GlobalWalletCampaignModule) {
  const imageUrl = publicCampaignImageUrl(input.imagePathOrUrl);
  const module: Record<string, unknown> = {
    header: localized(input.title.slice(0, 60)),
    body: localized(input.description.slice(0, 240)),
    uri: input.detailUri,
    sortIndex: 0,
  };
  if (imageUrl) {
    module.image = {
      sourceUri: { uri: imageUrl },
      contentDescription: localized(input.title.slice(0, 60)),
    };
  }
  if (input.displayStart && input.displayEnd) {
    module.viewConstraints = {
      displayInterval: {
        start: { date: input.displayStart.toISOString() },
        end: { date: input.displayEnd.toISOString() },
      },
    };
  }
  return module;
}
