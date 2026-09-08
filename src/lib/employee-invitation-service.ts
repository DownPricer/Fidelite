import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import {
  buildInvitationLink,
  createInvitationToken,
  hashInvitationToken,
  invitationExpiryDate,
  isInvitationExpired,
  INVITATION_ERROR,
} from "./employee-invitation";

export type InvitationLookup = {
  invitation: {
    id: string;
    expiresAt: Date;
    usedAt: Date | null;
    revokedAt: Date | null;
  };
  membership: {
    id: string;
    userId: string;
    merchantId: string;
    invitationStatus: string;
    isActive: boolean;
    inviteMessage: string | null;
    user: { firstName: string; lastName: string | null; email: string; isActive: boolean };
    merchant: { name: string; isActive: boolean };
  };
};

export async function revokeActiveInvitations(membershipId: string, tx: Prisma.TransactionClient = prisma) {
  await tx.employeeInvitation.updateMany({
    where: { membershipId, usedAt: null, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function createMembershipInvitation(membershipId: string, tx: Prisma.TransactionClient = prisma) {
  const token = createInvitationToken();
  const expiresAt = invitationExpiryDate();
  const invitation = await tx.employeeInvitation.create({
    data: {
      membershipId,
      tokenHash: hashInvitationToken(token),
      expiresAt,
    },
  });

  await tx.merchantMembership.update({
    where: { id: membershipId },
    data: {
      invitationStatus: "PENDING",
      invitedAt: new Date(),
      invitationExpiresAt: expiresAt,
      invitationTokenHash: invitation.tokenHash,
    },
  });

  return { token, expiresAt, invitationId: invitation.id };
}

export async function issueInvitation(membershipId: string) {
  return prisma.$transaction(async (tx) => {
    await revokeActiveInvitations(membershipId, tx);
    return createMembershipInvitation(membershipId, tx);
  });
}

export async function findInvitationByToken(token: string): Promise<InvitationLookup | null> {
  const tokenHash = hashInvitationToken(token);
  const invitation = await prisma.employeeInvitation.findUnique({
    where: { tokenHash },
    include: {
      membership: {
        include: {
          user: true,
          merchant: true,
        },
      },
    },
  });

  if (!invitation || invitation.membership.role !== "EMPLOYEE") return null;

  return {
    invitation: {
      id: invitation.id,
      expiresAt: invitation.expiresAt,
      usedAt: invitation.usedAt,
      revokedAt: invitation.revokedAt,
    },
    membership: {
      id: invitation.membership.id,
      userId: invitation.membership.userId,
      merchantId: invitation.membership.merchantId,
      invitationStatus: invitation.membership.invitationStatus,
      isActive: invitation.membership.isActive,
      inviteMessage: invitation.membership.inviteMessage,
      user: {
        firstName: invitation.membership.user.firstName,
        lastName: invitation.membership.user.lastName,
        email: invitation.membership.user.email,
        isActive: invitation.membership.user.isActive,
      },
      merchant: {
        name: invitation.membership.merchant.name,
        isActive: invitation.membership.merchant.isActive,
      },
    },
  };
}

export function validateInvitationLookup(lookup: InvitationLookup | null) {
  if (!lookup) return { ok: false as const, error: INVITATION_ERROR.invalid, status: 410 as const };
  if (lookup.invitation.revokedAt || lookup.membership.invitationStatus === "CANCELLED") {
    return { ok: false as const, error: INVITATION_ERROR.cancelled, status: 410 as const };
  }
  if (lookup.invitation.usedAt || lookup.membership.invitationStatus === "ACCEPTED") {
    return { ok: false as const, error: INVITATION_ERROR.invalid, status: 410 as const };
  }
  if (isInvitationExpired(lookup.invitation.expiresAt)) {
    return { ok: false as const, error: INVITATION_ERROR.expired, status: 410 as const };
  }
  if (!lookup.membership.user.isActive || !lookup.membership.isActive) {
    return { ok: false as const, error: "Ce compte employé n'est plus actif.", status: 403 as const };
  }
  if (!lookup.membership.merchant.isActive) {
    return { ok: false as const, error: "Ce commerce n'est plus actif.", status: 403 as const };
  }
  return { ok: true as const, lookup };
}

export async function acceptInvitationWithPassword(input: { token: string; password: string; passwordHash: string }) {
  const lookup = await findInvitationByToken(input.token);
  const validation = validateInvitationLookup(lookup);
  if (!validation.ok) return validation;

  const { invitation, membership } = validation.lookup;
  const now = new Date();

  await prisma.$transaction([
    prisma.user.update({
      where: { id: membership.userId },
      data: {
        passwordHash: input.passwordHash,
        mustChangePassword: false,
        isActive: true,
      },
    }),
    prisma.merchantMembership.update({
      where: { id: membership.id },
      data: {
        invitationStatus: "ACCEPTED",
        invitationAcceptedAt: now,
        invitationTokenHash: null,
        invitationExpiresAt: null,
        isActive: true,
      },
    }),
    prisma.employeeInvitation.update({
      where: { id: invitation.id },
      data: { usedAt: now },
    }),
    prisma.employeeInvitation.updateMany({
      where: {
        membershipId: membership.id,
        id: { not: invitation.id },
        usedAt: null,
        revokedAt: null,
      },
      data: { revokedAt: now },
    }),
  ]);

  return { ok: true as const, membershipId: membership.id, merchantId: membership.merchantId, userId: membership.userId };
}

export function invitationPublicUrl(token: string) {
  return buildInvitationLink(token);
}
