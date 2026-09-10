import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client";
import QRCode from "qrcode";

import { prisma } from "./prisma";
import { signQrToken } from "./qr";

function logCustomerQr(step: string, detail?: string) {
  console.info(`[customer-qr] ${step}${detail ? ` — ${detail}` : ""}`);
}

function isUniqueViolation(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

export function isCustomerQrInfrastructureError(error: unknown) {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return false;
  return error.code === "P2021" || error.code === "P2022";
}

/** Crée ou récupère le jeton QR actif de manière idempotente. */
export async function ensureCustomerQrToken(userId: string) {
  const existing = await prisma.fifeLifeQrToken.findUnique({
    where: { userId },
  });
  if (existing) {
    logCustomerQr("jeton existant trouvé");
    return existing;
  }

  try {
    const created = await prisma.fifeLifeQrToken.create({
      data: {
        userId,
        jti: randomUUID(),
      },
    });
    logCustomerQr("nouveau jeton créé");
    return created;
  } catch (error) {
    if (isUniqueViolation(error)) {
      const concurrent = await prisma.fifeLifeQrToken.findUnique({
        where: { userId },
      });
      if (concurrent) {
        logCustomerQr("jeton existant trouvé");
        return concurrent;
      }
    }
    throw error;
  }
}

/** Génère ou récupère le QR canonique (JWT signQrToken + jti FifeLifeQrToken). */
export async function generateCustomerQrDataUrl(userId: string) {
  const qr = await ensureCustomerQrToken(userId);

  const token = await signQrToken({ jti: qr.jti });
  const image = await QRCode.toDataURL(token, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 320,
    color: { dark: "#0F172A", light: "#FFFFFF" },
  });

  logCustomerQr("image générée");
  return { image, jti: qr.jti };
}

/** Assure qu'une adhésion existe si le commerce est actif (best-effort, sans bloquer le QR). */
export async function tryEnsureCustomerMembershipForSlug(userId: string, slug: string) {
  const merchant = await prisma.merchant.findUnique({
    where: { slug },
  });
  if (!merchant || !merchant.isActive) {
    logCustomerQr("commerce introuvable pour le slug", slug);
    return { ensured: false as const, merchant: null };
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

  return { ensured: true as const, merchant };
}

/** @deprecated Préférer tryEnsureCustomerMembershipForSlug — ne bloque plus le QR global. */
export async function ensureCustomerMembershipForSlug(userId: string, slug: string) {
  const result = await tryEnsureCustomerMembershipForSlug(userId, slug);
  if (!result.merchant) {
    return { error: "Commerce introuvable." as const, merchant: null };
  }
  return { error: null, merchant: result.merchant };
}
