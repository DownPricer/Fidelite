import { requireMutatingRequest } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import { acceptInvitationWithPassword, findInvitationByToken, validateInvitationLookup } from "@/lib/employee-invitation-service";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { hashPassword } from "@/lib/password";
import { acceptInvitationSchema, zodErrorMessage } from "@/lib/validation";

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;

  const parsed = acceptInvitationSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const lookup = await findInvitationByToken(parsed.data.token);
  const validation = validateInvitationLookup(lookup);
  if (!validation.ok) return jsonError(validation.error, validation.status);

  const result = await acceptInvitationWithPassword({
    token: parsed.data.token,
    password: parsed.data.password,
    passwordHash: await hashPassword(parsed.data.password),
  });

  if (!result.ok) return jsonError(result.error, result.status);

  await writeAudit({
    actorId: result.userId,
    merchantId: result.merchantId,
    action: "EMPLOYEE_INVITATION_ACCEPTED",
    metadata: { membershipId: result.membershipId },
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
