import { prisma } from "@/lib/prisma";
import { computeLoyalty } from "@/lib/loyalty";
import { QrError, assertQrUsable, verifyQrToken } from "@/lib/qr";

export async function processCaisseScan(input: {
  token: string;
  merchantId: string;
  actorUserId: string;
}) {
  const payload = await verifyQrToken(input.token.trim());
  const stored = await prisma.qrToken.findUnique({ where: { jti: payload.jti } });
  if (!stored) {
    throw new QrError("QR invalide.");
  }

  assertQrUsable({
    payload,
    merchantId: input.merchantId,
    storedMerchantId: stored.merchantId,
    usedAt: stored.usedAt,
  });

  const membership = await prisma.customerMembership.findFirst({
    where: { id: stored.customerMembershipId, merchantId: input.merchantId },
    include: {
      user: true,
      merchant: { include: { program: true } },
    },
  });
  if (!membership || !membership.merchant.program) {
    throw new QrError("Carte introuvable.");
  }

  const now = new Date();
  // usedAt = dernier scan réussi. Ce n’est pas un verrou : le QR fixe reste réutilisable.
  await prisma.qrToken.update({
    where: { id: stored.id },
    data: { usedAt: now },
  });

  const grant = await prisma.caisseGrant.create({
    data: {
      qrTokenId: stored.id,
      customerMembershipId: membership.id,
      merchantId: input.merchantId,
      actorUserId: input.actorUserId,
      expiresAt: new Date(now.getTime() + 90_000),
    },
  });

  const snapshot = computeLoyalty(membership.points, membership.merchant.program.visitsRequired);
  return {
    grantId: grant.id,
    firstName: membership.user.firstName,
    points: membership.points,
    visitsRequired: membership.merchant.program.visitsRequired,
    rewardLabel: membership.merchant.program.rewardLabel,
    rewardAvailable: snapshot.rewardAvailable,
    progressLabel: snapshot.progressLabel,
    expiresAt: grant.expiresAt.toISOString(),
  };
}
