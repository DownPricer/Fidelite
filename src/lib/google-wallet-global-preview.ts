import type { AdRequest, Merchant } from "@prisma/client";
import { env, isGoogleWalletConfigured } from "./env";
import {
  buildGlobalWalletValueAddedModule,
  globalWalletCampaignDetailUri,
  type GlobalWalletCampaignModule,
} from "./google-wallet-campaign-module";
import { GoogleWalletApiError, GoogleWalletConfigError, publicGoogleWalletError } from "./google-wallet";
import { prisma } from "./prisma";
import { selectSponsoredForGoogleWalletGlobal } from "./sponsored-selection";

export const GOOGLE_WALLET_QA_PREVIEW_MS = 30 * 60_000;

export function resolveQaCustomerUserId() {
  const id = env.qaCustomerUserId?.trim();
  return id || null;
}

export function resolveAdWalletPreviewImageUrl(ad: Pick<AdRequest, "finalImageUrl" | "requestedImageUrl"> & { versions?: { url: string }[] }) {
  return ad.finalImageUrl ?? ad.versions?.[0]?.url ?? ad.requestedImageUrl ?? null;
}

export function adRequestToGlobalWalletCampaignModule(
  ad: Pick<AdRequest, "requestedText" | "ctaLabel" | "ctaUrl"> & { merchant: Pick<Merchant, "name" | "slug"> },
  imagePathOrUrl: string,
): GlobalWalletCampaignModule | null {
  const title = (ad.ctaLabel?.trim() || ad.merchant.name).slice(0, 60);
  const description = ad.requestedText.trim();
  if (!title || !description || !imagePathOrUrl) return null;
  const detailUri = globalWalletCampaignDetailUri({ merchantSlug: ad.merchant.slug, ctaUrl: ad.ctaUrl ?? null });
  const module = buildGlobalWalletValueAddedModule({
    id: "preview",
    title,
    description,
    imagePathOrUrl,
    detailUri,
  });
  if (!module) return null;
  return {
    id: "preview",
    title,
    description,
    imagePathOrUrl,
    detailUri,
  };
}

async function loadActivePreview(userId: string, now: Date) {
  const row = await prisma.googleWalletGlobalAdPreview.findUnique({
    where: { userId },
    include: { adRequest: { include: { merchant: { select: { name: true, slug: true } } } } },
  });
  if (!row) return null;
  if (row.expiresAt.getTime() <= now.getTime()) {
    await expireGoogleWalletGlobalAdPreview(userId);
    return null;
  }
  return row;
}

/** Priorité : aperçu QA actif, sinon sélection campagne normale (inchangée). */
export async function resolveGlobalWalletCampaignModule(userId: string, now: Date = new Date()) {
  const preview = await loadActivePreview(userId, now);
  if (preview) {
    const imageUrl = resolveAdWalletPreviewImageUrl(preview.adRequest);
    if (!imageUrl) return null;
    return adRequestToGlobalWalletCampaignModule(preview.adRequest, imageUrl);
  }
  try {
    return await selectSponsoredForGoogleWalletGlobal(userId, now);
  } catch {
    return null;
  }
}

export async function expireGoogleWalletGlobalAdPreview(userId: string) {
  const deleted = await prisma.googleWalletGlobalAdPreview.deleteMany({ where: { userId } });
  if (deleted.count === 0) return { cleared: false as const };
  if (isGoogleWalletConfigured()) {
    const { syncGoogleWalletGlobalObject } = await import("./google-wallet");
    await syncGoogleWalletGlobalObject(userId, { clearCampaignModule: true });
  }
  return { cleared: true as const };
}

export async function expireDueGoogleWalletGlobalAdPreviews(now: Date = new Date()) {
  const due = await prisma.googleWalletGlobalAdPreview.findMany({
    where: { expiresAt: { lte: now } },
    select: { userId: true },
  });
  let expired = 0;
  for (const row of due) {
    await expireGoogleWalletGlobalAdPreview(row.userId);
    expired += 1;
  }
  return expired;
}

export type GoogleWalletPreviewAdminStatus = {
  qaCustomerConfigured: boolean;
  googleWalletConfigured: boolean;
  hasGlobalWalletObject: boolean;
  active: boolean;
  expiresAt: string | null;
  adRequestId: string | null;
  lastGoogleSyncOk: boolean | null;
  lastGoogleSyncError: string | null;
  lastGoogleSyncAt: string | null;
};

export async function getGoogleWalletPreviewAdminStatus(adRequestId: string): Promise<GoogleWalletPreviewAdminStatus> {
  const qaUserId = resolveQaCustomerUserId();
  const base: GoogleWalletPreviewAdminStatus = {
    qaCustomerConfigured: Boolean(qaUserId),
    googleWalletConfigured: isGoogleWalletConfigured(),
    hasGlobalWalletObject: false,
    active: false,
    expiresAt: null,
    adRequestId: null,
    lastGoogleSyncOk: null,
    lastGoogleSyncError: null,
    lastGoogleSyncAt: null,
  };
  if (!qaUserId) return base;

  const [walletRow, preview] = await Promise.all([
    prisma.googleWalletObject.findFirst({
      where: { userId: qaUserId, merchantId: null, customerMembershipId: null },
      select: { id: true },
    }),
    prisma.googleWalletGlobalAdPreview.findUnique({ where: { userId: qaUserId } }),
  ]);
  base.hasGlobalWalletObject = Boolean(walletRow);
  if (!preview) return base;
  if (preview.expiresAt.getTime() <= Date.now()) {
    await expireGoogleWalletGlobalAdPreview(qaUserId);
    return base;
  }
  base.active = preview.adRequestId === adRequestId;
  base.adRequestId = preview.adRequestId;
  base.expiresAt = preview.expiresAt.toISOString();
  base.lastGoogleSyncOk = preview.lastGoogleSyncOk;
  base.lastGoogleSyncError = preview.lastGoogleSyncError;
  base.lastGoogleSyncAt = preview.lastGoogleSyncAt?.toISOString() ?? null;
  return base;
}

export async function startGoogleWalletGlobalAdPreview(input: { adRequestId: string; startedById: string }) {
  const qaUserId = resolveQaCustomerUserId();
  if (!qaUserId) {
    throw new GoogleWalletConfigError("QA_CUSTOMER_USER_ID n'est pas configuré sur le serveur.");
  }
  if (!isGoogleWalletConfigured()) {
    throw new GoogleWalletConfigError("Google Wallet non configuré.");
  }

  const ad = await prisma.adRequest.findUnique({
    where: { id: input.adRequestId },
    include: {
      merchant: { select: { name: true, slug: true } },
      versions: { orderBy: { number: "desc" }, take: 1, select: { url: true } },
    },
  });
  if (!ad) throw new GoogleWalletConfigError("Campagne introuvable.");

  const imageUrl = resolveAdWalletPreviewImageUrl(ad);
  const module = imageUrl ? adRequestToGlobalWalletCampaignModule(ad, imageUrl) : null;
  if (!module) {
    throw new GoogleWalletConfigError("Visuel ou lien invalide pour Google Wallet (image https requise, texte et lien valides).");
  }

  const walletRow = await prisma.googleWalletObject.findFirst({
    where: { userId: qaUserId, merchantId: null, customerMembershipId: null },
    select: { id: true },
  });
  if (!walletRow) {
    return {
      needsWalletSave: true as const,
      message:
        "Ajoutez d'abord la carte globale Fideto à Google Wallet avec le compte client test (connexion QA), puis relancez l'aperçu.",
    };
  }

  const expiresAt = new Date(Date.now() + GOOGLE_WALLET_QA_PREVIEW_MS);
  await prisma.googleWalletGlobalAdPreview.upsert({
    where: { userId: qaUserId },
    update: {
      adRequestId: ad.id,
      expiresAt,
      startedById: input.startedById,
      lastGoogleSyncOk: null,
      lastGoogleSyncError: null,
      lastGoogleSyncAt: null,
    },
    create: {
      userId: qaUserId,
      adRequestId: ad.id,
      expiresAt,
      startedById: input.startedById,
    },
  });

  let googleSync = { ok: true as boolean, error: null as string | null };
  try {
    const { syncGoogleWalletGlobalObject } = await import("./google-wallet");
    await syncGoogleWalletGlobalObject(qaUserId);
    await prisma.googleWalletGlobalAdPreview.update({
      where: { userId: qaUserId },
      data: { lastGoogleSyncOk: true, lastGoogleSyncError: null, lastGoogleSyncAt: new Date() },
    });
  } catch (error) {
    const message = publicGoogleWalletError(error);
    googleSync = { ok: false, error: message };
    await prisma.googleWalletGlobalAdPreview.update({
      where: { userId: qaUserId },
      data: { lastGoogleSyncOk: false, lastGoogleSyncError: message, lastGoogleSyncAt: new Date() },
    });
    if (error instanceof GoogleWalletApiError) {
      throw new GoogleWalletApiError(message, error.googleStatus);
    }
    throw error;
  }

  return { needsWalletSave: false as const, expiresAt: expiresAt.toISOString(), googleSync };
}

export async function stopGoogleWalletGlobalAdPreview(input: { adRequestId: string }) {
  const qaUserId = resolveQaCustomerUserId();
  if (!qaUserId) {
    throw new GoogleWalletConfigError("QA_CUSTOMER_USER_ID n'est pas configuré sur le serveur.");
  }
  const preview = await prisma.googleWalletGlobalAdPreview.findUnique({ where: { userId: qaUserId } });
  if (!preview || preview.adRequestId !== input.adRequestId) {
    return { stopped: false as const, googleSync: { ok: true, error: null } };
  }
  await expireGoogleWalletGlobalAdPreview(qaUserId);
  return { stopped: true as const, googleSync: { ok: true, error: null } };
}
