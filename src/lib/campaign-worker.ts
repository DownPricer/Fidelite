import type { Campaign, CampaignDelivery, CampaignDeliveryChannel, Merchant } from "@prisma/client";
import { estimateMerchantMembersAudience, estimateNetworkLocalAudience, networkAudienceWhere } from "./campaign-audience";
import { sendCampaignEmail, isValidEmailAddress } from "./email";
import { env } from "./env";
import { prisma } from "./prisma";
import { sendPushToUser } from "./push";
import { unsubscribeUrl, signUnsubscribeToken, type UnsubscribeScope } from "./unsubscribe-token";

const MAX_DELIVERY_ATTEMPTS = 3;
/** Une campagne restée en SENDING plus longtemps que ça (crash worker) redevient réclamable. */
const STALE_SENDING_MINUTES = 15;

/**
 * Réclame atomiquement la prochaine campagne programmée à traiter — `FOR UPDATE SKIP LOCKED`
 * garantit qu'aucune campagne n'est jamais prise en charge par deux workers en même temps
 * (Partie 15 : verrouillage atomique, aucune double livraison). Une campagne bloquée en
 * SENDING depuis un crash worker redevient réclamable après STALE_SENDING_MINUTES (reprise
 * après redémarrage).
 */
export async function claimNextScheduledCampaign(): Promise<Campaign | null> {
  const rows = await prisma.$queryRaw<Campaign[]>`
    UPDATE "Campaign" SET status = 'SENDING', "updatedAt" = now()
    WHERE id = (
      SELECT id FROM "Campaign"
      WHERE (status = 'SCHEDULED' AND ("scheduledAt" IS NULL OR "scheduledAt" <= now()))
         OR (status = 'SENDING' AND "updatedAt" < now() - interval '${STALE_SENDING_MINUTES} minutes')
      ORDER BY "createdAt" ASC
      FOR UPDATE SKIP LOCKED
      LIMIT 1
    )
    RETURNING *
  `;
  return rows[0] ?? null;
}

function deliveryChannelsFor(campaign: Campaign): CampaignDeliveryChannel[] {
  if (campaign.channel === "EMAIL") return ["EMAIL"];
  // IN_APP_PUSH : toujours une notification in-app ; push en plus pour qui l'a autorisé.
  return ["IN_APP", "PUSH"];
}

/** Matérialise la liste des destinataires en lignes CampaignDelivery — idempotent (skipDuplicates). */
export async function materializeDeliveries(campaign: Campaign, merchant: Pick<Merchant, "city" | "postalCode">) {
  const channels = deliveryChannelsFor(campaign);

  const recipients: { userId: string; wantsPush: boolean }[] = [];

  if (campaign.audienceType === "MERCHANT_MEMBERS") {
    const memberships = await prisma.customerMembership.findMany({
      where: { merchantId: campaign.merchantId, removedAt: null, user: { isActive: true } },
      select: {
        userId: true,
        user: { select: { preferences: { select: { notifyMerchantOffers: true, adsMerchantPush: true, adsMerchantEmail: true } } } },
      },
    });
    for (const m of memberships) {
      const prefs = m.user.preferences;
      if (campaign.channel === "EMAIL") {
        if (prefs?.adsMerchantEmail) recipients.push({ userId: m.userId, wantsPush: false });
      } else if (prefs?.notifyMerchantOffers) {
        recipients.push({ userId: m.userId, wantsPush: Boolean(prefs?.adsMerchantPush) });
      }
    }
  } else {
    const where = networkAudienceWhere(
      { id: campaign.merchantId, city: merchant.city, postalCode: merchant.postalCode },
      campaign.channel,
    );
    if (where) {
      const prefs = await prisma.customerPreferences.findMany({
        where,
        select: { userId: true, notifyFifeLifeNews: true, adsNetworkPush: true, adsNetworkEmail: true },
      });
      for (const p of prefs) {
        if (campaign.channel === "EMAIL") {
          if (p.adsNetworkEmail) recipients.push({ userId: p.userId, wantsPush: false });
        } else if (p.notifyFifeLifeNews) {
          recipients.push({ userId: p.userId, wantsPush: p.adsNetworkPush });
        }
      }
    }
  }

  const rows = recipients.flatMap((r) =>
    channels
      .filter((channel) => channel !== "PUSH" || r.wantsPush)
      .map((channel) => ({ campaignId: campaign.id, userId: r.userId, channel, status: "PENDING" as const })),
  );

  if (rows.length === 0) return 0;
  const result = await prisma.campaignDelivery.createMany({ data: rows, skipDuplicates: true });
  return result.count;
}

function unsubscribeScopeFor(campaign: Campaign, channel: CampaignDeliveryChannel): UnsubscribeScope {
  const isNetwork = campaign.audienceType === "NETWORK_LOCAL";
  if (channel === "EMAIL") return isNetwork ? "adsNetworkEmail" : "adsMerchantEmail";
  if (channel === "PUSH") return isNetwork ? "adsNetworkPush" : "adsMerchantPush";
  return isNetwork ? "notifyFifeLifeNews" : "notifyMerchantOffers";
}

/** Traite une livraison unique. Ne lève jamais : le statut/erreur est toujours persisté par l'appelant. */
export async function sendOneDelivery(
  delivery: CampaignDelivery,
  campaign: Campaign,
  merchant: Pick<Merchant, "id" | "name" | "logoUrl" | "addressLine1" | "city">,
): Promise<{ status: "SENT" | "FAILED" | "SKIPPED"; error?: string }> {
  try {
    return await sendOneDeliveryUnsafe(delivery, campaign, merchant);
  } catch (error) {
    return { status: "FAILED", error: error instanceof Error ? error.message : "Erreur d'envoi inconnue." };
  }
}

async function sendOneDeliveryUnsafe(
  delivery: CampaignDelivery,
  campaign: Campaign,
  merchant: Pick<Merchant, "id" | "name" | "logoUrl" | "addressLine1" | "city">,
): Promise<{ status: "SENT" | "FAILED" | "SKIPPED"; error?: string }> {
  if (delivery.channel === "IN_APP") {
    await prisma.inAppNotification.create({
      data: {
        userId: delivery.userId,
        merchantId: merchant.id,
        campaignId: campaign.id,
        kind: campaign.audienceType === "NETWORK_LOCAL" ? "NETWORK_DEAL" : "MERCHANT_OFFER",
        title: campaign.title,
        body: campaign.body,
        imageUrl: campaign.imageUrl,
        actionLabel: campaign.actionLabel,
        actionUrl: campaign.actionUrl,
      },
    });
    return { status: "SENT" };
  }

  if (delivery.channel === "PUSH") {
    const results = await sendPushToUser(delivery.userId, {
      title: campaign.title,
      body: campaign.body,
      imageUrl: campaign.imageUrl,
      url: campaign.actionUrl,
      campaignId: campaign.id,
    });
    if (results.length === 0) return { status: "SKIPPED", error: "Aucun appareil abonné." };
    const anySent = results.some((r) => r.ok);
    return anySent ? { status: "SENT" } : { status: "FAILED", error: "Échec d'envoi push sur tous les appareils." };
  }

  // EMAIL
  const user = await prisma.user.findUnique({ where: { id: delivery.userId }, select: { email: true } });
  if (!user || !isValidEmailAddress(user.email)) return { status: "SKIPPED", error: "Adresse e-mail invalide." };

  const suppressed = await prisma.emailSuppression.findUnique({ where: { email: user.email } });
  if (suppressed) return { status: "SKIPPED", error: "Adresse en liste de suppression." };

  const scope = unsubscribeScopeFor(campaign, "EMAIL");
  const token = await signUnsubscribeToken({ userId: delivery.userId, scope, merchantId: merchant.id });
  const result = await sendCampaignEmail({
    to: user.email,
    merchantName: merchant.name,
    merchantLogoUrl: merchant.logoUrl,
    merchantAddress: [merchant.addressLine1, merchant.city].filter(Boolean).join(", ") || null,
    imageUrl: campaign.imageUrl,
    subject: campaign.title,
    title: campaign.title,
    message: campaign.body,
    actionLabel: campaign.actionLabel,
    actionUrl: campaign.actionUrl,
    reasonLabel:
      campaign.audienceType === "NETWORK_LOCAL"
        ? "Vous recevez cet e-mail car vous avez accepté les bons plans locaux Fidelo."
        : `Vous recevez cet e-mail car vous avez la carte de ${merchant.name}.`,
    unsubscribeUrl: unsubscribeUrl(env.appUrl, token),
    preferencesUrl: `${env.appUrl}/compte/parametres`,
  });

  return result.ok ? { status: "SENT" } : { status: "FAILED", error: result.error };
}

/** Délai progressif entre tentatives (Partie 15) : 1 min, 5 min, puis abandon définitif. */
function backoffMinutesForAttempt(attemptNumber: number): number {
  return attemptNumber === 1 ? 1 : 5;
}

/** Traite un lot de livraisons PENDING (et prêtes à réessayer) pour une campagne déjà réclamée. */
export async function processPendingDeliveries(campaign: Campaign, batchSize: number) {
  const merchant = await prisma.merchant.findUnique({ where: { id: campaign.merchantId } });
  if (!merchant) return { processed: 0 };

  const now = new Date();
  const pending = await prisma.campaignDelivery.findMany({
    where: {
      campaignId: campaign.id,
      status: "PENDING",
      attempts: { lt: MAX_DELIVERY_ATTEMPTS },
      OR: [{ nextAttemptAt: null }, { nextAttemptAt: { lte: now } }],
    },
    take: batchSize,
  });

  for (const delivery of pending) {
    const outcome = await sendOneDelivery(delivery, campaign, merchant);
    const attempts = delivery.attempts + 1;
    const willRetry = outcome.status === "FAILED" && attempts < MAX_DELIVERY_ATTEMPTS;

    await prisma.campaignDelivery.update({
      where: { id: delivery.id },
      data: {
        // Échec avec tentatives restantes → reste PENDING pour être réessayé plus tard
        // (délai progressif via nextAttemptAt), jamais renvoyé deux fois entre-temps.
        status: willRetry ? "PENDING" : outcome.status,
        attempts,
        lastError: outcome.error ?? null,
        nextAttemptAt: willRetry ? new Date(now.getTime() + backoffMinutesForAttempt(attempts) * 60_000) : null,
        sentAt: outcome.status === "SENT" ? new Date() : undefined,
      },
    });
  }

  return { processed: pending.length };
}

/** Une fois toutes les livraisons dans un état terminal, fige le statut final de la campagne. */
export async function finalizeCampaignIfComplete(campaignId: string) {
  const remaining = await prisma.campaignDelivery.count({
    where: {
      campaignId,
      OR: [{ status: "PENDING" }],
    },
  });
  if (remaining > 0) return null;

  const [sent, total] = await Promise.all([
    prisma.campaignDelivery.count({ where: { campaignId, status: "SENT" } }),
    prisma.campaignDelivery.count({ where: { campaignId } }),
  ]);

  const status = total === 0 ? "SENT" : sent === total ? "SENT" : sent === 0 ? "FAILED" : "PARTIALLY_SENT";
  await prisma.campaign.update({ where: { id: campaignId }, data: { status, sentAt: new Date() } });
  return status;
}

/**
 * Un tick de worker : réclame une campagne, matérialise ses destinataires si nécessaire,
 * traite un lot de livraisons, clôture si terminé. Conçu pour être rappelé en boucle par
 * scripts/campaign-worker.ts (arrêt propre entre deux ticks sur SIGTERM).
 */
export async function runWorkerTick(batchSize = env.campaignWorkerBatchSize) {
  const campaign = await claimNextScheduledCampaign();
  if (!campaign) return { claimed: false as const };

  const merchant = await prisma.merchant.findUnique({
    where: { id: campaign.merchantId },
    select: { city: true, postalCode: true },
  });
  await materializeDeliveries(campaign, merchant ?? { city: null, postalCode: null });
  const { processed } = await processPendingDeliveries(campaign, batchSize);
  const finalStatus = await finalizeCampaignIfComplete(campaign.id);

  return { claimed: true as const, campaignId: campaign.id, processed, finalStatus };
}
