import { LoyaltyTxType, WalletEventType } from "@prisma/client";
import { writeAudit } from "./audit";
import { updateWalletBalance } from "./google-wallet";
import { applyAdjustment, applyEarnVisit, applyRedeemReward, computeLoyalty } from "./loyalty";
import { env } from "./env";
import { prisma } from "./prisma";

export async function applyLoyaltyAction(input: {
  membershipId: string;
  merchantId: string;
  actorId: string;
  type: LoyaltyTxType;
  reason?: string;
  adjustmentDelta?: number;
  ip?: string;
  userAgent?: string;
}) {
  return prisma.$transaction(async (tx) => {
    const membership = await tx.customerMembership.findFirst({
      where: { id: input.membershipId, merchantId: input.merchantId },
      include: {
        user: true,
        merchant: { include: { program: true } },
      },
    });
    if (!membership || !membership.merchant.program) {
      throw new Error("Carte introuvable.");
    }

    const required = membership.merchant.program.visitsRequired;
    let next;
    if (input.type === "EARN_VISIT") {
      next = applyEarnVisit(membership.points, required);
    } else if (input.type === "REDEEM_REWARD") {
      next = applyRedeemReward(membership.points, required);
    } else {
      next = applyAdjustment(membership.points, input.adjustmentDelta ?? 0, input.reason ?? "", required);
    }

    const updated = await tx.customerMembership.update({
      where: { id: membership.id },
      data: { points: next.points },
    });

    const loyaltyTx = await tx.loyaltyTransaction.create({
      data: {
        customerMembershipId: membership.id,
        merchantId: input.merchantId,
        type: input.type,
        pointsDelta: next.delta,
        reason: input.reason,
        performedByUserId: input.actorId,
      },
    });

    await writeAudit({
      actorId: input.actorId,
      merchantId: input.merchantId,
      action: `LOYALTY_${input.type}`,
      metadata: {
        membershipId: membership.id,
        delta: next.delta,
        points: next.points,
      },
      ip: input.ip,
      userAgent: input.userAgent,
    });

    // Événement de portefeuille pour les points commerçant.
    await tx.walletEvent.create({
      data: {
        userId: membership.userId,
        merchantId: input.merchantId,
        customerMembershipId: membership.id,
        type: WalletEventType.MERCHANT_POINTS_UPDATED,
        payload: {
          txId: loyaltyTx.id,
          type: input.type,
          delta: next.delta,
          points: next.points,
          visitsRequired: required,
          progressLabel: next.progressLabel,
          merchantName: membership.merchant.name,
        },
      },
    });

    // Attribution des points Fife Life globaux uniquement lors d'une récompense validée.
    let fifeLifePointsAfter = membership.user.fifeLifePoints;
    if (input.type === LoyaltyTxType.REDEEM_REWARD) {
      const delta = env.fifeLifePointsPerReward;
      const updatedUser = await tx.user.update({
        where: { id: membership.userId },
        data: { fifeLifePoints: { increment: delta } },
      });
      fifeLifePointsAfter = updatedUser.fifeLifePoints;

      await tx.fifeLifePointsLedger.create({
        data: {
          userId: membership.userId,
          delta,
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
            delta,
            total: fifeLifePointsAfter,
            merchantName: membership.merchant.name,
            rewardLabel: membership.merchant.program.rewardLabel,
          },
        },
      });
    }

    void updateWalletBalance({
      membershipId: membership.id,
      points: next.points,
      visitsRequired: required,
      rewardAvailable: next.rewardAvailable,
      classId: membership.googleWalletClassId,
    }).catch((error) => console.error("[wallet] sync", error));

    return {
      membershipId: updated.id,
      firstName: membership.user.firstName,
      points: next.points,
      visitsRequired: required,
      rewardLabel: membership.merchant.program.rewardLabel,
      snapshot: computeLoyalty(next.points, required),
      merchantName: membership.merchant.name,
      fifeLifePoints: fifeLifePointsAfter,
    };
  });
}
