import { requireMutatingRequest, requireUser } from "@/lib/api-guard";
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
  const updated = await prisma.customerPreferences.update({
    where: { userId: auth.user.id },
    data: parsed.data,
  });

  return jsonOk({ preferences: serializePreferences(updated) });
}
