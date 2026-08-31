import { prisma } from "@/lib/prisma";
import { computeLoyalty } from "@/lib/loyalty";
import { QrError, verifyQrToken } from "@/lib/qr";

export async function processCaisseScan(input: {
  token: string;
  merchantId: string;
  actorUserId: string;
}) {
  const payload = await verifyQrToken(input.token.trim());

  return prisma.$transaction(async (tx) => {
    // 1. Retrouver le QR global Fife Life (jti opaque) et l’utilisateur associé.
    const global = await tx.fifeLifeQrToken.findUnique({
      where: { jti: payload.jti },
      include: { user: true },
    });
    if (!global || !global.user) {
      throw new QrError("QR invalide.");
    }

    const user = global.user;

    // 2. Retrouver ou créer la carte pour le commerce de l’employé (jamais depuis le QR).
    const merchant = await tx.merchant.findFirst({
      where: { id: input.merchantId, isActive: true },
      include: { program: true },
    });
    if (!merchant || !merchant.program) {
      throw new QrError("Commerce introuvable.");
    }

    let membership = await tx.customerMembership.findFirst({
      where: { userId: user.id, merchantId: input.merchantId },
      include: {
        user: true,
        merchant: { include: { program: true } },
      },
    });

    let cardJustCreated = false;
    if (!membership) {
      membership = await tx.customerMembership.create({
        data: {
          userId: user.id,
          merchantId: input.merchantId,
        },
        include: {
          user: true,
          merchant: { include: { program: true } },
        },
      });
      cardJustCreated = true;

      await tx.walletEvent.create({
        data: {
          userId: user.id,
          merchantId: input.merchantId,
          customerMembershipId: membership.id,
          type: "CARD_CREATED",
          payload: {
            merchantName: membership.merchant.name,
          },
        },
      });
    }

    if (!membership.merchant.program) {
      throw new QrError("Carte introuvable.");
    }

    // 3. Marquer le dernier scan global et créer un grant pour les actions caisse suivantes.
    const now = new Date();
    await tx.fifeLifeQrToken.update({
      where: { id: global.id },
      data: { lastScannedAt: now },
    });

    const grant = await tx.caisseGrant.create({
      data: {
        qrTokenId: global.id, // conservé à des fins historiques ; aucune FK active.
        fifeLifeQrTokenId: global.id,
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
      cardJustCreated,
    };
  });
}
