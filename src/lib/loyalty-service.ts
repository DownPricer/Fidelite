import { LoyaltyTxType } from "@prisma/client";
import { writeAudit } from "./audit";
import { updateWalletBalance } from "./google-wallet";
import { applyAdjustment, applyEarnVisit, applyRedeemReward, computeLoyalty } from "./loyalty";
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

    await tx.loyaltyTransaction.create({
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
    };
  });
}
