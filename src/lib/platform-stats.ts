import type { LoyaltyMode, LoyaltyTxType, MerchantStatus } from "@prisma/client";
import { prisma } from "./prisma";
import { buildBillingSummary } from "./billing-stats";

export type PeriodKey = "7d" | "30d" | "90d" | "12m";

export function periodToRange(period: PeriodKey, now = new Date()) {
  const end = now;
  const start = new Date(now);
  switch (period) {
    case "7d":
      start.setDate(start.getDate() - 7);
      break;
    case "30d":
      start.setDate(start.getDate() - 30);
      break;
    case "90d":
      start.setDate(start.getDate() - 90);
      break;
    case "12m":
      start.setMonth(start.getMonth() - 12);
      break;
  }
  return { start, end };
}

export function previousPeriodRange(period: PeriodKey, now = new Date()) {
  const current = periodToRange(period, now);
  const duration = current.end.getTime() - current.start.getTime();
  return {
    start: new Date(current.start.getTime() - duration),
    end: new Date(current.start.getTime()),
  };
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function fillDailySeries(start: Date, end: Date, values: Map<string, number>) {
  const series: { date: string; value: number }[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    const key = dateKey(cursor);
    series.push({ date: key, value: values.get(key) ?? 0 });
    cursor.setDate(cursor.getDate() + 1);
  }
  return series;
}

export async function getPlatformOverview() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    merchantsByStatus,
    newMerchants30d,
    totalCustomers,
    activeCustomers30dCount,
    activeCardTemplates,
    activeEmployees,
    scans,
    loyaltyTx,
    pointsDistributed,
    pointsUsed,
    pointsExpired,
    passagesGranted,
    rewardsUnlocked,
    rewardsUsed,
    subscriptions,
    payments,
  ] = await Promise.all([
    prisma.merchant.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.merchant.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.customerMembership.count(),
    prisma.loyaltyTransaction
      .groupBy({
        by: ["customerMembershipId"],
        where: { createdAt: { gte: thirtyDaysAgo } },
      })
      .then((rows) => rows.length),
    prisma.merchantCardTemplate.count({ where: { status: "PUBLISHED" } }),
    prisma.merchantMembership.count({ where: { isActive: true, role: { in: ["EMPLOYEE", "MERCHANT_ADMIN"] } } }),
    prisma.caisseGrant.count(),
    prisma.loyaltyTransaction.count(),
    prisma.loyaltyTransaction.aggregate({
      where: { pointsDelta: { gt: 0 } },
      _sum: { pointsDelta: true },
    }),
    prisma.loyaltyTransaction.aggregate({
      where: { type: "REDEEM_REWARD" },
      _sum: { pointsDelta: true },
    }),
    prisma.loyaltyTransaction.count({ where: { type: "CANCEL" } }),
    prisma.loyaltyTransaction.count({ where: { type: "EARN_VISIT", pointsDelta: { gt: 0 } } }),
    prisma.loyaltyTransaction.count({
      where: { type: "REDEEM_REWARD", metadata: { path: ["unlocked"], equals: true } },
    }),
    prisma.loyaltyTransaction.count({ where: { type: "REDEEM_REWARD" } }),
    prisma.merchantSubscription.findMany(),
    prisma.merchantPayment.findMany(),
  ]);

  const statusCounts = Object.fromEntries(
    merchantsByStatus.map((row) => [row.status, row._count._all]),
  ) as Record<MerchantStatus, number>;

  const billing = buildBillingSummary({ subscriptions, payments, now });

  return {
    merchants: {
      total: Object.values(statusCounts).reduce((a, b) => a + b, 0),
      active: statusCounts.ACTIVE ?? 0,
      trial: statusCounts.TRIAL ?? 0,
      suspended: statusCounts.SUSPENDED ?? 0,
      archived: statusCounts.ARCHIVED ?? 0,
      draft: statusCounts.DRAFT ?? 0,
      new30d: newMerchants30d,
    },
    customers: {
      total: totalCustomers,
      active30d: activeCustomers30dCount,
    },
    cards: { publishedTemplates: activeCardTemplates },
    employees: { active: activeEmployees },
    activity: {
      scans,
      loyaltyTransactions: loyaltyTx,
      pointsDistributed: pointsDistributed._sum.pointsDelta ?? 0,
      pointsUsed: Math.abs(pointsUsed._sum.pointsDelta ?? 0),
      pointsExpired,
      passagesGranted,
      rewardsUnlocked,
      rewardsUsed,
    },
    billing,
  };
}

export async function getPlatformTimeSeries(period: PeriodKey) {
  const { start, end } = periodToRange(period);
  const previous = previousPeriodRange(period);

  const [merchants, customers, scans, transactions, revenue] = await Promise.all([
    prisma.merchant.findMany({ where: { createdAt: { gte: start, lte: end } }, select: { createdAt: true } }),
    prisma.customerMembership.findMany({ where: { createdAt: { gte: start, lte: end } }, select: { createdAt: true } }),
    prisma.caisseGrant.findMany({ where: { createdAt: { gte: start, lte: end } }, select: { createdAt: true } }),
    prisma.loyaltyTransaction.findMany({
      where: { createdAt: { gte: start, lte: end } },
      select: { createdAt: true, pointsDelta: true, type: true },
    }),
    prisma.merchantPayment.findMany({
      where: { paidAt: { gte: start, lte: end }, status: "PAID" },
      select: { paidAt: true, amount: true },
    }),
  ]);

  const merchantMap = new Map<string, number>();
  for (const row of merchants) {
    const key = dateKey(row.createdAt);
    merchantMap.set(key, (merchantMap.get(key) ?? 0) + 1);
  }

  const customerMap = new Map<string, number>();
  for (const row of customers) {
    const key = dateKey(row.createdAt);
    customerMap.set(key, (customerMap.get(key) ?? 0) + 1);
  }

  const scanMap = new Map<string, number>();
  for (const row of scans) {
    const key = dateKey(row.createdAt);
    scanMap.set(key, (scanMap.get(key) ?? 0) + 1);
  }

  const txMap = new Map<string, number>();
  const pointsEarnedMap = new Map<string, number>();
  const pointsUsedMap = new Map<string, number>();
  for (const row of transactions) {
    const key = dateKey(row.createdAt);
    txMap.set(key, (txMap.get(key) ?? 0) + 1);
    if (row.pointsDelta > 0) pointsEarnedMap.set(key, (pointsEarnedMap.get(key) ?? 0) + row.pointsDelta);
    if (row.type === "REDEEM_REWARD") {
      pointsUsedMap.set(key, (pointsUsedMap.get(key) ?? 0) + Math.abs(row.pointsDelta));
    }
  }

  const revenueMap = new Map<string, number>();
  for (const row of revenue) {
    if (!row.paidAt) continue;
    const key = dateKey(row.paidAt);
    revenueMap.set(key, (revenueMap.get(key) ?? 0) + row.amount);
  }

  const [prevMerchants, prevCustomers, prevScans, prevTx] = await Promise.all([
    prisma.merchant.count({ where: { createdAt: { gte: previous.start, lt: previous.end } } }),
    prisma.customerMembership.count({ where: { createdAt: { gte: previous.start, lt: previous.end } } }),
    prisma.caisseGrant.count({ where: { createdAt: { gte: previous.start, lt: previous.end } } }),
    prisma.loyaltyTransaction.count({ where: { createdAt: { gte: previous.start, lt: previous.end } } }),
  ]);

  return {
    period,
    series: {
      newMerchants: fillDailySeries(start, end, merchantMap),
      newCustomers: fillDailySeries(start, end, customerMap),
      scans: fillDailySeries(start, end, scanMap),
      transactions: fillDailySeries(start, end, txMap),
      pointsEarned: fillDailySeries(start, end, pointsEarnedMap),
      pointsUsed: fillDailySeries(start, end, pointsUsedMap),
      collectedRevenue: fillDailySeries(start, end, revenueMap),
    },
    comparison: {
      newMerchants: { current: merchants.length, previous: prevMerchants },
      newCustomers: { current: customers.length, previous: prevCustomers },
      scans: { current: scans.length, previous: prevScans },
      transactions: { current: transactions.length, previous: prevTx },
    },
  };
}

export async function getPlatformBreakdowns() {
  const [byPlan, byLoyalty, topMerchants] = await Promise.all([
    prisma.merchantSubscription.groupBy({ by: ["plan"], _count: { _all: true } }),
    prisma.loyaltyProgram.groupBy({ by: ["mode"], _count: { _all: true } }),
    prisma.merchant.findMany({
      take: 10,
      orderBy: { customerMemberships: { _count: "desc" } },
      include: {
        _count: { select: { customerMemberships: true, caisseGrants: true, transactions: true } },
        subscription: true,
        program: { select: { mode: true } },
      },
    }),
  ]);

  return {
    byPlan: byPlan.map((row) => ({ plan: row.plan, count: row._count._all })),
    byLoyalty: byLoyalty.map((row) => ({ mode: row.mode as LoyaltyMode, count: row._count._all })),
    topMerchants: topMerchants.map((m) => ({
      id: m.id,
      name: m.name,
      slug: m.slug,
      customers: m._count.customerMemberships,
      scans: m._count.caisseGrants,
      transactions: m._count.transactions,
      plan: m.subscription?.plan ?? null,
      loyaltyMode: m.program?.mode ?? null,
    })),
  };
}
