import type { AdPlacement } from "@prisma/client";
import { approvedGoogleWalletHeroUrl } from "./google-wallet-campaign-hero";
import { globalWalletCampaignDetailUri } from "./google-wallet-campaign-module";
import { prisma } from "./prisma";
import { isWithinUtcIntervals, type UtcInterval } from "./sponsored-hours-pricing";

/**
 * Sélection des mises en avant affichées aux clients (accueil Wallet, recherche, notifications).
 * UNE seule source de vérité pour les trois emplacements.
 *
 * ÉLIGIBILITÉ (revérifiée à chaque appel, jamais déduite du statut « affiché » du worker) :
 *  - mise en avant SCHEDULED ou LIVE (donc approuvée, non suspendue/arrêtée) avec un visuel final ;
 *  - paiement confirmé (CampaignPayment PAID) ou jours couverts par le quota inclus (quotaConsumedAt) ;
 *  - jamais une campagne payée en mode TEST ;
 *  - heure actuelle dans un créneau réellement acheté (hourlyIntervals ; anciennes demandes : bornes) ;
 *  - commerce actif ;
 *  - audience « clients Fideto du secteur » (même règle que les campagnes réseau, voir
 *    campaign-audience.ts) : client actif, ayant accepté les bons plans Fideto (notifyFifeLifeNews)
 *    et dont la zone marketing déclarée (code postal ou ville) correspond à celle du commerce.
 *
 * FRÉQUENCE (simple, documentée — aucun plafonnement par client n'existait avant ; la rotation
 * quotidienne de la page Découvrir, anonyme, est remplacée par cette règle) :
 *  1. au plus UN bandeau visible par client toutes les 30 minutes, tous emplacements confondus ;
 *  2. la même campagne n'est pas re-proposée au même client avant 2 h (une publicité fermée avec la
 *     croix réapparaît donc à une prochaine ouverture, jamais comme un refus définitif) ;
 *  3. quand plusieurs campagnes sont éligibles, on propose celle que ce client a vue le moins
 *     récemment (jamais vue d'abord) : les campagnes tournent ;
 *  4. même éligible, un emplacement n'est rempli qu'environ une fois sur deux : tirage déterministe
 *     par (client, emplacement, tranche de 10 min), donc stable pendant un rechargement rapide.
 */
export const GLOBAL_COOLDOWN_MS = 30 * 60_000;
export const SAME_AD_COOLDOWN_MS = 2 * 3_600_000;
export const IMPRESSION_DEDUPE_MS = 10 * 60_000;
export const SHOW_RATE_PERCENT = 50;
const SLOT_BUCKET_MS = 10 * 60_000;

export const PLACEMENTS: AdPlacement[] = ["WALLET_HOME", "SEARCH", "NOTIFICATIONS"];

export function parsePlacement(value: string | null | undefined): AdPlacement | null {
  return PLACEMENTS.includes(value as AdPlacement) ? (value as AdPlacement) : null;
}

function hash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Tirage « occasionnel » déterministe : pas de bandeau à chaque ouverture de page. */
export function passesOccasionalGate(userId: string, placement: AdPlacement, now: Date) {
  const bucket = Math.floor(now.getTime() / SLOT_BUCKET_MS);
  return hash(`${userId}|${placement}|${bucket}`) % 100 < SHOW_RATE_PERCENT;
}

type AdCandidate = Awaited<ReturnType<typeof loadCandidates>>[number];

async function loadCandidates(now: Date) {
  return prisma.adRequest.findMany({
    where: {
      status: { in: ["SCHEDULED", "LIVE"] },
      finalImageUrl: { not: null },
      startDate: { lte: now },
      endDate: { gte: now },
      OR: [{ fundingMode: null }, { fundingMode: "LIVE" }],
    },
    include: {
      merchant: { select: { slug: true, name: true, logoUrl: true, city: true, postalCode: true, isActive: true, status: true } },
      campaign: {
        select: {
          quotaConsumedAt: true,
          payment: { select: { status: true } },
          // Paiement par le solde marketing : ligne DEBIT payée (campaignId unique).
          ledgerEntry: { select: { type: true, status: true } },
        },
      },
    },
    orderBy: { id: "asc" },
    take: 100,
  });
}

function isWithinSchedule(ad: Pick<AdCandidate, "hourlyIntervals" | "startDate" | "endDate">, now: Date) {
  return Array.isArray(ad.hourlyIntervals)
    ? isWithinUtcIntervals(now, ad.hourlyIntervals as UtcInterval[])
    : now >= ad.startDate && now <= ad.endDate;
}

function isPaidOrFunded(ad: AdCandidate) {
  const ledger = ad.campaign?.ledgerEntry;
  return (
    ad.campaign?.payment?.status === "PAID" ||
    (ledger?.type === "DEBIT" && ledger.status === "PAID") ||
    Boolean(ad.campaign?.quotaConsumedAt)
  );
}

export type CustomerZone = { notifyFifeLifeNews: boolean; city: string | null; postalCode: string | null } | null;

function inAudience(ad: AdCandidate, zone: CustomerZone) {
  if (!zone || !zone.notifyFifeLifeNews) return false;
  const m = ad.merchant;
  if (m.postalCode && zone.postalCode && m.postalCode === zone.postalCode) return true;
  return Boolean(m.city && zone.city && m.city.toLowerCase() === zone.city.toLowerCase());
}

export type DeliveryCheck = { key: string; ok: boolean; label: string; detail: string };

/** Vérifications propres à la campagne (indépendantes du client) — source unique de l'éligibilité et du diagnostic. */
export function evaluateCampaignChecks(ad: AdCandidate, now: Date): DeliveryCheck[] {
  const live = ad.status === "SCHEDULED" || ad.status === "LIVE";
  return [
    {
      key: "approved",
      ok: live && Boolean(ad.finalImageUrl),
      label: "Visuel validé et campagne programmée",
      detail: live ? (ad.finalImageUrl ? "Programmée avec un visuel final." : "Aucun visuel final enregistré.") : `Statut actuel : ${ad.status}.`,
    },
    {
      key: "mode",
      ok: ad.fundingMode !== "TEST",
      label: "Campagne réelle (pas une simulation)",
      detail:
        ad.fundingMode === "TEST"
          ? "Campagne de TEST (mode Stripe test) : elle est simulée et n'est jamais affichée aux vrais clients."
          : "Financée en mode réel (ou par quota gratuit).",
    },
    {
      key: "paid",
      ok: isPaidOrFunded(ad),
      label: "Paiement confirmé",
      detail: isPaidOrFunded(ad) ? "Payée (Stripe, solde marketing) ou couverte par le quota." : "Aucun paiement confirmé (le retour de Stripe seul ne suffit pas : il faut le webhook).",
    },
    {
      key: "merchant",
      ok: ad.merchant.isActive && (ad.merchant.status === "ACTIVE" || ad.merchant.status === "TRIAL"),
      label: "Commerce actif",
      detail: ad.merchant.isActive ? `Statut du commerce : ${ad.merchant.status}.` : "Le commerce est désactivé.",
    },
    {
      key: "slot",
      ok: isWithinSchedule(ad, now),
      label: "Heure actuelle dans un créneau réservé",
      detail: isWithinSchedule(ad, now) ? "Un créneau acheté est en cours." : "Aucun créneau acheté n'est en cours à cet instant.",
    },
  ];
}

export function isEligibleNow(ad: AdCandidate, zone: CustomerZone, now: Date) {
  return evaluateCampaignChecks(ad, now).every((check) => check.ok) && inAudience(ad, zone);
}

async function loadZone(userId: string): Promise<CustomerZone> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { isActive: true } });
  if (!user?.isActive) return null;
  const prefs = await prisma.customerPreferences.findUnique({
    where: { userId },
    select: { notifyFifeLifeNews: true, marketingZoneCity: true, marketingZonePostalCode: true },
  });
  if (!prefs) return null;
  return { notifyFifeLifeNews: prefs.notifyFifeLifeNews, city: prefs.marketingZoneCity, postalCode: prefs.marketingZonePostalCode };
}

export type SponsoredCard = {
  id: string;
  placement: AdPlacement;
  merchantSlug: string;
  merchantName: string;
  merchantLogoUrl: string | null;
  imageUrl: string;
  text: string;
  ctaLabel: string | null;
};

function toCard(ad: AdCandidate, placement: AdPlacement): SponsoredCard {
  return {
    id: ad.id,
    placement,
    merchantSlug: ad.merchant.slug,
    merchantName: ad.merchant.name,
    merchantLogoUrl: ad.merchant.logoUrl,
    imageUrl: ad.finalImageUrl as string,
    text: ad.requestedText,
    ctaLabel: ad.ctaLabel,
  };
}

export type SelectionResult = { card: SponsoredCard | null; reason: string };

/** Sélection avec la raison de l'absence de bandeau (diagnostic) — voir selectSponsoredForCustomer. */
export async function selectSponsoredWithReason(input: {
  userId: string;
  placement: AdPlacement;
  now?: Date;
  /** Campagnes fermées avec la croix pendant cette utilisation de l'application (jamais un refus définitif). */
  exclude?: string[];
}): Promise<SelectionResult> {
  const now = input.now ?? new Date();
  const { selectSponsoredTestBroadcastCard } = await import("./sponsored-test-broadcast");
  const testCard = await selectSponsoredTestBroadcastCard(input.placement);
  if (testCard) {
    return { card: testCard, reason: "diffusion test globale active" };
  }

  const zone = await loadZone(input.userId);
  if (!zone) return { card: null, reason: "client inactif ou sans préférences enregistrées" };
  if (!zone.notifyFifeLifeNews) return { card: null, reason: "le client n'a pas accepté les bons plans Fideto (préférence « bons plans locaux »)" };
  if (!zone.city && !zone.postalCode) return { card: null, reason: "le client n'a renseigné ni ville ni code postal (zone marketing)" };

  const [candidates, views] = await Promise.all([
    loadCandidates(now),
    prisma.adCustomerView.findMany({ where: { userId: input.userId }, select: { adRequestId: true, lastShownAt: true } }),
  ]);
  const excluded = new Set(input.exclude ?? []);
  const eligible = candidates.filter((ad) => !excluded.has(ad.id) && isEligibleNow(ad, zone, now));
  if (eligible.length === 0) {
    return { card: null, reason: "aucune campagne diffusable pour sa zone à cet instant (test/simulation, impayée, hors créneau, autre secteur ou fermée par le client)" };
  }

  const lastShownBy = new Map(views.map((v) => [v.adRequestId, v.lastShownAt.getTime()]));
  const lastAny = views.reduce((max, v) => Math.max(max, v.lastShownAt.getTime()), 0);
  if (now.getTime() - lastAny < GLOBAL_COOLDOWN_MS) return { card: null, reason: "un bandeau a déjà été vu il y a moins de 30 min" };
  if (!passesOccasionalGate(input.userId, input.placement, now)) return { card: null, reason: "tirage « occasionnel » défavorable pour cette tranche de 10 min (réessayez plus tard)" };

  const fresh = eligible.filter((ad) => now.getTime() - (lastShownBy.get(ad.id) ?? 0) >= SAME_AD_COOLDOWN_MS);
  if (fresh.length === 0) return { card: null, reason: "toutes les campagnes éligibles ont été vues il y a moins de 2 h" };
  // Rotation : la campagne la moins récemment vue par ce client (jamais vue = 0), puis par id.
  fresh.sort((a, b) => (lastShownBy.get(a.id) ?? 0) - (lastShownBy.get(b.id) ?? 0) || a.id.localeCompare(b.id));
  return { card: toCard(fresh[0], input.placement), reason: "ok" };
}

export const selectSponsoredForCustomerDebug = selectSponsoredWithReason;

/** Bandeau à proposer à ce client pour cet emplacement, ou null. Ne compte rien (voir recordImpression). */
export async function selectSponsoredForCustomer(input: {
  userId: string;
  placement: AdPlacement;
  now?: Date;
  exclude?: string[];
}): Promise<SponsoredCard | null> {
  return (await selectSponsoredWithReason(input)).card;
}

/**
 * Campagne à afficher sur la carte Google Wallet globale Fideto uniquement.
 * Même éligibilité (audience, créneaux, paiement) que les bandeaux in-app, sans règles de
 * fréquence ni impression — voir google-wallet.ts (heroImage de l'objet global).
 */
export async function selectSponsoredForGoogleWalletGlobal(userId: string, now: Date = new Date()) {
  const zone = await loadZone(userId);
  if (!zone) return null;
  if (!zone.notifyFifeLifeNews) return null;
  if (!zone.city && !zone.postalCode) return null;

  const [candidates, views] = await Promise.all([
    loadCandidates(now),
    prisma.adCustomerView.findMany({ where: { userId }, select: { adRequestId: true, lastShownAt: true } }),
  ]);
  const eligible = candidates.filter((ad) => isEligibleNow(ad, zone, now));
  if (eligible.length === 0) return null;

  const lastShownBy = new Map(views.map((v) => [v.adRequestId, v.lastShownAt.getTime()]));
  eligible.sort((a, b) => (lastShownBy.get(a.id) ?? 0) - (lastShownBy.get(b.id) ?? 0) || a.id.localeCompare(b.id));
  const ad = eligible[0];
  const title = (ad.ctaLabel?.trim() || ad.merchant.name).slice(0, 60);
  const walletHero = approvedGoogleWalletHeroUrl(ad);
  return {
    id: ad.id,
    title,
    description: ad.requestedText.trim(),
    imagePathOrUrl: walletHero ?? "",
    detailUri: globalWalletCampaignDetailUri({ merchantSlug: ad.merchant.slug, ctaUrl: ad.ctaUrl ?? null }),
    displayStart: ad.startDate,
    displayEnd: ad.endDate,
  };
}

/** Revérifie qu'une campagne précise est toujours affichable à ce client maintenant (impression/clic). */
export async function isAdEligibleForCustomer(adId: string, userId: string, now: Date = new Date()) {
  const { isSponsoredTestBroadcastAd, loadSponsoredTestBroadcast } = await import("./sponsored-test-broadcast");
  if (await isSponsoredTestBroadcastAd(adId)) {
    const row = await loadSponsoredTestBroadcast();
    return row?.adRequest ?? null;
  }
  const zone = await loadZone(userId);
  if (!zone) return null;
  const candidates = await loadCandidates(now);
  const ad = candidates.find((c) => c.id === adId);
  return ad && isEligibleNow(ad, zone, now) ? ad : null;
}

/**
 * Compte une impression (placement d'origine enregistré) — au plus une par client et par
 * IMPRESSION_DEDUPE_MS pour une même campagne, quel que soit le nombre de rendus/requêtes
 * (la garde est atomique côté base : mise à jour conditionnelle, sinon création unique).
 */
export async function recordImpression(input: { adId: string; userId: string; placement: AdPlacement; now?: Date }) {
  const { isSponsoredTestBroadcastAd } = await import("./sponsored-test-broadcast");
  if (await isSponsoredTestBroadcastAd(input.adId)) return false;

  const now = input.now ?? new Date();
  const threshold = new Date(now.getTime() - IMPRESSION_DEDUPE_MS);
  const updated = await prisma.adCustomerView.updateMany({
    where: { userId: input.userId, adRequestId: input.adId, lastShownAt: { lt: threshold } },
    data: { lastShownAt: now, impressions: { increment: 1 } },
  });
  let counted = updated.count === 1;
  if (!counted) {
    const existing = await prisma.adCustomerView.findUnique({
      where: { userId_adRequestId: { userId: input.userId, adRequestId: input.adId } },
      select: { id: true },
    });
    if (!existing) {
      try {
        await prisma.adCustomerView.create({ data: { userId: input.userId, adRequestId: input.adId, lastShownAt: now, impressions: 1 } });
        counted = true;
      } catch {
        counted = false; // création concurrente : l'autre requête a déjà compté
      }
    }
  }
  if (counted) await prisma.adEvent.create({ data: { adRequestId: input.adId, type: "IMPRESSION", placement: input.placement } });
  return counted;
}

/** Diagnostic de diffusion d'une campagne : pourquoi elle apparaît (ou non) chez les clients. */
export async function diagnoseAdDelivery(adId: string, now: Date = new Date()) {
  const candidates = await loadCandidates(now);
  const ad = candidates.find((c) => c.id === adId);
  const base = await prisma.adRequest.findUnique({
    where: { id: adId },
    select: { id: true, status: true, fundingMode: true, startDate: true, endDate: true, hourlyIntervals: true, finalImageUrl: true, merchantId: true },
  });
  if (!base) return null;

  let checks: DeliveryCheck[];
  if (ad) {
    checks = evaluateCampaignChecks(ad, now);
  } else {
    // Hors de la fenêtre de candidats (statut non programmé, hors dates, TEST, …) : on explique la raison.
    const live = base.status === "SCHEDULED" || base.status === "LIVE";
    const inWindow = base.startDate <= now && base.endDate >= now;
    checks = [
      { key: "approved", ok: live && Boolean(base.finalImageUrl), label: "Visuel validé et campagne programmée", detail: live ? "Programmée." : `Statut actuel : ${base.status}.` },
      {
        key: "mode",
        ok: base.fundingMode !== "TEST",
        label: "Campagne réelle (pas une simulation)",
        detail: base.fundingMode === "TEST" ? "Campagne de TEST (mode Stripe test) : simulée, jamais affichée aux vrais clients." : "Financée en mode réel (ou par quota gratuit).",
      },
      { key: "slot", ok: inWindow && isWithinSchedule(base as never, now), label: "Heure actuelle dans un créneau réservé", detail: inWindow ? "Voir les créneaux réservés." : "Hors de la période réservée." },
    ];
  }

  // Audience : clients actifs ayant accepté les bons plans Fideto, dans la zone du commerce.
  const merchant = await prisma.merchant.findUnique({ where: { id: base.merchantId }, select: { city: true, postalCode: true } });
  const zoneFilters: Record<string, unknown>[] = [];
  if (merchant?.postalCode) zoneFilters.push({ marketingZonePostalCode: merchant.postalCode });
  if (merchant?.city) zoneFilters.push({ marketingZoneCity: { equals: merchant.city, mode: "insensitive" } });
  const eligibleCustomers = zoneFilters.length
    ? await prisma.customerPreferences.count({ where: { notifyFifeLifeNews: true, OR: zoneFilters, user: { isActive: true } } })
    : 0;
  checks.push({
    key: "audience",
    ok: eligibleCustomers > 0,
    label: "Clients éligibles dans le secteur",
    detail: !zoneFilters.length
      ? "Le commerce n'a ni ville ni code postal : aucune audience locale n'est possible."
      : eligibleCustomers > 0
        ? `${eligibleCustomers} client${eligibleCustomers > 1 ? "s" : ""} (bons plans Fideto acceptés, même zone que le commerce).`
        : "Aucun client n'a accepté les bons plans Fideto avec une zone (ville ou code postal) correspondant à celle du commerce.",
  });

  return {
    mode: base.fundingMode === "TEST" ? ("TEST" as const) : ("LIVE" as const),
    simulated: base.fundingMode === "TEST",
    checks,
    deliverable: checks.every((c) => c.ok),
    eligibleCustomers,
  };
}

/**
 * Aperçu d'une campagne dans ses vrais emplacements (accueil, recherche, notifications), réservé au
 * super-admin ou à l'administrateur du commerce de la campagne. Ne passe par AUCUNE règle d'audience,
 * de fréquence ni de créneau, n'écrit rien (ni impression, ni historique client) et n'est jamais
 * montré à un autre utilisateur : la réponse n'est donnée qu'à la personne autorisée qui la demande.
 */
export async function loadAdPreviewCard(adId: string, placement: AdPlacement) {
  const ad = await prisma.adRequest.findUnique({
    where: { id: adId },
    include: {
      merchant: { select: { slug: true, name: true, logoUrl: true } },
      versions: { orderBy: { number: "desc" }, take: 1, select: { url: true } },
    },
  });
  if (!ad) return null;
  const imageUrl = ad.finalImageUrl ?? ad.versions[0]?.url ?? null;
  if (!imageUrl) return null;
  return {
    merchantId: ad.merchantId,
    simulated: ad.fundingMode === "TEST",
    card: {
      id: ad.id,
      placement,
      merchantSlug: ad.merchant.slug,
      merchantName: ad.merchant.name,
      merchantLogoUrl: ad.merchant.logoUrl,
      imageUrl,
      text: ad.requestedText,
      ctaLabel: ad.ctaLabel,
    } satisfies SponsoredCard,
  };
}
