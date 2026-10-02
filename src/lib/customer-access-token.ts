import { randomBytes } from "crypto";
import { CustomerAccessTokenKind } from "@prisma/client";
import { prisma } from "./prisma";
import { hashToken } from "./session";

export const CUSTOMER_TOKEN_TTL = {
  emailVerificationMs: 48 * 60 * 60 * 1000,
  accountRecoveryMs: 60 * 60 * 1000,
  phoneVerificationMs: 10 * 60 * 1000,
} as const;

export function createRawCustomerToken() {
  return randomBytes(32).toString("hex");
}

export async function issueCustomerAccessToken(
  userId: string,
  kind: CustomerAccessTokenKind,
  ttlMs: number,
) {
  const raw = createRawCustomerToken();
  const expiresAt = new Date(Date.now() + ttlMs);
  await prisma.customerAccessToken.create({
    data: {
      userId,
      kind,
      tokenHash: hashToken(raw),
      expiresAt,
    },
  });
  return { raw, expiresAt };
}

export async function consumeCustomerAccessToken(raw: string, kind: CustomerAccessTokenKind) {
  const tokenHash = hashToken(raw);
  const row = await prisma.customerAccessToken.findUnique({ where: { tokenHash } });
  if (!row || row.kind !== kind || row.usedAt || row.expiresAt <= new Date()) {
    return null;
  }
  await prisma.customerAccessToken.update({
    where: { id: row.id },
    data: { usedAt: new Date() },
  });
  return row;
}

export async function invalidateCustomerAccessTokens(userId: string, kind: CustomerAccessTokenKind) {
  await prisma.customerAccessToken.updateMany({
    where: { userId, kind, usedAt: null },
    data: { usedAt: new Date() },
  });
}
