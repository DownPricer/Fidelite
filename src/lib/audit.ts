import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

export async function writeAudit(input: {
  actorId?: string | null;
  merchantId?: string | null;
  action: string;
  metadata?: Prisma.InputJsonValue;
  ip?: string;
  userAgent?: string;
}) {
  await prisma.auditLog.create({
    data: {
      actorId: input.actorId ?? undefined,
      merchantId: input.merchantId ?? undefined,
      action: input.action,
      metadata: input.metadata,
      ip: input.ip,
      userAgent: input.userAgent,
    },
  });
}
