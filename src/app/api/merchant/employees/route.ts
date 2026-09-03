import { randomBytes } from "crypto";
import { requireMerchantAdmin, requireMutatingRequest } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { presetPermissions, presetLabel, resolvePermissions, statusLabel } from "@/lib/staff-permissions";
import { MAX_ACTIVE_EMPLOYEES, assertCanAddEmployee } from "@/lib/rbac";
import { createEmployeeSchema, zodErrorMessage } from "@/lib/validation";

function mapEmployee(item: {
  id: string;
  userId: string;
  role: "MERCHANT_ADMIN" | "EMPLOYEE";
  staffPreset: "MANAGER" | "CASHIER" | "CUSTOM";
  permissions: unknown;
  invitationStatus: string;
  invitedAt: Date | null;
  lastActivityAt: Date | null;
  isActive: boolean;
  createdAt: Date;
  user: { firstName: string; lastName: string | null; email: string; phone: string | null; isActive: boolean };
}) {
  return {
    id: item.id,
    userId: item.userId,
    firstName: item.user.firstName,
    lastName: item.user.lastName,
    email: item.user.email,
    phone: item.user.phone,
    roleLabel: presetLabel(item.staffPreset, item.role),
    staffPreset: item.staffPreset,
    permissions: resolvePermissions(item),
    invitationStatus: item.invitationStatus,
    invitedAt: item.invitedAt,
    lastActivityAt: item.lastActivityAt,
    joinedAt: item.createdAt,
    isActive: item.isActive && item.user.isActive,
    status: statusLabel({
      isActive: item.isActive,
      userActive: item.user.isActive,
      invitationStatus: item.invitationStatus,
    }),
  };
}

export async function GET(req: Request) {
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim().toLowerCase() ?? "";
  const filter = url.searchParams.get("filter") ?? "all";

  const employees = await prisma.merchantMembership.findMany({
    where: {
      merchantId: staff.membership.merchantId,
      role: "EMPLOYEE",
      ...(q
        ? {
            OR: [
              { user: { firstName: { contains: q, mode: "insensitive" } } },
              { user: { lastName: { contains: q, mode: "insensitive" } } },
              { user: { email: { contains: q, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });

  const mapped = employees.map(mapEmployee).filter((e) => {
    if (filter === "active") return e.status === "Actif";
    if (filter === "pending") return e.status === "Invitation en attente";
    if (filter === "suspended") return e.status === "Suspendu";
    return true;
  });

  return jsonOk({
    max: MAX_ACTIVE_EMPLOYEES,
    activeCount: employees.filter((e) => e.isActive && e.user.isActive).length,
    employees: mapped,
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
  if (existing) return jsonError("Un compte existe déjà avec cet e-mail.", 409);

  const tempPassword = parsed.data.password ?? randomBytes(5).toString("hex") + "Aa1!";
  const permissions = parsed.data.permissions ?? presetPermissions(parsed.data.staffPreset);

  const user = await prisma.user.create({
    data: {
      email: parsed.data.email,
      passwordHash: await hashPassword(tempPassword),
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      phone: parsed.data.phone || null,
      mustChangePassword: true,
      privacyConsentAt: new Date(),
    },
  });

  const membership = await prisma.merchantMembership.create({
    data: {
      userId: user.id,
      merchantId: staff.membership.merchantId,
      role: "EMPLOYEE",
      staffPreset: parsed.data.staffPreset,
      permissions,
      invitationStatus: "PENDING",
      invitedAt: new Date(),
      inviteMessage: parsed.data.inviteMessage,
    },
    include: { user: true },
  });

  await writeAudit({
    actorId: staff.user.id,
    merchantId: staff.membership.merchantId,
    action: "EMPLOYEE_CREATE",
    metadata: { employeeId: membership.id, email: user.email },
    ip: clientIp(req),
    userAgent: userAgent(req),
  });

  return jsonOk(
    {
      ok: true,
      employee: mapEmployee(membership),
      temporaryPassword: parsed.data.password ? undefined : tempPassword,
      invitationSent: true,
    },
    201,
  );
}
