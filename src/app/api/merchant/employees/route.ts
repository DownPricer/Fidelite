import { requireMerchantAdmin, requireMutatingRequest } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { MAX_ACTIVE_EMPLOYEES, assertCanAddEmployee } from "@/lib/rbac";
import { createEmployeeSchema, zodErrorMessage } from "@/lib/validation";

export async function GET(req: Request) {
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const employees = await prisma.merchantMembership.findMany({
    where: { merchantId: staff.membership.merchantId, role: "EMPLOYEE" },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });

  return jsonOk({
    max: MAX_ACTIVE_EMPLOYEES,
    employees: employees.map((item) => ({
      id: item.id,
      userId: item.userId,
      firstName: item.user.firstName,
      lastName: item.user.lastName,
      email: item.user.email,
      isActive: item.isActive && item.user.isActive,
    })),
  });
}

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const parsed = createEmployeeSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const activeCount = await prisma.merchantMembership.count({
    where: { merchantId: staff.membership.merchantId, role: "EMPLOYEE", isActive: true },
  });
  try {
    assertCanAddEmployee(activeCount);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Limite atteinte.");
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return jsonError("Impossible de créer cet employé.", 409);
  }

  const user = await prisma.user.create({
    data: {
      email: parsed.data.email,
      passwordHash: await hashPassword(parsed.data.password),
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      privacyConsentAt: new Date(),
    },
  });

  const membership = await prisma.merchantMembership.create({
    data: {
      userId: user.id,
      merchantId: staff.membership.merchantId,
      role: "EMPLOYEE",
    },
  });

  await writeAudit({
    actorId: staff.user.id,
    merchantId: staff.membership.merchantId,
    action: "EMPLOYEE_CREATE",
    metadata: { employeeId: membership.id },
    ip: clientIp(req),
    userAgent: userAgent(req),
  });

  return jsonOk({ ok: true, id: membership.id }, 201);
}
