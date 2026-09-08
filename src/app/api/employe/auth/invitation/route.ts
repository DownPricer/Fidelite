import { findInvitationByToken, validateInvitationLookup } from "@/lib/employee-invitation-service";
import { jsonError, jsonOk } from "@/lib/http";
import { invitationTokenQuerySchema, zodErrorMessage } from "@/lib/validation";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = invitationTokenQuerySchema.safeParse({ token: url.searchParams.get("token") ?? "" });
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error), 400);

  const lookup = await findInvitationByToken(parsed.data.token);
  const validation = validateInvitationLookup(lookup);
  if (!validation.ok) return jsonError(validation.error, validation.status);

  return jsonOk({
    ok: true,
    invitation: {
      firstName: validation.lookup.membership.user.firstName,
      email: validation.lookup.membership.user.email,
      merchantName: validation.lookup.membership.merchant.name,
      message: validation.lookup.membership.inviteMessage,
      expiresAt: validation.lookup.invitation.expiresAt,
    },
  });
}

export async function POST() {
  return jsonError("Utilisez POST /api/employe/auth/accept-invitation.", 405);
}
