import { requireMutatingRequest, requireStandardUser } from "@/lib/api-guard";
import {
  createCustomerSession,
  isCustomerProfileComplete,
  markCustomerProfileFinalized,
} from "@/lib/customer-onboarding";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { customerFinalizeSchema, zodErrorMessage } from "@/lib/validation";
import { writeAudit } from "@/lib/audit";

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;

  const auth = await requireStandardUser(req);
  if (auth.error || !auth.user) return auth.error;

  const body = await readJson<unknown>(req);
  const parsed = customerFinalizeSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(zodErrorMessage(parsed.error));
  }

  if (!auth.user.emailConfirmedAt) {
    return jsonError("Confirmez d'abord votre adresse e-mail via le lien reçu.", 409);
  }

  if (!auth.user.phoneVerified) {
    return jsonError("Vérifiez votre numéro de téléphone avant de finaliser.", 409);
  }

  const updated = await prisma.user.update({
    where: { id: auth.user.id },
    data: {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      city: parsed.data.city,
      addressLine1: parsed.data.addressLine1 || null,
      addressLine2: parsed.data.addressLine2 || null,
      postalCode: parsed.data.postalCode || null,
      country: parsed.data.country || auth.user.country || "FR",
    },
  });

  await markCustomerProfileFinalized(updated.id);
  await createCustomerSession(updated.id, { ip: clientIp(req), userAgent: userAgent(req) });
  await writeAudit({
    actorId: updated.id,
    action: "CUSTOMER_PROFILE_FINALIZED",
    ip: clientIp(req),
    userAgent: userAgent(req),
  });

  if (!isCustomerProfileComplete(updated)) {
    return jsonError("Profil incomplet.", 409);
  }

  return jsonOk({ ok: true, redirectTo: "/carte" });
}
