import { requireMerchantAdmin, requireMutatingRequest } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import { clientIp, jsonError, jsonOk, userAgent } from "@/lib/http";
import { generateTemporaryPassword, hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const { id } = await context.params;
  const membership = await prisma.merchantMembership.findFirst({
    where: {
      id,
      merchantId: staff.membership.merchantId,
      role: "EMPLOYEE",
    },
  });
  if (!membership) return jsonError("Employé introuvable.", 404);

  const temporary = generateTemporaryPassword();
  await prisma.user.update({
    where: { id: membership.userId },
    data: {
      passwordHash: await hashPassword(temporary),
      mustChangePassword: true,
    },
  });
  await prisma.session.deleteMany({ where: { userId: membership.userId } });
  await writeAudit({
    actorId: staff.user.id,
    merchantId: staff.membership.merchantId,
    action: "EMPLOYEE_PASSWORD_RESET",
    metadata: { employeeId: membership.id },
    ip: clientIp(req),
    userAgent: userAgent(req),
  });

  return jsonOk({ ok: true, temporaryPassword: temporary });
}
