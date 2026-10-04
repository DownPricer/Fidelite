import { todayParisDate } from "./sponsored-hours-pricing";

/** Statuts campagne annonce (hors mise en avant sponsorisée). */
const ANNOUNCE_EN_COURS = new Set(["SCHEDULED", "PENDING_REVIEW", "PAYMENT_REQUIRED", "PAID", "SENDING"]);

const TERMINAL_CAMPAIGN = new Set(["CANCELLED", "REJECTED", "ENDED", "STOPPED", "SENT", "PARTIALLY_SENT"]);

/** Statuts AdRequest encore « en cours » côté commerçant (validation, paiement, diffusion à venir ou active). */
const AD_EN_COURS = new Set([
  "PENDING_REVIEW",
  "AWAITING_MERCHANT",
  "NEEDS_CHANGES",
  "APPROVED",
  "SCHEDULED",
  "LIVE",
  "SUSPENDED",
]);

const TERMINAL_AD = new Set(["REJECTED", "CANCELLED", "ENDED", "STOPPED"]);

export type CampaignEnCoursInput = {
  id: string;
  channel: string;
  status: string;
  scheduledAt?: string | null;
};

export type AdEnCoursInput = {
  status: string;
  startDate?: string;
  endDate?: string;
  campaignId?: string | null;
};

function parseDayParis(iso: string) {
  return iso.slice(0, 10);
}

/** Campagne sponsorisée dont la fenêtre n'est pas entièrement passée (Europe/Paris). */
export function sponsoredAdStillRelevant(ad: AdEnCoursInput, now = new Date()) {
  if (!ad.endDate) return true;
  const today = todayParisDate(now);
  return parseDayParis(ad.endDate) >= today;
}

export function isCampaignEnCours(
  campaign: CampaignEnCoursInput,
  ad: AdEnCoursInput | undefined,
  now = new Date(),
): boolean {
  if (TERMINAL_CAMPAIGN.has(campaign.status)) return false;
  if (campaign.status === "DRAFT") return false;

  if (campaign.channel === "SPONSORED_AD") {
    if (ad) {
      if (TERMINAL_AD.has(ad.status)) return false;
      if (!sponsoredAdStillRelevant(ad, now)) return false;
      if (!AD_EN_COURS.has(ad.status)) return false;
      if (ad.status === "APPROVED") {
        return ["PENDING_REVIEW", "PAYMENT_REQUIRED", "PAID", "SCHEDULED"].includes(campaign.status);
      }
      return true;
    }
    return ["PENDING_REVIEW", "PAYMENT_REQUIRED", "PAID", "SCHEDULED"].includes(campaign.status);
  }

  return ANNOUNCE_EN_COURS.has(campaign.status);
}

/** Badge liste commerçant : en direct uniquement pendant un créneau actif côté AdRequest. */
export function isSponsoredAdLiveNow(ad: AdEnCoursInput | undefined) {
  return ad?.status === "LIVE";
}

export function isSponsoredAdScheduledBeforeLive(ad: AdEnCoursInput | undefined) {
  return ad?.status === "SCHEDULED";
}
