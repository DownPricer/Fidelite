import { requireMerchantAdmin, requireMutatingRequest } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import { canExposeInvitationLinkInAdmin, sendEmployeeInvitationEmail } from "@/lib/email";
import { invitationPublicUrl, issueInvitation } from "@/lib/employee-invitation-service";
import { revokeEmployeeSessions } from "@/lib/employee-session";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
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
    include: { user: true, merchant: true },
  });
  if (!membership) return jsonError("Employé introuvable.", 404);
  if (membership.invitationStatus === "CANCELLED") {
    return jsonError("Cet accès a été retiré.", 410);
  }

  if (parsed.data.email && parsed.data.email !== membership.user.email) {
    const clash = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (clash && clash.id !== membership.userId) return jsonError("Cet e-mail est déjà utilisé.", 409);
  }

  const preset = parsed.data.staffPreset ?? membership.staffPreset;
  const permissions =
    parsed.data.permissions ??
    (parsed.data.staffPreset ? presetPermissions(parsed.data.staffPreset) : undefined);

  const resendInvitation = parsed.data.invitationStatus === "PENDING";
  let invitationToken: string | null = null;
  let invitationExpiresAt: Date | null = null;

  if (resendInvitation) {
    const issued = await issueInvitation(membership.id);
    invitationToken = issued.token;
    invitationExpiresAt = issued.expiresAt;
  }

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
      ...(parsed.data.inviteMessage !== undefined ? { inviteMessage: parsed.data.inviteMessage } : {}),
    },
    include: { user: true },
  });

  if (parsed.data.isActive === false) {
    await revokeEmployeeSessions(membership.userId);
  }

  let auditAction = "EMPLOYEE_UPDATE";
  if (parsed.data.isActive === false) auditAction = "EMPLOYEE_SUSPEND";
  if (parsed.data.isActive === true && !membership.isActive) auditAction = "EMPLOYEE_REACTIVATE";

  await writeAudit({
    actorId: staff.user.id,
    merchantId: staff.membership.merchantId,
    action: auditAction,
    metadata: { employeeId: membership.id },
    ip: clientIp(req),
    userAgent: userAgent(req),
  });

  if (resendInvitation && invitationToken && invitationExpiresAt) {
    const invitationUrl = invitationPublicUrl(invitationToken);
    const emailResult = await sendEmployeeInvitationEmail({
      to: updated.user.email,
      firstName: updated.user.firstName,
      merchantName: membership.merchant.name,
      invitationUrl,
      expiresAt: invitationExpiresAt,
      message: updated.inviteMessage,
    });

    if (emailResult.ok) {
      await writeAudit({
        actorId: staff.user.id,
        merchantId: staff.membership.merchantId,
        action: "EMPLOYEE_INVITATION_RESENT",
        metadata: { employeeId: membership.id, email: updated.user.email },
        ip: clientIp(req),
        userAgent: userAgent(req),
      });
    } else {
      return jsonError(emailResult.error ?? "Impossible de renvoyer l'invitation.", 502, {
        employee: mapEmployee(updated),
        invitationSent: false,
        ...(canExposeInvitationLinkInAdmin() ? { invitationUrl } : {}),
      });
    }

    return jsonOk({
      ok: true,
      employee: mapEmployee(updated),
      invitationSent: true,
      ...(canExposeInvitationLinkInAdmin() ? { invitationUrl } : {}),
    });
  }

  return jsonOk({
    ok: true,
    employee: mapEmployee(updated),
  });
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

  await prisma.$transaction([
    prisma.merchantMembership.update({
      where: { id: membership.id },
      data: {
        isActive: false,
        invitationStatus: "CANCELLED",
        invitationTokenHash: null,
        invitationExpiresAt: null,
      },
    }),
    prisma.employeeInvitation.updateMany({
      where: { membershipId: membership.id, revokedAt: null, usedAt: null },
      data: { revokedAt: new Date() },
    }),
  ]);

  await revokeEmployeeSessions(membership.userId);

  await writeAudit({
    actorId: staff.user.id,
    merchantId: staff.membership.merchantId,
    action: membership.invitationStatus === "PENDING" ? "EMPLOYEE_INVITATION_CANCELLED" : "EMPLOYEE_REMOVE",
    metadata: { employeeId: membership.id },
    ip: clientIp(req),
    userAgent: userAgent(req),
  });

  return jsonOk({ ok: true });
}
