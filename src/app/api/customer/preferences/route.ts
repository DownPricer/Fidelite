import { requireMutatingRequest, requireUser } from "@/lib/api-guard";
import { CONSENT_POLICY_VERSION, extractConsentChanges, recordConsentEvents } from "@/lib/consent";
import { ensureCustomerPreferences, serializePreferences } from "@/lib/customer-profile";
import { jsonError, jsonOk, readJson } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { preferencesUpdateSchema, zodErrorMessage } from "@/lib/validation";

export async function GET(req: Request) {
  const auth = await requireUser(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Connexion requise.", 401);

  const prefs = await ensureCustomerPreferences(auth.user.id);
  return jsonOk({ preferences: serializePreferences(prefs) });
}

export async function PATCH(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const auth = await requireUser(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Connexion requise.", 401);

  const parsed = preferencesUpdateSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  await ensureCustomerPreferences(auth.user.id);
  const consentChanges = extractConsentChanges(parsed.data);
  const hasConsentChange = Object.keys(consentChanges).length > 0;

  const updated = await prisma.$transaction(async (tx) => {
    const next = await tx.customerPreferences.update({
      where: { userId: auth.user!.id },
      data: {
        ...parsed.data,
        ...(hasConsentChange
          ? { consentVersion: CONSENT_POLICY_VERSION, consentUpdatedAt: new Date() }
          : {}),
      },
    });
    await recordConsentEvents(tx, {
      userId: auth.user!.id,
      changes: consentChanges,
      source: "customer_preferences_page",
    });
    return next;
  });

  return jsonOk({ preferences: serializePreferences(updated) });
}
