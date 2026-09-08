import type { Prisma } from "@prisma/client";
import { hashPassword } from "./password";
import { prisma } from "./prisma";
import { presetPermissions } from "./staff-permissions";
import type { createEmployeeSchema } from "./validation";
import type { z } from "zod";

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;

export class EmployeeCreateError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.name = "EmployeeCreateError";
    this.status = status;
  }
}

export async function createDirectEmployee(input: {
  merchantId: string;
  data: CreateEmployeeInput;
}) {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.data.email },
    include: {
      merchantMemberships: {
        where: { merchantId: input.merchantId, role: "EMPLOYEE" },
      },
    },
  });

  if (existingUser?.merchantMemberships.length) {
    throw new EmployeeCreateError("Un employé utilise déjà cette adresse e-mail.", 409);
  }

  if (existingUser) {
    throw new EmployeeCreateError(
      "Cette adresse e-mail est déjà utilisée par un compte Fife Life. Choisissez une autre adresse.",
      409,
    );
  }

  const permissions = input.data.permissions ?? presetPermissions(input.data.staffPreset);
  const passwordHash = await hashPassword(input.data.password);
  const now = new Date();

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: input.data.email,
        passwordHash,
        firstName: input.data.firstName,
        lastName: input.data.lastName || null,
        phone: input.data.phone || null,
        mustChangePassword: false,
        isActive: true,
        privacyConsentAt: now,
      },
    });

    const membership = await tx.merchantMembership.create({
      data: {
        userId: user.id,
        merchantId: input.merchantId,
        role: "EMPLOYEE",
        staffPreset: input.data.staffPreset,
        permissions: permissions as Prisma.InputJsonValue,
        invitationStatus: "ACCEPTED",
        invitationAcceptedAt: now,
        isActive: true,
      },
      include: { user: true },
    });

    return membership;
  });
}
