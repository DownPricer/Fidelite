import { requireMerchantAdmin } from "@/lib/api-guard";
import { jsonError, jsonOk } from "@/lib/http";
import { loyaltyBalanceForMode } from "@/lib/loyalty-balance";
import { bucketKey, enumerateMonthKeys } from "@/lib/insight-period";
import { formatEurosFromCents } from "@/lib/money";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const { id } = await context.params;
  const url = new URL(req.url);
  const insightMonths = url.searchParams.get("insightPeriod") === "12" ? 12 : 6;

  const membership = await prisma.customerMembership.findFirst({
    where: { id, merchantId: staff.membership.merchantId },
    include: {
      user: true,
      merchant: { include: { program: { include: { rewards: true } } } },
      transactions: {
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { performedBy: true, reward: true },
      },
    },
  });
  if (!membership) return jsonError("Client introuvable.", 404);
  if (!membership.merchant.program) return jsonError("Programme introuvable.", 404);

  const activeBalance = loyaltyBalanceForMode(membership, membership.merchant.program.mode);

  const [subscription, lifetimeVisitAgg, lifetimeRewardsCount, lastTx, insightWindowTx] = await Promise.all([
    prisma.merchantSubscription.findUnique({
      where: { merchantId: staff.membership.merchantId },
      select: { insightEnabled: true },
    }),
    prisma.loyaltyTransaction.aggregate({
      where: { customerMembershipId: membership.id, status: "COMPLETED", type: "EARN_VISIT" },
      _count: { _all: true },
      _min: { createdAt: true },
      _max: { createdAt: true },
    }),
    prisma.loyaltyTransaction.count({
      where: { customerMembershipId: membership.id, status: "COMPLETED", type: "REDEEM_REWARD" },
    }),
    prisma.loyaltyTransaction.findFirst({
      where: { customerMembershipId: membership.id },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }),
    prisma.loyaltyTransaction.findMany({
      where: {
        customerMembershipId: membership.id,
        status: "COMPLETED",
        createdAt: { gte: new Date(Date.now() - insightMonths * 31 * 86_400_000) },
      },
      select: { type: true, createdAt: true, purchaseAmountCents: true },
    }),
  ]);

  const insightEnabled = subscription?.insightEnabled ?? false;

  const now = new Date();
  const monthKeys = enumerateMonthKeys(new Date(now.getTime() - (insightMonths - 1) * 31 * 86_400_000), now);
  const visitsByMonth = new Map<string, number>();
  let trackedSpendCents = 0;
  const basketAmounts: number[] = [];
  for (const tx of insightWindowTx) {
    if (tx.type === "EARN_VISIT") {
      const key = bucketKey(tx.createdAt, "month");
      visitsByMonth.set(key, (visitsByMonth.get(key) ?? 0) + 1);
    }
    if (tx.purchaseAmountCents) {
      trackedSpendCents += tx.purchaseAmountCents;
      basketAmounts.push(tx.purchaseAmountCents);
    }
  }
  const avgBasketCents = basketAmounts.length
    ? Math.round(basketAmounts.reduce((a, b) => a + b, 0) / basketAmounts.length)
    : null;

  const visitCount = lifetimeVisitAgg._count._all;
  const avgVisitFrequencyDays =
    visitCount >= 2 && lifetimeVisitAgg._min.createdAt && lifetimeVisitAgg._max.createdAt
      ? (lifetimeVisitAgg._max.createdAt.getTime() - lifetimeVisitAgg._min.createdAt.getTime()) /
        86_400_000 /
        (visitCount - 1)
      : null;

  return jsonOk({
    customer: {
      id: membership.id,
      firstName: membership.user.firstName,
      lastName: membership.user.lastName,
      email: membership.user.email,
      phone: membership.user.phone,
      points: activeBalance,
      createdAt: membership.createdAt,
      program: membership.merchant.program,
      merchantName: membership.merchant.name,
    },
    stats: {
      visitsCount: visitCount,
      rewardsUsedCount: lifetimeRewardsCount,
      lastActivityAt: lastTx?.createdAt ?? null,
    },
    transactions: membership.transactions.map((tx) => ({
      id: tx.id,
      type: tx.type,
      status: tx.status,
      pointsDelta: tx.pointsDelta,
      purchaseAmount: tx.purchaseAmount,
      reason: tx.reason,
      rewardName: tx.reward?.name,
      actor: tx.performedBy.firstName,
      createdAt: tx.createdAt,
    })),
    insight: {
      enabled: insightEnabled,
      periodMonths: insightMonths,
      series: monthKeys.map((key) => ({ date: key, value: visitsByMonth.get(key) ?? 0 })),
      avgBasketCents,
      avgBasketLabel: avgBasketCents !== null ? formatEurosFromCents(avgBasketCents) : null,
      trackedSpendCents,
      trackedSpendLabel: trackedSpendCents > 0 ? formatEurosFromCents(trackedSpendCents) : null,
      avgVisitFrequencyDays,
    },
  });
}
