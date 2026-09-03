import { requireMutatingRequest, requireUser } from "@/lib/api-guard";
import {
  ensureCustomerPreferences,
  getProfileUser,
  serializePreferences,
  serializeProfile,
} from "@/lib/customer-profile";
import { jsonError, jsonOk, readJson } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { profileUpdateSchema, zodErrorMessage } from "@/lib/validation";

export async function GET(req: Request) {
  const auth = await requireUser(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Connexion requise.", 401);

  const user = await getProfileUser(auth.user.id);
  if (!user) return jsonError("Compte introuvable.", 404);

  const preferences = user.preferences ?? (await ensureCustomerPreferences(user.id));

  return jsonOk({
    profile: serializeProfile(user),
    preferences: serializePreferences(preferences),
  });
}

export async function PATCH(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const auth = await requireUser(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Connexion requise.", 401);

  const parsed = profileUpdateSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const data = parsed.data;
  const updated = await prisma.user.update({
    where: { id: auth.user.id },
    data: {
      ...(data.firstName !== undefined ? { firstName: data.firstName } : {}),
      ...(data.lastName !== undefined ? { lastName: data.lastName || null } : {}),
      ...(data.displayName !== undefined ? { displayName: data.displayName || null } : {}),
      ...(data.phone !== undefined ? { phone: data.phone || null, phoneVerified: false } : {}),
      ...(data.phoneCountryCode !== undefined ? { phoneCountryCode: data.phoneCountryCode || "+33" } : {}),
      ...(data.addressLine1 !== undefined ? { addressLine1: data.addressLine1 || null } : {}),
      ...(data.addressLine2 !== undefined ? { addressLine2: data.addressLine2 || null } : {}),
      ...(data.postalCode !== undefined ? { postalCode: data.postalCode || null } : {}),
      ...(data.city !== undefined ? { city: data.city || null } : {}),
      ...(data.country !== undefined ? { country: data.country || null } : {}),
    },
  });

  return jsonOk({ profile: serializeProfile(updated) });
}
