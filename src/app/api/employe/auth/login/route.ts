import { MerchantRole } from "@prisma/client";
import { requireMutatingRequest } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import { canEmployeeAccess } from "@/lib/employee-invitation";
import { createEmployeeSession } from "@/lib/employee-session";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { LIMITS, rateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { loginSchema, zodErrorMessage } from "@/lib/validation";

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;

  const parsed = loginSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const ip = clientIp(req);
  const limited = rateLimit(
    `employe-login:${ip}:${parsed.data.email}`,
    LIMITS.login.limit,
    LIMITS.login.windowMs,
  );
  if (!limited.ok) return jsonError("Trop de tentatives. Réessayez plus tard.", 429);

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    include: {
      merchantMemberships: {
        where: { role: MerchantRole.EMPLOYEE, isActive: true },
        include: { merchant: true },
      },
    },
  });

  const valid = user ? await verifyPassword(parsed.data.password, user.passwordHash) : false;
  if (!user || !valid) {
    return jsonError("Identifiants incorrects.", 401);
  }

  const membership = user.merchantMemberships.find((item) =>
    canEmployeeAccess({
      userActive: user.isActive,
      membershipActive: item.isActive,
      invitationStatus: item.invitationStatus,
      merchantActive: item.merchant.isActive,
    }),
  );

  if (!membership) {
    if (!user.isActive) {
      return jsonError("Compte suspendu. Contactez votre responsable.", 403);
    }
    const pending = user.merchantMemberships.find((item) => item.invitationStatus === "PENDING");
    if (pending) {
      return jsonError("Invitation en attente. Acceptez votre invitation pour vous connecter.", 403);
    }
    return jsonError("Accès employé refusé.", 403);
  }

  await prisma.session.deleteMany({ where: { userId: user.id, kind: "EMPLOYEE" } });
  await createEmployeeSession(
    { userId: user.id, merchantMembershipId: membership.id },
    { ip, userAgent: userAgent(req) },
  );

  await writeAudit({
    actorId: user.id,
    merchantId: membership.merchantId,
    action: "EMPLOYEE_LOGIN",
    ip,
    userAgent: userAgent(req),
  });

  return jsonOk({
    ok: true,
    user: {
      id: user.id,
      firstName: user.firstName,
      merchantName: membership.merchant.name,
    },
  });
}
