import { MerchantRole } from "@prisma/client";
import { CsrfError, assertSameOrigin } from "./csrf";
import { jsonError } from "./http";
import { canOpenCaisse, firstActiveStaffMembership, isSuperAdmin } from "./rbac";
import { getRequestUser, type SessionUser } from "./session";

export async function requireMutatingRequest(req: Request) {
  try {
    assertSameOrigin(req);
  } catch (error) {
    if (error instanceof CsrfError) {
      return { error: jsonError("Requête refusée.", 403) };
    }
    throw error;
  }
  return { error: null };
}

export async function requireUser(req: Request) {
  const user = await getRequestUser(req);
  if (!user) {
    return { error: jsonError("Connexion requise.", 401), user: null };
  }
  return { error: null, user };
}

export async function requireSuperAdmin(req: Request) {
  const auth = await requireUser(req);
  if (auth.error || !auth.user) return { error: auth.error ?? jsonError("Connexion requise.", 401), user: null };
  if (!isSuperAdmin(auth.user.platformRole)) {
    return { error: jsonError("Accès refusé.", 403), user: null };
  }
  return { error: null, user: auth.user };
}

export function staffContext(user: SessionUser, merchantId?: string) {
  const membership = merchantId
    ? user.merchantMemberships.find((item) => item.merchantId === merchantId && item.isActive)
    : firstActiveStaffMembership(user.merchantMemberships);
  if (!membership || !membership.merchant.isActive) {
    return null;
  }
  return membership;
}

export async function requireCaisse(req: Request, merchantId?: string) {
  const auth = await requireUser(req);
  if (auth.error || !auth.user) return { error: auth.error ?? jsonError("Connexion requise.", 401) };
  const membership = staffContext(auth.user, merchantId);
  if (!membership || !canOpenCaisse(membership)) {
    return { error: jsonError("Accès caisse refusé.", 403) };
  }
  return { error: null, user: auth.user, membership };
}

export async function requireMerchantAdmin(req: Request, merchantId?: string) {
  const auth = await requireUser(req);
  if (auth.error || !auth.user) return { error: auth.error ?? jsonError("Connexion requise.", 401) };
  const membership = staffContext(auth.user, merchantId);
  if (!membership || membership.role !== MerchantRole.MERCHANT_ADMIN) {
    return { error: jsonError("Accès administrateur commerçant requis.", 403) };
  }
  return { error: null, user: auth.user, membership };
}
