import type { AdVisualAuthor, AdVisualVersionStatus, Prisma } from "@prisma/client";
import { scheduleGoogleWalletGlobalCampaignResync } from "./google-wallet";
import type { Db } from "./ad-visual-workflow";
import { deliverStaffNotificationSideEffects } from "./staff-notification-delivery";

export { WALLET_VISUAL_STATUS_LABELS } from "./ad-google-wallet-visual-labels";

type AdWalletCtx = { id: string; merchantId: string; campaignId: string | null };

async function notify(
  db: Db,
  input: {
    audience: "MERCHANT" | "SUPER_ADMIN";
    kind: string;
    message: string;
    merchantId: string | null;
    campaignId: string | null;
    adRequestId: string | null;
    comment?: string | null;
  },
) {
  await db.staffNotification.create({
    data: {
      audience: input.audience,
      merchantId: input.merchantId,
      campaignId: input.campaignId,
      adRequestId: input.adRequestId,
      kind: input.kind,
      message: input.message,
    },
  });
  await deliverStaffNotificationSideEffects(db, input);
}

async function nextWalletNumber(db: Db, adRequestId: string) {
  const last = await db.adGoogleWalletVisualVersion.findFirst({
    where: { adRequestId },
    orderBy: { number: "desc" },
    select: { number: true },
  });
  return (last?.number ?? 0) + 1;
}

export type WalletVersionFiles = {
  url: string;
  originalUrl: string;
  width: number;
  height: number;
  reframed: boolean;
};

export async function proposeWalletVisual(db: Db, ad: AdWalletCtx, files: WalletVersionFiles, adminId: string) {
  await db.adGoogleWalletVisualVersion.updateMany({
    where: { adRequestId: ad.id, status: { in: ["DRAFT", "PROPOSED"] } },
    data: { status: "SUPERSEDED" satisfies AdVisualVersionStatus },
  });
  const version = await db.adGoogleWalletVisualVersion.create({
    data: {
      adRequestId: ad.id,
      number: await nextWalletNumber(db, ad.id),
      author: "FIDETO" satisfies AdVisualAuthor,
      status: "PROPOSED",
      url: files.url,
      originalUrl: files.originalUrl,
      width: files.width,
      height: files.height,
      reframed: files.reframed,
      createdBy: adminId,
    },
  });
  await db.adRequest.update({
    where: { id: ad.id },
    data: { googleWalletVisualStatus: "SENT_TO_MERCHANT", googleWalletVisualComment: null },
  });
  await notify(db, {
    audience: "MERCHANT",
    merchantId: ad.merchantId,
    campaignId: ad.campaignId,
    adRequestId: ad.id,
    kind: "WALLET_VISUAL_PROPOSED",
    message: "Fideto vous envoie un visuel Google Wallet à valider.",
  });
  return version;
}

export async function approveWalletVisualAsIs(db: Db, ad: AdWalletCtx, adminId: string, url: string, originalUrl: string) {
  await db.adGoogleWalletVisualVersion.updateMany({
    where: { adRequestId: ad.id, status: "APPROVED" },
    data: { status: "SUPERSEDED" },
  });
  const version = await db.adGoogleWalletVisualVersion.create({
    data: {
      adRequestId: ad.id,
      number: await nextWalletNumber(db, ad.id),
      author: "FIDETO",
      status: "APPROVED",
      url,
      originalUrl,
      width: 1032,
      height: 812,
      reframed: false,
      decidedBy: adminId,
      decidedAt: new Date(),
      createdBy: adminId,
    },
  });
  await db.adRequest.update({
    where: { id: ad.id },
    data: {
      googleWalletHeroUrl: url,
      googleWalletHeroOriginalUrl: originalUrl,
      googleWalletFinalVersionId: version.id,
      googleWalletVisualStatus: "APPROVED",
      googleWalletVisualComment: null,
    },
  });
  scheduleGoogleWalletGlobalCampaignResync();
  await notify(db, {
    audience: "MERCHANT",
    merchantId: ad.merchantId,
    campaignId: ad.campaignId,
    adRequestId: ad.id,
    kind: "WALLET_VISUAL_APPROVED",
    message: "Visuel Google Wallet validé par Fideto.",
  });
  return version;
}

export async function merchantRespondWalletVisual(
  db: Db,
  ad: AdWalletCtx,
  input: { action: "accept" | "request_changes"; comment?: string | null },
  actorId: string,
) {
  const version = await db.adGoogleWalletVisualVersion.findFirst({
    where: { adRequestId: ad.id, status: "PROPOSED" },
    orderBy: { number: "desc" },
  });
  if (!version) return null;

  if (input.action === "accept") {
    await db.adGoogleWalletVisualVersion.update({
      where: { id: version.id },
      data: { status: "APPROVED", decidedBy: actorId, decidedAt: new Date() },
    });
    await db.adRequest.update({
      where: { id: ad.id },
      data: {
        googleWalletHeroUrl: version.url,
        googleWalletHeroOriginalUrl: version.originalUrl,
        googleWalletFinalVersionId: version.id,
        googleWalletVisualStatus: "APPROVED",
        googleWalletVisualComment: null,
      },
    });
    scheduleGoogleWalletGlobalCampaignResync();
    await notify(db, {
      audience: "SUPER_ADMIN",
      merchantId: ad.merchantId,
      campaignId: ad.campaignId,
      adRequestId: ad.id,
      kind: "MERCHANT_ACCEPTED_WALLET_VISUAL",
      message: "Le commerçant a validé le visuel Google Wallet.",
    });
    return version;
  }

  const comment = (input.comment ?? "").trim();
  await db.adGoogleWalletVisualVersion.update({
    where: { id: version.id },
    data: { status: "CHANGES_REQUESTED", comment, decidedBy: actorId, decidedAt: new Date() },
  });
  await db.adRequest.update({
    where: { id: ad.id },
    data: { googleWalletVisualStatus: "CHANGES_REQUESTED", googleWalletVisualComment: comment },
  });
  await notify(db, {
    audience: "SUPER_ADMIN",
    merchantId: ad.merchantId,
    campaignId: ad.campaignId,
    adRequestId: ad.id,
    kind: "WALLET_VISUAL_CHANGES_REQUESTED",
    message: `Modification demandée sur le visuel Google Wallet : ${comment}`,
    comment,
  });
  return version;
}

export async function clearWalletVisual(db: Db, ad: AdWalletCtx) {
  await db.adRequest.update({
    where: { id: ad.id },
    data: {
      googleWalletHeroUrl: null,
      googleWalletHeroOriginalUrl: null,
      googleWalletFinalVersionId: null,
      googleWalletVisualStatus: "NOT_PREPARED",
      googleWalletVisualComment: null,
    },
  });
  scheduleGoogleWalletGlobalCampaignResync();
}
