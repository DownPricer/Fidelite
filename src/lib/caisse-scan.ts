import { CaisseScanError, maskClientNumberForLog } from "@/lib/caisse-scan-errors";
import { deriveClientNumber, normalizeCustomerNumber } from "@/lib/client-number";
import { publicScanPayload } from "@/lib/caisse-program";
import type { CardTemplateConfig } from "@/lib/card-template-schema";
import { getActiveMerchantLoyaltyContext } from "@/lib/loyalty-context";
import { buildNextBenefit } from "@/lib/loyalty-engine";
import { CAISSE_GRANT_TTL_MS, evaluateCustomerRewards } from "@/lib/loyalty-commit";
import { computeEarnFromCents } from "@/lib/loyalty-program";
import { prisma } from "@/lib/prisma";
import { QrError, verifyQrToken } from "@/lib/qr";
import { logWalletUnlock } from "@/lib/wallet-unlock-log";

async function buildScanResult(input: {
  user: { id: string; firstName: string; lastName?: string | null };
  merchantId: string;
  actorUserId: string;
  globalQrId: string;
}) {
  return prisma.$transaction(async (tx) => {
    const context = await getActiveMerchantLoyaltyContext(input.merchantId, tx);
    if (!context || !context.isOperational) {
      throw new CaisseScanError(
        "Ce client ne peut pas être utilisé dans ce commerce.",
        "MERCHANT_UNAVAILABLE",
        403,
      );
    }

    let membership = await tx.customerMembership.findFirst({
      where: { userId: input.user.id, merchantId: input.merchantId },
      include: { user: true },
    });

    let cardJustCreated = false;
    if (!membership) {
      membership = await tx.customerMembership.create({
        data: {
          userId: input.user.id,
          merchantId: input.merchantId,
        },
        include: { user: true },
      });
      cardJustCreated = true;
    } else if (membership.removedAt) {
      membership = await tx.customerMembership.update({
        where: { id: membership.id },
        data: { removedAt: null },
        include: { user: true },
      });
      cardJustCreated = true;
    }

    const publishedTemplate = context.cardTemplate
      ? {
          backgroundUrl: context.cardTemplate.backgroundUrl,
          config: context.cardTemplate.config,
          loyaltyMode: context.mode,
        }
      : null;

    if (cardJustCreated) {
      logWalletUnlock("carte créée ou réactivée", {
        merchantId: input.merchantId,
        membershipId: membership.id,
        userId: input.user.id,
      });
      const walletEvent = await tx.walletEvent.create({
        data: {
          userId: input.user.id,
          merchantId: input.merchantId,
          customerMembershipId: membership.id,
          type: "CARD_UNLOCKED",
          payload: {
            merchantName: context.merchant.name,
            slug: context.merchant.slug,
            logoUrl: context.merchant.logoUrl,
            primaryColor: context.merchant.primaryColor,
            points: membership.points,
            visitsRequired: context.progressTarget,
            rewardLabel: context.primaryRewardLabel ?? "Avantage",
            loyaltyMode: context.mode,
            cardTemplate: publishedTemplate
              ? {
                  backgroundUrl: publishedTemplate.backgroundUrl,
                  config: publishedTemplate.config as CardTemplateConfig,
                  loyaltyMode: context.mode,
                }
              : null,
          },
        },
      });
      logWalletUnlock("événement créé", {
        eventId: walletEvent.id,
        eventType: walletEvent.type,
        merchantId: input.merchantId,
        membershipId: membership.id,
        userId: input.user.id,
      });
    }

    const now = new Date();
    await tx.fifeLifeQrToken.update({
      where: { id: input.globalQrId },
      data: { lastScannedAt: now },
    });

    const grant = await tx.caisseGrant.create({
      data: {
        qrTokenId: input.globalQrId,
        fifeLifeQrTokenId: input.globalQrId,
        customerMembershipId: membership.id,
        merchantId: input.merchantId,
        actorUserId: input.actorUserId,
        expiresAt: new Date(now.getTime() + CAISSE_GRANT_TTL_MS),
        programId: context.programId,
        programVersion: context.programVersion,
        programMode: context.mode,
      },
    });

    const rewards = await evaluateCustomerRewards({
      config: context.config,
      balance: membership.points,
      merchantName: context.merchant.name,
      customerMembershipId: membership.id,
      merchantId: input.merchantId,
      grantCreatedAt: grant.createdAt,
      now,
      db: tx,
    });
    const nextBenefit = buildNextBenefit(
      context.rewards,
      membership.points,
      context.mode,
      context.config.rules,
      computeEarnFromCents(context.mode, context.config.rules, 0).earned,
    );

    return {
      ...publicScanPayload({
        grantId: grant.id,
        firstName: membership.user.firstName,
        lastName: membership.user.lastName,
        context,
        points: membership.points,
        expiresAt: grant.expiresAt.toISOString(),
        cardJustCreated,
        rewards,
        nextBenefit,
      }),
      merchant: {
        name: context.merchant.name,
        slug: context.merchant.slug,
        logoUrl: context.merchant.logoUrl,
        primaryColor: context.merchant.primaryColor,
      },
      cardTemplate: publishedTemplate
        ? {
            backgroundUrl: publishedTemplate.backgroundUrl,
            config: publishedTemplate.config as CardTemplateConfig,
            loyaltyMode: context.mode,
          }
        : null,
    };
  });
}

export async function processCaisseScan(input: {
  token: string;
  merchantId: string;
  actorUserId: string;
}) {
  logWalletUnlock("scan validé", { merchantId: input.merchantId });
  const payload = await verifyQrToken(input.token.trim());

  const global = await prisma.fifeLifeQrToken.findUnique({
    where: { jti: payload.jti },
    include: { user: true },
  });
  if (!global || !global.user) {
    throw new QrError("QR invalide.");
  }

  return buildScanResult({
    user: global.user,
    merchantId: input.merchantId,
    actorUserId: input.actorUserId,
    globalQrId: global.id,
  });
}

async function findUserByCustomerNumber(normalized: string) {
  const direct = await prisma.user.findFirst({
    where: { clientNumber: normalized, isActive: true },
  });
  if (direct) return direct;

  const candidates = await prisma.user.findMany({
    where: {
      isActive: true,
      OR: [{ clientNumber: null }, { clientNumber: "" }],
    },
    select: { id: true },
    take: 10_000,
  });

  const derivedMatch = candidates.find((candidate) => deriveClientNumber(candidate.id) === normalized);
  if (!derivedMatch) return null;

  return prisma.user.findFirst({
    where: { id: derivedMatch.id, isActive: true },
  });
}

export async function processCaisseScanByClientNumber(input: {
  clientNumber: string;
  merchantId: string;
  actorUserId: string;
}) {
  logWalletUnlock("scan validé", { merchantId: input.merchantId });
  const normalized = normalizeCustomerNumber(input.clientNumber);
  console.info("[caisse-scan] numéro normalisé", maskClientNumberForLog(normalized));
  if (normalized.length < 4 || normalized.length > 8) {
    console.info("[caisse-scan] refus : raison", "INVALID_CLIENT_NUMBER");
    throw new CaisseScanError("Numéro client invalide.", "INVALID_CLIENT_NUMBER", 400);
  }

  const user = await findUserByCustomerNumber(normalized);
  if (!user) {
    console.info("[caisse-scan] refus : raison", "CLIENT_NOT_FOUND");
    throw new CaisseScanError("Client introuvable.", "CLIENT_NOT_FOUND", 404);
  }
  console.info("[caisse-scan] client trouvé", { userId: user.id });

  let global = await prisma.fifeLifeQrToken.findUnique({
    where: { userId: user.id },
  });
  if (!global) {
    const { randomUUID } = await import("crypto");
    global = await prisma.fifeLifeQrToken.create({
      data: {
        id: randomUUID(),
        userId: user.id,
        jti: randomUUID(),
      },
    });
  }

  return buildScanResult({
    user,
    merchantId: input.merchantId,
    actorUserId: input.actorUserId,
    globalQrId: global.id,
  });
}
