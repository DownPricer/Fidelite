import type { LoyaltyMode, MerchantStatus, Prisma, SubscriptionPlan } from "@prisma/client";
import { requireMutatingRequest, requireSuperAdmin } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import { createMerchantFull } from "@/lib/merchant-create-service";
import { normalizeToMrr } from "@/lib/billing-stats";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { createMerchantFullSchema, zodErrorMessage } from "@/lib/super-admin-validation";

export async function GET(req: Request) {
  const admin = await requireSuperAdmin(req);
  if (admin.error) return admin.error;

  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim() ?? "";
  const status = url.searchParams.get("status") as MerchantStatus | null;
  const plan = url.searchParams.get("plan") as SubscriptionPlan | null;
  const loyaltyMode = url.searchParams.get("loyaltyMode") as LoyaltyMode | null;
  const sort = url.searchParams.get("sort") ?? "createdAt";
  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
  const pageSize = Math.min(50, Math.max(10, Number(url.searchParams.get("pageSize") ?? 20)));

  const where: Prisma.MerchantWhereInput = {};
  if (status) where.status = status;
  if (plan) where.subscription = { plan };
  if (loyaltyMode) where.program = { mode: loyaltyMode };
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
      { legalName: { contains: q, mode: "insensitive" } },
      { publicEmail: { contains: q, mode: "insensitive" } },
      { publicPhone: { contains: q, mode: "insensitive" } },
      { ownerName: { contains: q, mode: "insensitive" } },
      { adminEmail: { contains: q, mode: "insensitive" } },
    ];
  }

  const orderBy: Prisma.MerchantOrderByWithRelationInput =
    sort === "activity"
      ? { transactions: { _count: "desc" } }
      : sort === "customers"
        ? { customerMemberships: { _count: "desc" } }
        : { createdAt: "desc" };

  const [total, merchants] = await Promise.all([
    prisma.merchant.count({ where }),
    prisma.merchant.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        program: { select: { mode: true, rewardLabel: true, visitsRequired: true } },
        subscription: true,
        _count: {
          select: {
            customerMemberships: true,
            transactions: true,
            caisseGrants: true,
          },
        },
      },
    }),
  ]);

  const lastActivity = await prisma.loyaltyTransaction.groupBy({
    by: ["merchantId"],
    where: { merchantId: { in: merchants.map((m) => m.id) } },
    _max: { createdAt: true },
  });
  const activityMap = new Map(lastActivity.map((row) => [row.merchantId, row._max.createdAt]));

  return jsonOk({
    merchants: merchants.map((m) => ({
      id: m.id,
      name: m.name,
      legalName: m.legalName,
      slug: m.slug,
      logoUrl: m.logoUrl,
      primaryColor: m.primaryColor,
      status: m.status,
      isActive: m.isActive,
      ownerName: m.ownerName,
      loyaltyMode: m.program?.mode ?? null,
      plan: m.subscription?.plan ?? null,
      customers: m._count.customerMemberships,
      scans: m._count.caisseGrants,
      transactions: m._count.transactions,
      lastActivityAt: activityMap.get(m.id)?.toISOString() ?? null,
      monthlyContractual:
        m.subscription ? normalizeToMrr(m.subscription.amount, m.subscription.frequency) : 0,
      createdAt: m.createdAt.toISOString(),
    })),
    pagination: { page, pageSize, total, pages: Math.ceil(total / pageSize) },
  });
}

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const admin = await requireSuperAdmin(req);
  if (admin.error || !admin.user) return admin.error ?? jsonError("Accès refusé.", 403);

  const parsed = createMerchantFullSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  try {
    const result = await createMerchantFull(parsed.data);
    await writeAudit({
      actorId: admin.user.id,
      merchantId: result.merchant.id,
      action: "MERCHANT_CREATE",
      metadata: { slug: result.merchant.slug, mode: parsed.data.program.mode },
      ip: clientIp(req),
      userAgent: userAgent(req),
    });
    return jsonOk({ ok: true, id: result.merchant.id }, 201);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "SLUG_TAKEN") return jsonError("Ce slug est déjà utilisé.", 409);
      if (error.message === "EMAIL_TAKEN") return jsonError("Cet e-mail administrateur est déjà utilisé.", 409);
    }
    throw error;
  }
}
