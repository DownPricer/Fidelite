import { hashInvitationToken, INVITATION_ERROR, isInvitationExpired } from "@/lib/employee-invitation";
import { jsonError, jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { invitationTokenQuerySchema, zodErrorMessage } from "@/lib/validation";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = invitationTokenQuerySchema.safeParse({ token: url.searchParams.get("token") ?? "" });
  if (!parsed.success) return jsonError(INVITATION_ERROR.invalid, 400);

  const membership = await prisma.merchantMembership.findFirst({
    where: {
      invitationTokenHash: hashInvitationToken(parsed.data.token),
      role: "EMPLOYEE",
    },
    include: {
      user: { select: { firstName: true, email: true } },
      merchant: { select: { name: true } },
    },
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

  return jsonOk({
    ok: true,
    invitation: {
      firstName: membership.user.firstName,
      email: membership.user.email,
      merchantName: membership.merchant.name,
      message: membership.inviteMessage,
      expiresAt: membership.invitationExpiresAt,
    },
  });
}

export async function POST(req: Request) {
  return jsonError("Utilisez POST /api/employe/auth/accept-invitation.", 405);
}
