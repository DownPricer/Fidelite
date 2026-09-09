import { requireMutatingRequest, requireSuperAdmin, requireSuperAdminReauth } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { syncIsActiveFromStatus } from "@/lib/merchant-status";
import { prisma } from "@/lib/prisma";
import { merchantDeleteSchema, merchantStatusActionSchema, zodErrorMessage } from "@/lib/super-admin-validation";
import { SessionKind } from "@prisma/client";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const admin = await requireSuperAdmin(req);
  if (admin.error) return admin.error;
  const { id } = await context.params;

  const merchant = await prisma.merchant.findUnique({
    where: { id },
    include: {
      program: { include: { rewards: { orderBy: { sortOrder: "asc" } } } },
      subscription: true,
      contracts: { orderBy: { createdAt: "desc" } },
      payments: { orderBy: { createdAt: "desc" }, take: 20 },
      memberships: { include: { user: true } },
      cardTemplates: { orderBy: { updatedAt: "desc" } },
      _count: {
        select: {
          customerMemberships: true,
          transactions: true,
          caisseGrants: true,
          auditLogs: true,
        },
      },
    },
  });
  if (!merchant) return jsonError("Commerce introuvable.", 404);

  const recentAudit = await prisma.auditLog.findMany({
    where: { merchantId: id },
    orderBy: { createdAt: "desc" },
    take: 30,
    include: { actor: { select: { firstName: true, email: true } } },
  });

  return jsonOk({
    merchant,
    stats: {
      customers: merchant._count.customerMemberships,
      transactions: merchant._count.transactions,
      scans: merchant._count.caisseGrants,
      auditEntries: merchant._count.auditLogs,
    },
    recentAudit,
  });
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const admin = await requireSuperAdmin(req);
  if (admin.error || !admin.user) return admin.error ?? jsonError("Accès refusé.", 403);
  const { id } = await context.params;

  const parsed = merchantStatusActionSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const reauth = await requireSuperAdminReauth(req, parsed.data.password);
  if (reauth.error) return reauth.error;

  const merchant = await prisma.merchant.findUnique({ where: { id } });
  if (!merchant) return jsonError("Commerce introuvable.", 404);

  let newStatus = merchant.status;
  switch (parsed.data.action) {
    case "suspend":
      newStatus = "SUSPENDED";
      break;
    case "reactivate":
      newStatus = "ACTIVE";
      break;
    case "archive":
      newStatus = "ARCHIVED";
      break;
    case "restore":
      newStatus = "ACTIVE";
      break;
  }

  await prisma.$transaction(async (tx) => {
    await tx.merchant.update({
      where: { id },
      data: {
        status: newStatus,
        isActive: syncIsActiveFromStatus(newStatus),
        visibleInSearch: newStatus === "ARCHIVED" ? false : merchant.visibleInSearch,
      },
    });

    if (newStatus === "SUSPENDED" || newStatus === "ARCHIVED") {
      const staffUserIds = (
        await tx.merchantMembership.findMany({
          where: { merchantId: id },
          select: { userId: true },
        })
      ).map((row) => row.userId);
      await tx.session.deleteMany({
        where: {
          userId: { in: staffUserIds },
          kind: { in: [SessionKind.STANDARD, SessionKind.EMPLOYEE] },
        },
      });
    }
  });

  await writeAudit({
    actorId: admin.user.id,
    merchantId: id,
    action: `MERCHANT_${parsed.data.action.toUpperCase()}`,
    metadata: { previousStatus: merchant.status, newStatus },
    ip: clientIp(req),
    userAgent: userAgent(req),
  });

  return jsonOk({ ok: true, status: newStatus });
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const admin = await requireSuperAdmin(req);
  if (admin.error || !admin.user) return admin.error ?? jsonError("Accès refusé.", 403);
  const { id } = await context.params;

  const parsed = merchantDeleteSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const reauth = await requireSuperAdminReauth(req, parsed.data.password);
  if (reauth.error) return reauth.error;

  const merchant = await prisma.merchant.findUnique({
    where: { id },
    include: {
      _count: { select: { customerMemberships: true, transactions: true } },
      subscription: true,
      contracts: true,
    },
  });
  if (!merchant) return jsonError("Commerce introuvable.", 404);
  if (parsed.data.confirmationName.trim() !== merchant.name) {
    return jsonError("Le nom de confirmation ne correspond pas.", 400);
  }

  await prisma.merchant.update({
    where: { id },
    data: { status: "ARCHIVED", isActive: false, visibleInSearch: false },
  });

  await writeAudit({
    actorId: admin.user.id,
    merchantId: id,
    action: "MERCHANT_DELETE_REQUESTED",
    metadata: {
      customers: merchant._count.customerMemberships,
      transactions: merchant._count.transactions,
      note: "Archivage privilégié — suppression définitive non automatique.",
    },
    ip: clientIp(req),
    userAgent: userAgent(req),
  });

  return jsonOk({
    ok: true,
    archived: true,
    message: "Le commerce a été archivé. Les données historiques sont conservées.",
  });
}
