import { randomBytes } from "crypto";
import { requireMerchantAdmin, requireMutatingRequest } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { presetPermissions, presetLabel, resolvePermissions, statusLabel } from "@/lib/staff-permissions";
import { updateEmployeeSchema, zodErrorMessage } from "@/lib/validation";

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

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const { id } = await context.params;
  const membership = await prisma.merchantMembership.findFirst({
    where: { id, merchantId: staff.membership.merchantId, role: "EMPLOYEE" },
    include: { user: true },
  });
  if (!membership) return jsonError("Employé introuvable.", 404);

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [scansToday, earns, redeems, corrections] = await Promise.all([
    prisma.caisseGrant.count({
      where: { actorUserId: membership.userId, merchantId: staff.membership.merchantId, createdAt: { gte: startOfDay } },
    }),
    prisma.loyaltyTransaction.count({
      where: { performedByUserId: membership.userId, merchantId: staff.membership.merchantId, type: "EARN_VISIT" },
    }),
    prisma.loyaltyTransaction.count({
      where: { performedByUserId: membership.userId, merchantId: staff.membership.merchantId, type: "REDEEM_REWARD" },
    }),
    prisma.loyaltyTransaction.count({
      where: {
        performedByUserId: membership.userId,
        merchantId: staff.membership.merchantId,
        type: { in: ["ADJUSTMENT", "CANCEL"] },
      },
    }),
  ]);

  return jsonOk({
    employee: mapEmployee(membership),
    stats: { scansToday, earns, redeems, corrections },
  });
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const { id } = await context.params;
  const parsed = updateEmployeeSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const membership = await prisma.merchantMembership.findFirst({
    where: { id, merchantId: staff.membership.merchantId, role: "EMPLOYEE" },
    include: { user: true },
  });
  if (!membership) return jsonError("Employé introuvable.", 404);

  if (parsed.data.email && parsed.data.email !== membership.user.email) {
    const clash = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (clash) return jsonError("Cet e-mail est déjà utilisé.", 409);
  }

  const preset = parsed.data.staffPreset ?? membership.staffPreset;
  const permissions =
    parsed.data.permissions ??
    (parsed.data.staffPreset ? presetPermissions(parsed.data.staffPreset) : undefined);

  await prisma.user.update({
    where: { id: membership.userId },
    data: {
      ...(parsed.data.firstName ? { firstName: parsed.data.firstName } : {}),
      ...(parsed.data.lastName !== undefined ? { lastName: parsed.data.lastName || null } : {}),
      ...(parsed.data.email ? { email: parsed.data.email } : {}),
      ...(parsed.data.phone !== undefined ? { phone: parsed.data.phone || null } : {}),
      ...(parsed.data.isActive === false ? { isActive: false } : parsed.data.isActive === true ? { isActive: true } : {}),
    },
  });

  const updated = await prisma.merchantMembership.update({
    where: { id: membership.id },
    data: {
      ...(parsed.data.isActive !== undefined ? { isActive: parsed.data.isActive } : {}),
      ...(parsed.data.staffPreset ? { staffPreset: parsed.data.staffPreset } : {}),
      ...(permissions ? { permissions } : {}),
      ...(parsed.data.invitationStatus ? { invitationStatus: parsed.data.invitationStatus } : {}),
      ...(parsed.data.inviteMessage !== undefined ? { inviteMessage: parsed.data.inviteMessage } : {}),
      ...(parsed.data.invitationStatus === "PENDING" ? { invitedAt: new Date() } : {}),
    },
    include: { user: true },
  });

  await writeAudit({
    actorId: staff.user.id,
    merchantId: staff.membership.merchantId,
    action: parsed.data.isActive === false ? "EMPLOYEE_SUSPEND" : "EMPLOYEE_UPDATE",
    metadata: { employeeId: membership.id },
    ip: clientIp(req),
    userAgent: userAgent(req),
  });

  return jsonOk({ ok: true, employee: mapEmployee(updated) });
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const { id } = await context.params;
  const membership = await prisma.merchantMembership.findFirst({
    where: { id, merchantId: staff.membership.merchantId, role: "EMPLOYEE" },
  });
  if (!membership) return jsonError("Employé introuvable.", 404);

  await prisma.merchantMembership.update({
    where: { id: membership.id },
    data: { isActive: false, invitationStatus: "CANCELLED" },
  });

  await writeAudit({
    actorId: staff.user.id,
    merchantId: staff.membership.merchantId,
    action: "EMPLOYEE_REMOVE",
    metadata: { employeeId: membership.id },
    ip: clientIp(req),
    userAgent: userAgent(req),
  });

  return jsonOk({ ok: true });
}
