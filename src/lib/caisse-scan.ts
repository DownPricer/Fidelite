import { normalizeClientNumber } from "@/lib/client-number";
import { publicScanPayload } from "@/lib/caisse-program";
import { prisma } from "@/lib/prisma";
import { QrError, verifyQrToken } from "@/lib/qr";

async function buildScanResult(input: {
  user: { id: string; firstName: string };
  merchantId: string;
  actorUserId: string;
  globalQrId: string;
}) {
  return prisma.$transaction(async (tx) => {
    const merchant = await tx.merchant.findFirst({
      where: { id: input.merchantId, isActive: true },
      include: { program: true },
    });
    if (!merchant || !merchant.program) {
      throw new QrError("Commerce introuvable.");
    }

    let membership = await tx.customerMembership.findFirst({
      where: { userId: input.user.id, merchantId: input.merchantId },
      include: {
        user: true,
        merchant: { include: { program: true } },
      },
    });

    let cardJustCreated = false;
    if (!membership) {
      membership = await tx.customerMembership.create({
        data: {
          userId: input.user.id,
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
          userId: input.user.id,
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
        expiresAt: new Date(now.getTime() + 90_000),
      },
    });

    return publicScanPayload({
      grantId: grant.id,
      firstName: membership.user.firstName,
      program: membership.merchant.program,
      points: membership.points,
      expiresAt: grant.expiresAt.toISOString(),
      cardJustCreated,
    });
  });
}

export async function processCaisseScan(input: {
  token: string;
  merchantId: string;
  actorUserId: string;
}) {
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

export async function processCaisseScanByClientNumber(input: {
  clientNumber: string;
  merchantId: string;
  actorUserId: string;
}) {
  const normalized = normalizeClientNumber(input.clientNumber);
  if (normalized.length < 4) {
    throw new QrError("Numéro client invalide.");
  }

  const user = await prisma.user.findFirst({
    where: { clientNumber: normalized, isActive: true },
  });
  if (!user) {
    throw new QrError("Aucun client trouvé pour ce numéro.");
  }

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
