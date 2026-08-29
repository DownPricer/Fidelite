import { requireMutatingRequest, requireSuperAdmin } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { updateMerchantSchema, zodErrorMessage } from "@/lib/validation";

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
      program: true,
      memberships: { include: { user: true } },
    },
  });
  if (!merchant) return jsonError("Commerce introuvable.", 404);

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const [customers, visits, rewards, visitsToday] = await Promise.all([
    prisma.customerMembership.count({ where: { merchantId: id } }),
    prisma.loyaltyTransaction.count({ where: { merchantId: id, type: "EARN_VISIT" } }),
    prisma.loyaltyTransaction.count({ where: { merchantId: id, type: "REDEEM_REWARD" } }),
    prisma.loyaltyTransaction.count({
      where: { merchantId: id, type: "EARN_VISIT", createdAt: { gte: startOfDay } },
    }),
  ]);

  return jsonOk({
    merchant: {
      id: merchant.id,
      name: merchant.name,
      slug: merchant.slug,
      logoUrl: merchant.logoUrl,
      primaryColor: merchant.primaryColor,
      isActive: merchant.isActive,
      visitsRequired: merchant.program?.visitsRequired,
      rewardLabel: merchant.program?.rewardLabel,
    },
    stats: { customers, visits, rewards, visitsToday },
    staff: merchant.memberships.map((item) => ({
      role: item.role,
      firstName: item.user.firstName,
      email: item.user.email,
      isActive: item.isActive,
    })),
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
  const parsed = updateMerchantSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const merchant = await prisma.merchant.findUnique({ where: { id } });
  if (!merchant) return jsonError("Commerce introuvable.", 404);

  await prisma.merchant.update({
    where: { id },
    data: {
      name: parsed.data.name,
      logoUrl: parsed.data.logoUrl === undefined ? undefined : parsed.data.logoUrl || null,
      primaryColor: parsed.data.primaryColor,
      isActive: parsed.data.isActive,
    },
  });
  if (parsed.data.visitsRequired || parsed.data.rewardLabel) {
    await prisma.loyaltyProgram.update({
      where: { merchantId: id },
      data: {
        visitsRequired: parsed.data.visitsRequired,
        rewardLabel: parsed.data.rewardLabel,
      },
    });
  }

  await writeAudit({
    actorId: admin.user.id,
    merchantId: id,
    action: parsed.data.isActive === false ? "MERCHANT_DISABLE" : "MERCHANT_UPDATE",
    ip: clientIp(req),
    userAgent: userAgent(req),
  });

  return jsonOk({ ok: true });
}
