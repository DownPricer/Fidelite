import type { AdPlacement, AdRequest, Merchant } from "@prisma/client";
import {
  buildGlobalWalletValueAddedModule,
  globalWalletCampaignDetailUri,
  type GlobalWalletCampaignModule,
} from "./google-wallet-campaign-module";
import { approvedGoogleWalletHeroUrl } from "./google-wallet-campaign-hero";
import { GoogleWalletConfigError, publicGoogleWalletError } from "./google-wallet";
import { prisma } from "./prisma";
import { selectSponsoredForGoogleWalletGlobal, type SponsoredCard } from "./sponsored-selection";

export const SPONSORED_TEST_BROADCAST_ROW_ID = "global";

export function resolveAdTestBroadcastImageUrl(
  ad: Pick<AdRequest, "finalImageUrl" | "requestedImageUrl"> & { versions?: { url: string }[] },
) {
  return ad.finalImageUrl ?? ad.versions?.[0]?.url ?? ad.requestedImageUrl ?? null;
}

type BroadcastAd = Pick<AdRequest, "id" | "requestedText" | "ctaLabel" | "ctaUrl"> & {
  merchant: Pick<Merchant, "name" | "slug" | "logoUrl">;
};

export function adToSponsoredTestCard(ad: BroadcastAd, placement: AdPlacement, imageUrl: string): SponsoredCard {
  return {
    id: ad.id,
    placement,
    merchantSlug: ad.merchant.slug,
    merchantName: ad.merchant.name,
    merchantLogoUrl: ad.merchant.logoUrl,
    imageUrl,
    text: ad.requestedText,
    ctaLabel: ad.ctaLabel,
  };
}

export function adToGlobalWalletTestModule(
  ad: Pick<AdRequest, "id" | "requestedText" | "ctaLabel" | "ctaUrl"> & { merchant: Pick<Merchant, "name" | "slug"> },
  imagePathOrUrl: string,
): GlobalWalletCampaignModule | null {
  const title = (ad.ctaLabel?.trim() || ad.merchant.name).slice(0, 60);
  const description = ad.requestedText.trim();
  if (!title || !description || !imagePathOrUrl) return null;
  const detailUri = globalWalletCampaignDetailUri({ merchantSlug: ad.merchant.slug, ctaUrl: ad.ctaUrl ?? null });
  if (!buildGlobalWalletValueAddedModule({ id: ad.id, title, description, imagePathOrUrl, detailUri })) return null;
  return { id: ad.id, title, description, imagePathOrUrl, detailUri };
}

export async function loadSponsoredTestBroadcast() {
  return prisma.sponsoredAdTestBroadcast.findUnique({
    where: { id: SPONSORED_TEST_BROADCAST_ROW_ID },
    include: {
      adRequest: {
        include: {
          merchant: { select: { name: true, slug: true, logoUrl: true } },
          versions: { orderBy: { number: "desc" }, take: 1, select: { url: true } },
        },
      },
    },
  });
}

export async function getSponsoredTestBroadcastAdId() {
  const row = await loadSponsoredTestBroadcast();
  return row?.adRequestId ?? null;
}

export async function isSponsoredTestBroadcastAd(adId: string) {
  return (await getSponsoredTestBroadcastAdId()) === adId;
}

/** Bandeau in-app pour tous les comptes (prioritaire, sans fréquence ni zone). */
export async function selectSponsoredTestBroadcastCard(placement: AdPlacement): Promise<SponsoredCard | null> {
  const row = await loadSponsoredTestBroadcast();
  if (!row) return null;
  const imageUrl = resolveAdTestBroadcastImageUrl(row.adRequest);
  if (!imageUrl) return null;
  return adToSponsoredTestCard(row.adRequest, placement, imageUrl);
}

/** Module Google Wallet pour toutes les cartes globales enregistrées. */
export async function getSponsoredTestBroadcastWalletModule() {
  const row = await loadSponsoredTestBroadcast();
  if (!row) return null;
  const imageUrl = approvedGoogleWalletHeroUrl(row.adRequest);
  if (!imageUrl) return null;
  return adToGlobalWalletTestModule(row.adRequest, imageUrl);
}

export async function resolveGlobalWalletCampaignModule(userId: string, now: Date = new Date()) {
  const testModule = await getSponsoredTestBroadcastWalletModule();
  if (testModule) return testModule;
  try {
    return await selectSponsoredForGoogleWalletGlobal(userId, now);
  } catch {
    return null;
  }
}

export type SponsoredTestBroadcastAdminStatus = {
  active: boolean;
  adRequestId: string | null;
  startedAt: string | null;
  googleWalletConfigured: boolean;
  globalWalletObjectsCount: number;
  lastGoogleSyncOk: boolean | null;
  lastGoogleSyncError: string | null;
  lastGoogleSyncAt: string | null;
  googleObjectsSynced: number;
  googleObjectsFailed: number;
  googleObjectsTotal: number;
};

export async function getSponsoredTestBroadcastAdminStatus(adRequestId: string): Promise<SponsoredTestBroadcastAdminStatus> {
  const [row, globalWalletObjectsCount] = await Promise.all([
    loadSponsoredTestBroadcast(),
    prisma.googleWalletObject.count({ where: { merchantId: null, customerMembershipId: null } }),
  ]);
  const { isGoogleWalletConfigured } = await import("./env");
  const base: SponsoredTestBroadcastAdminStatus = {
    active: false,
    adRequestId: null,
    startedAt: null,
    googleWalletConfigured: isGoogleWalletConfigured(),
    globalWalletObjectsCount,
    lastGoogleSyncOk: null,
    lastGoogleSyncError: null,
    lastGoogleSyncAt: null,
    googleObjectsSynced: 0,
    googleObjectsFailed: 0,
    googleObjectsTotal: 0,
  };
  if (!row) return base;
  base.active = row.adRequestId === adRequestId;
  base.adRequestId = row.adRequestId;
  base.startedAt = row.startedAt.toISOString();
  base.lastGoogleSyncOk = row.lastGoogleSyncOk;
  base.lastGoogleSyncError = row.lastGoogleSyncError;
  base.lastGoogleSyncAt = row.lastGoogleSyncAt?.toISOString() ?? null;
  base.googleObjectsSynced = row.googleObjectsSynced;
  base.googleObjectsFailed = row.googleObjectsFailed;
  base.googleObjectsTotal = row.googleObjectsTotal;
  return base;
}

async function syncAllGlobalWalletObjectsForTestBroadcast(clearCampaignModule: boolean) {
  const { syncAllGoogleWalletGlobalObjects } = await import("./google-wallet");
  return syncAllGoogleWalletGlobalObjects({ clearCampaignModule });
}

export async function startSponsoredTestBroadcast(input: { adRequestId: string; startedById: string }) {
  const ad = await prisma.adRequest.findUnique({
    where: { id: input.adRequestId },
    include: {
      merchant: { select: { name: true, slug: true, logoUrl: true } },
      versions: { orderBy: { number: "desc" }, take: 1, select: { url: true } },
    },
  });
  if (!ad) throw new GoogleWalletConfigError("Campagne introuvable.");
  const imageUrl = resolveAdTestBroadcastImageUrl(ad);
  if (!imageUrl || !adToSponsoredTestCard(ad, "WALLET_HOME", imageUrl)) {
    throw new GoogleWalletConfigError("Un visuel est requis pour la diffusion test.");
  }
  if (!adToGlobalWalletTestModule(ad, imageUrl)) {
    throw new GoogleWalletConfigError(
      "Visuel ou lien invalide pour Google Wallet (image publique https, texte et lien valides).",
    );
  }

  await prisma.sponsoredAdTestBroadcast.upsert({
    where: { id: SPONSORED_TEST_BROADCAST_ROW_ID },
    update: {
      adRequestId: ad.id,
      startedById: input.startedById,
      startedAt: new Date(),
      lastGoogleSyncOk: null,
      lastGoogleSyncError: null,
      lastGoogleSyncAt: null,
      googleObjectsSynced: 0,
      googleObjectsFailed: 0,
      googleObjectsTotal: 0,
    },
    create: {
      id: SPONSORED_TEST_BROADCAST_ROW_ID,
      adRequestId: ad.id,
      startedById: input.startedById,
    },
  });

  let googleSync = { ok: true as boolean, error: null as string | null, synced: 0, failed: 0, total: 0 };
  try {
    const result = await syncAllGlobalWalletObjectsForTestBroadcast(false);
    googleSync = {
      ok: result.failed === 0 || result.synced > 0,
      error: result.failed > 0 ? `${result.failed} objet(s) en échec sur ${result.attempted}` : null,
      synced: result.synced,
      failed: result.failed,
      total: result.attempted,
    };
    await prisma.sponsoredAdTestBroadcast.update({
      where: { id: SPONSORED_TEST_BROADCAST_ROW_ID },
      data: {
        lastGoogleSyncOk: result.failed === 0,
        lastGoogleSyncError: result.failed > 0 ? `${result.failed} échec(s) sur ${result.attempted} cartes globales` : null,
        lastGoogleSyncAt: new Date(),
        googleObjectsSynced: result.synced,
        googleObjectsFailed: result.failed,
        googleObjectsTotal: result.attempted,
      },
    });
  } catch (error) {
    const message = publicGoogleWalletError(error);
    googleSync = { ok: false, error: message, synced: 0, failed: 0, total: 0 };
    await prisma.sponsoredAdTestBroadcast.update({
      where: { id: SPONSORED_TEST_BROADCAST_ROW_ID },
      data: { lastGoogleSyncOk: false, lastGoogleSyncError: message, lastGoogleSyncAt: new Date() },
    });
    throw error;
  }

  return { googleSync };
}

export async function stopSponsoredTestBroadcast(input: { adRequestId: string }) {
  const row = await loadSponsoredTestBroadcast();
  if (!row || row.adRequestId !== input.adRequestId) {
    return { stopped: false as const, googleSync: { ok: true, error: null, synced: 0, failed: 0, total: 0 } };
  }
  await prisma.sponsoredAdTestBroadcast.delete({ where: { id: SPONSORED_TEST_BROADCAST_ROW_ID } });

  let googleSync = { ok: true as boolean, error: null as string | null, synced: 0, failed: 0, total: 0 };
  try {
    const result = await syncAllGlobalWalletObjectsForTestBroadcast(true);
    googleSync = {
      ok: result.failed === 0 || result.synced > 0,
      error: result.failed > 0 ? `${result.failed} échec(s) sur ${result.attempted}` : null,
      synced: result.synced,
      failed: result.failed,
      total: result.attempted,
    };
  } catch (error) {
    googleSync = { ok: false, error: publicGoogleWalletError(error), synced: 0, failed: 0, total: 0 };
  }
  return { stopped: true as const, googleSync };
}
