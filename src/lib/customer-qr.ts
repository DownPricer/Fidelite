import { randomUUID } from "crypto";
import QRCode from "qrcode";

import { prisma } from "./prisma";
import { signQrToken } from "./qr";

/** Génère ou récupère le QR canonique (JWT signQrToken + jti FifeLifeQrToken). */
export async function generateCustomerQrDataUrl(userId: string) {
  let qr = await prisma.fifeLifeQrToken.findUnique({
    where: { userId },
  });

  if (!qr) {
    qr = await prisma.fifeLifeQrToken.create({
      data: {
        id: randomUUID(),
        userId,
        jti: randomUUID(),
      },
    });
  }

  const token = await signQrToken({ jti: qr.jti });
  const image = await QRCode.toDataURL(token, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 320,
    color: { dark: "#0F172A", light: "#FFFFFF" },
  });

  return { image, jti: qr.jti };
}

/** Assure qu'une adhésion existe pour le commerce demandé (slug). */
export async function ensureCustomerMembershipForSlug(userId: string, slug: string) {
  const merchant = await prisma.merchant.findUnique({
    where: { slug },
  });
  if (!merchant || !merchant.isActive) {
    return { error: "Commerce introuvable." as const, merchant: null };
  }

  await prisma.customerMembership.upsert({
    where: {
      userId_merchantId: {
        userId,
        merchantId: merchant.id,
      },
    },
    update: {},
    create: {
      userId,
      merchantId: merchant.id,
    },
  });

  return { error: null, merchant };
}
