import { LoyaltyTxType, WalletEventType } from "@prisma/client";
import { writeAudit } from "./audit";
import { updateWalletBalance } from "./google-wallet";
import { applyAdjustment, applyRedeemReward, computeLoyalty, LoyaltyError } from "./loyalty";
import { computeEarn, legacyRewardLabel, legacyVisitsRequired, programToConfig } from "./loyalty-program";
import { env } from "./env";
import { prisma } from "./prisma";

export async function applyLoyaltyAction(input: {
  membershipId: string;
  merchantId: string;
  actorId: string;
  type: LoyaltyTxType;
  reason?: string;
  adjustmentDelta?: number;
  purchaseAmount?: number;
  rewardId?: string;
  ip?: string;
  userAgent?: string;
}) {
  return prisma.$transaction(async (tx) => {
    const membership = await tx.customerMembership.findFirst({
      where: { id: input.membershipId, merchantId: input.merchantId },
      include: {
        user: true,
        merchant: { include: { program: { include: { rewards: true } } } },
      },
    });
    if (!membership || !membership.merchant.program) {
      throw new Error("Carte introuvable.");
    }

    const program = membership.merchant.program;
    const config = programToConfig(program);
    const required = legacyVisitsRequired(program);
    const rewardLabel = legacyRewardLabel(program);

    let delta = 0;
    if (input.type === "EARN_VISIT") {
      delta = computeEarn(config.mode, config.rules, input.purchaseAmount ?? 0);
      if (delta <= 0) throw new LoyaltyError("Aucun gain applicable pour cette transaction.");
    } else if (input.type === "REDEEM_REWARD") {
      const redeem = applyRedeemReward(membership.points, required);
      delta = redeem.delta;
    } else if (input.type === "ADJUSTMENT") {
      const adj = applyAdjustment(membership.points, input.adjustmentDelta ?? 0, input.reason ?? "", required);
      delta = adj.delta;
    } else if (input.type === "CANCEL") {
      delta = input.adjustmentDelta ?? 0;
      if (delta === 0) throw new LoyaltyError("Annulation invalide.");
    }

    const nextPoints = membership.points + delta;
    if (nextPoints < 0) throw new LoyaltyError("Le solde ne peut pas devenir négatif.");

    const updated = await tx.customerMembership.update({
      where: { id: membership.id },
      data: { points: nextPoints },
    });

    const loyaltyTx = await tx.loyaltyTransaction.create({
      data: {
        customerMembershipId: membership.id,
        merchantId: input.merchantId,
        type: input.type,
        pointsDelta: delta,
        purchaseAmount: input.purchaseAmount,
        reason: input.reason,
        rewardId: input.rewardId,
        programVersion: program.version,
        performedByUserId: input.actorId,
      },
    });

    await tx.merchantMembership.updateMany({
      where: { userId: input.actorId, merchantId: input.merchantId },
      data: { lastActivityAt: new Date() },
    });

    const snapshot = computeLoyalty(nextPoints, required);

    await writeAudit({
      actorId: input.actorId,
      merchantId: input.merchantId,
      action: `LOYALTY_${input.type}`,
      metadata: {
        membershipId: membership.id,
        delta,
        points: nextPoints,
        purchaseAmount: input.purchaseAmount,
      },
      ip: input.ip,
      userAgent: input.userAgent,
    });

    await tx.walletEvent.create({
      data: {
        userId: membership.userId,
        merchantId: input.merchantId,
        customerMembershipId: membership.id,
        type: WalletEventType.MERCHANT_POINTS_UPDATED,
        payload: {
          txId: loyaltyTx.id,
          type: input.type,
          delta,
          points: nextPoints,
          visitsRequired: required,
          progressLabel: snapshot.progressLabel,
          merchantName: membership.merchant.name,
        },
      },
    });

    let fifeLifePointsAfter = membership.user.fifeLifePoints;
    if (input.type === LoyaltyTxType.REDEEM_REWARD) {
      const fifeDelta = env.fifeLifePointsPerReward;
      const updatedUser = await tx.user.update({
        where: { id: membership.userId },
        data: { fifeLifePoints: { increment: fifeDelta } },
      });
      fifeLifePointsAfter = updatedUser.fifeLifePoints;

      await tx.fifeLifePointsLedger.create({
        data: {
          userId: membership.userId,
          delta: fifeDelta,
          reason: input.reason ?? "Récompense validée",
          loyaltyTransactionId: loyaltyTx.id,
        },
      });

      await tx.walletEvent.create({
        data: {
          userId: membership.userId,
          merchantId: input.merchantId,
          customerMembershipId: membership.id,
          type: WalletEventType.FIFE_LIFE_POINTS_UPDATED,
          payload: {
            delta: fifeDelta,
            total: fifeLifePointsAfter,
            merchantName: membership.merchant.name,
            rewardLabel,
          },
        },
      });
    }

    void updateWalletBalance({
      membershipId: membership.id,
      points: nextPoints,
      visitsRequired: required,
      rewardAvailable: snapshot.rewardAvailable,
      classId: membership.googleWalletClassId,
    }).catch((error) => console.error("[wallet] sync", error));

    return {
      membershipId: updated.id,
      firstName: membership.user.firstName,
      points: nextPoints,
      visitsRequired: required,
      rewardLabel,
      snapshot,
      merchantName: membership.merchant.name,
      fifeLifePoints: fifeLifePointsAfter,
    };
  });
}
