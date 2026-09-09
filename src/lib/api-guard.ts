import { MerchantRole } from "@prisma/client";
import { CsrfError, assertSameOrigin } from "./csrf";
import { employeeTokenFromRequest, getRequestEmployee } from "./employee-session";
import { jsonError } from "./http";
import { canOpenCaisse, firstActiveStaffMembership, isSuperAdmin, staffHasPermission } from "./rbac";
import { getRequestSuperAdminUser } from "./super-admin-session";
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

export async function requireStandardUser(req: Request) {
  if (employeeTokenFromRequest(req)) {
    return { error: jsonError("Accès refusé.", 403), user: null };
  }
  return requireUser(req);
}

export async function requireSuperAdmin(req: Request) {
  const user = await getRequestSuperAdminUser(req);
  if (!user) {
    return { error: jsonError("Connexion super-admin requise.", 401), user: null };
  }
  if (!isSuperAdmin(user.platformRole)) {
    return { error: jsonError("Accès refusé.", 403), user: null };
  }
  return { error: null, user };
}

export async function requireSuperAdminReauth(req: Request, password: string) {
  const auth = await requireSuperAdmin(req);
  if (auth.error || !auth.user) return auth;
  const { verifyPassword } = await import("./password");
  const valid = await verifyPassword(password, auth.user.passwordHash);
  if (!valid) {
    return { error: jsonError("Mot de passe incorrect.", 401), user: null };
  }
  return auth;
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

export async function requireEmployee(req: Request) {
  const session = await getRequestEmployee(req);
  if (!session) {
    return { error: jsonError("Connexion employé requise.", 401) };
  }
  return {
    error: null,
    user: session.user,
    membership: session.membership,
    sessionId: session.sessionId,
  };
}

export async function requireCaisse(req: Request, merchantId?: string) {
  const employee = await getRequestEmployee(req);
  if (employee) {
    if (merchantId && employee.membership.merchantId !== merchantId) {
      return { error: jsonError("Accès caisse refusé.", 403) };
    }
    if (!canOpenCaisse(employee.membership)) {
      return { error: jsonError("Accès caisse refusé.", 403) };
    }
    return {
      error: null,
      user: employee.user,
      membership: employee.membership,
      isEmployeeSession: true as const,
    };
  }

  const auth = await requireStandardUser(req);
  if (auth.error || !auth.user) return { error: auth.error ?? jsonError("Connexion requise.", 401) };
  const membership = staffContext(auth.user, merchantId);
  if (!membership || !canOpenCaisse(membership)) {
    return { error: jsonError("Accès caisse refusé.", 403) };
  }
  return { error: null, user: auth.user, membership, isEmployeeSession: false as const };
}

export async function requireMerchantAdmin(req: Request, merchantId?: string) {
  if (employeeTokenFromRequest(req)) {
    return { error: jsonError("Accès administrateur commerçant requis.", 403) };
  }
  const auth = await requireUser(req);
  if (auth.error || !auth.user) return { error: auth.error ?? jsonError("Connexion requise.", 401) };
  const membership = staffContext(auth.user, merchantId);
  if (!membership || membership.role !== MerchantRole.MERCHANT_ADMIN) {
    return { error: jsonError("Accès administrateur commerçant requis.", 403) };
  }
  return { error: null, user: auth.user, membership };
}

export function requireCaissePermission(
  membership: Parameters<typeof staffHasPermission>[0],
  key: "addPoints" | "redeemReward",
) {
  if (!staffHasPermission(membership, key)) {
    return jsonError("Action non autorisée pour votre rôle.", 403);
  }
  return null;
}
