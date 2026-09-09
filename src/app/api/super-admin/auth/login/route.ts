import { requireMutatingRequest } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { LIMITS, rateLimit } from "@/lib/rate-limit";
import { isSuperAdmin } from "@/lib/rbac";
import { assertSuperAdminProductionConfig, setSuperAdminEntryCookie } from "@/lib/super-admin-entry";
import {
  createSuperAdminSession,
  isSuperAdminEmailAllowed,
} from "@/lib/super-admin-session";
import { loginSchema, zodErrorMessage } from "@/lib/validation";

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;

  const parsed = loginSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const configError = assertSuperAdminProductionConfig();
  if (configError) return jsonError(configError, 503);

  const ip = clientIp(req);
  const limited = rateLimit(
    `super-admin-login:${ip}:${parsed.data.email}`,
    LIMITS.superAdminLogin.limit,
    LIMITS.superAdminLogin.windowMs,
  );
  if (!limited.ok) return jsonError("Trop de tentatives. Réessayez plus tard.", 429);

  const email = parsed.data.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  const valid = user ? await verifyPassword(parsed.data.password, user.passwordHash) : false;

  if (!user || !valid || !user.isActive || !isSuperAdmin(user.platformRole)) {
    await writeAudit({
      actorId: user?.id,
      action: "SUPER_ADMIN_LOGIN_FAILED",
      metadata: { email },
      ip,
      userAgent: userAgent(req),
    });
    return jsonError("Identifiants incorrects.", 401);
  }

  if (!isSuperAdminEmailAllowed(email)) {
    await writeAudit({
      actorId: user.id,
      action: "SUPER_ADMIN_LOGIN_DENIED",
      metadata: { reason: "email_not_allowed" },
      ip,
      userAgent: userAgent(req),
    });
    return jsonError("Accès refusé.", 403);
  }

  await createSuperAdminSession(user.id, { ip, userAgent: userAgent(req) });
  await writeAudit({
    actorId: user.id,
    action: "SUPER_ADMIN_LOGIN",
    ip,
    userAgent: userAgent(req),
  });

  const response = jsonOk({
    ok: true,
    user: { id: user.id, firstName: user.firstName, email: user.email },
  });
  const entry = setSuperAdminEntryCookie();
  response.cookies.set(entry.name, entry.value, entry.options);
  return response;
}
