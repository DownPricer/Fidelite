import { requireMutatingRequest } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import {
  hashInvitationToken,
  INVITATION_ERROR,
  isInvitationExpired,
} from "@/lib/employee-invitation";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { acceptInvitationSchema, zodErrorMessage } from "@/lib/validation";

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;

  const parsed = acceptInvitationSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const tokenHash = hashInvitationToken(parsed.data.token);
  const membership = await prisma.merchantMembership.findFirst({
    where: { invitationTokenHash: tokenHash, role: "EMPLOYEE" },
    include: { user: true, merchant: true },
  });

  if (!membership || membership.invitationStatus === "CANCELLED") {
    return jsonError(INVITATION_ERROR.cancelled, 410);
  }
  if (membership.invitationStatus === "ACCEPTED") {
    return jsonError(INVITATION_ERROR.invalid, 410);
  }
  if (isInvitationExpired(membership.invitationExpiresAt)) {
    return jsonError(INVITATION_ERROR.expired, 410);
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: membership.userId },
      data: {
        passwordHash: await hashPassword(parsed.data.password),
        mustChangePassword: false,
        isActive: true,
      },
    }),
    prisma.merchantMembership.update({
      where: { id: membership.id },
      data: {
        invitationStatus: "ACCEPTED",
        invitationAcceptedAt: new Date(),
        invitationTokenHash: null,
        invitationExpiresAt: null,
        isActive: true,
      },
    }),
  ]);

  await writeAudit({
    actorId: membership.userId,
    merchantId: membership.merchantId,
    action: "EMPLOYEE_INVITATION_ACCEPTED",
    metadata: { membershipId: membership.id },
    ip: clientIp(req),
    userAgent: userAgent(req),
  });

  return jsonOk({
    ok: true,
    loginPath: "/employe/connexion",
  });
}

export async function GET() {
  return jsonError("Méthode non autorisée.", 405);
}
