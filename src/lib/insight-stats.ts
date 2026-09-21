// Fidelo Insight — agrégations serveur pour les statistiques commerçant (gratuites et
// premium). Tout est calculé côté serveur, scopé à un merchantId résolu depuis la session
// (jamais depuis une entrée client), et rien n'est jamais dérivé de montants inventés :
// les sections financières ne s'affichent que si `hasAnyRecordedRevenue` est vrai.
//
// Les définitions exactes des métriques sont dans insight-definitions.ts — chaque fonction
// ci-dessous cite la définition qu'elle implémente.

import type { LoyaltyTxType } from "@prisma/client";
import { prisma } from "./prisma";
import { formatEurosFromCents } from "./money";
import {
  bucketKey,
  enumerateBucketKeys,
  parisHour,
  parisWeekdayIndex,
  percentChange,
  resolvePeriod,
  startOfParisWeek,
  type InsightRange,
} from "./insight-period";

export type SeriesPoint = { date: string; value: number };
export type TrendMetric = {
  current: number;
  previous: number;
  changePct: number | null;
  series?: SeriesPoint[];
};

const WEEKDAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function trend(current: number, previous: number, series?: SeriesPoint[]): TrendMetric {
  return { current, previous, changePct: percentChange(current, previous), series };
}

function fillSeries(
  range: Pick<InsightRange, "start" | "end" | "bucket">,
  values: Map<string, number>,
): SeriesPoint[] {
  return enumerateBucketKeys(range).map((date) => ({ date, value: values.get(date) ?? 0 }));
}

/** Client total : CustomerMembership actif rattaché au commerce (pas supprimé). */
export async function getTotalClients(merchantId: string): Promise<number> {
  return prisma.customerMembership.count({ where: { merchantId, removedAt: null } });
}

/** Vrai si au moins une transaction porte un montant réel — condition d'affichage financier. */
export async function hasAnyRecordedRevenue(merchantId: string): Promise<boolean> {
  const row = await prisma.loyaltyTransaction.findFirst({
    where: { merchantId, purchaseAmountCents: { not: null } },
    select: { id: true },
  });
  return row !== null;
}

type RawTx = {
  type: LoyaltyTxType;
  createdAt: Date;
  pointsDelta: number;
  purchaseAmountCents: number | null;
  customerMembershipId: string;
  performedByUserId: string;
  rewardId: string | null;
};

async function loadTransactionsInWindow(merchantId: string, start: Date, end: Date): Promise<RawTx[]> {
  return prisma.loyaltyTransaction.findMany({
    where: {
      merchantId,
      status: "COMPLETED",
      type: { in: ["EARN_VISIT", "REDEEM_REWARD"] },
      createdAt: { gte: start, lt: end },
    },
    select: {
      type: true,
      createdAt: true,
      pointsDelta: true,
      purchaseAmountCents: true,
      customerMembershipId: true,
      performedByUserId: true,
      rewardId: true,
    },
    orderBy: { createdAt: "asc" },
  });
}

type LifetimeVisit = { count: number; first: Date; last: Date };

/** Agrégat DB (pas de transfert ligne à ligne) : historique complet des passages par client. */
async function loadLifetimeVisits(merchantId: string): Promise<Map<string, LifetimeVisit>> {
  const rows = await prisma.loyaltyTransaction.groupBy({
    by: ["customerMembershipId"],
    where: { merchantId, status: "COMPLETED", type: "EARN_VISIT" },
    _count: { _all: true },
    _max: { createdAt: true },
    _min: { createdAt: true },
  });
  const map = new Map<string, LifetimeVisit>();
  for (const row of rows) {
    if (!row._max.createdAt || !row._min.createdAt) continue;
    map.set(row.customerMembershipId, {
      count: row._count._all,
      first: row._min.createdAt,
      last: row._max.createdAt,
    });
  }
  return map;
}

// ---------------------------------------------------------------------------------
// Statistiques gratuites
// ---------------------------------------------------------------------------------

export type FreeMerchantStats = {
  totalClients: number;
  activeClients30d: number;
  newClientsThisWeek: number;
  passagesThisWeek: number;
  scansValidatedThisWeek: number;
  passagesSeries: SeriesPoint[];
  revenue: { amountCentsLabel: string; amountCents: number } | null;
};

export async function getFreeMerchantStats(
  merchantId: string,
  filterRange: Pick<InsightRange, "start" | "end" | "bucket">,
): Promise<FreeMerchantStats> {
  const now = new Date();
  const startOfThisWeek = startOfParisWeek(now);
  const start30d = new Date(now.getTime() - 30 * 86_400_000);

  const [totalClients, newClientsThisWeek, activeClients30dRows, filterTx, hasRevenue] = await Promise.all([
    getTotalClients(merchantId),
    prisma.customerMembership.count({
      where: { merchantId, removedAt: null, createdAt: { gte: startOfThisWeek } },
    }),
    prisma.loyaltyTransaction.groupBy({
      by: ["customerMembershipId"],
      where: {
        merchantId,
        status: "COMPLETED",
        type: { in: ["EARN_VISIT", "REDEEM_REWARD"] },
        createdAt: { gte: start30d },
      },
    }),
    loadTransactionsInWindow(merchantId, filterRange.start, filterRange.end),
    hasAnyRecordedRevenue(merchantId),
  ]);

  const [passagesThisWeekCount, scansThisWeekCount] = await Promise.all([
    prisma.loyaltyTransaction.count({
      where: { merchantId, status: "COMPLETED", type: "EARN_VISIT", createdAt: { gte: startOfThisWeek } },
    }),
    prisma.auditLog.count({
      where: { merchantId, action: "CAISSE_SCAN", createdAt: { gte: startOfThisWeek } },
    }),
  ]);

  const seriesMap = new Map<string, number>();
  let revenueCents = 0;
  for (const row of filterTx) {
    if (row.type === "EARN_VISIT") {
      const key = bucketKey(row.createdAt, filterRange.bucket);
      seriesMap.set(key, (seriesMap.get(key) ?? 0) + 1);
    }
    if (row.purchaseAmountCents) revenueCents += row.purchaseAmountCents;
  }

  return {
    totalClients,
    activeClients30d: activeClients30dRows.length,
    newClientsThisWeek,
    passagesThisWeek: passagesThisWeekCount,
    scansValidatedThisWeek: scansThisWeekCount,
    passagesSeries: fillSeries(filterRange, seriesMap),
    revenue: hasRevenue
      ? { amountCents: revenueCents, amountCentsLabel: formatEurosFromCents(revenueCents) }
      : null,
  };
}

export type HomeStats = {
  activeClients: TrendMetric;
  passagesThisWeek: TrendMetric;
  rewardsUsedThisWeek: TrendMetric;
  newClientsThisWeek: TrendMetric;
};

/**
 * KPIs de l'accueil commerçant, avec évolution réelle vs la période précédente. Toujours
 * gratuit (pas de dépendance à Fidelo Insight) — ce sont les indicateurs de base, pas
 * l'analytique premium.
 */
export async function getHomeStats(merchantId: string): Promise<HomeStats> {
  const now = new Date();
  const range30 = resolvePeriod("30d", now);
  const range7 = resolvePeriod("7d", now);

  const [activeCurrentRows, activePreviousRows, weekTx, newClientsCurrent, newClientsPrevious] = await Promise.all([
    prisma.loyaltyTransaction.groupBy({
      by: ["customerMembershipId"],
      where: {
        merchantId,
        status: "COMPLETED",
        type: { in: ["EARN_VISIT", "REDEEM_REWARD"] },
        createdAt: { gte: range30.start, lt: range30.end },
      },
    }),
    prisma.loyaltyTransaction.groupBy({
      by: ["customerMembershipId"],
      where: {
        merchantId,
        status: "COMPLETED",
        type: { in: ["EARN_VISIT", "REDEEM_REWARD"] },
        createdAt: { gte: range30.compareStart, lt: range30.compareEnd },
      },
    }),
    prisma.loyaltyTransaction.findMany({
      where: {
        merchantId,
        status: "COMPLETED",
        type: { in: ["EARN_VISIT", "REDEEM_REWARD"] },
        createdAt: { gte: range7.compareStart, lt: range7.end },
      },
      select: { type: true, createdAt: true },
    }),
    prisma.customerMembership.count({
      where: { merchantId, removedAt: null, createdAt: { gte: range7.start, lt: range7.end } },
    }),
    prisma.customerMembership.count({
      where: { merchantId, removedAt: null, createdAt: { gte: range7.compareStart, lt: range7.compareEnd } },
    }),
  ]);

  let passagesCurrent = 0;
  let passagesPrevious = 0;
  let rewardsCurrent = 0;
  let rewardsPrevious = 0;
  for (const row of weekTx) {
    const inCurrent = row.createdAt.getTime() >= range7.start.getTime();
    if (row.type === "EARN_VISIT") {
      if (inCurrent) passagesCurrent += 1;
      else passagesPrevious += 1;
    } else if (row.type === "REDEEM_REWARD") {
      if (inCurrent) rewardsCurrent += 1;
      else rewardsPrevious += 1;
    }
  }

  return {
    activeClients: trend(activeCurrentRows.length, activePreviousRows.length),
    passagesThisWeek: trend(passagesCurrent, passagesPrevious),
    rewardsUsedThisWeek: trend(rewardsCurrent, rewardsPrevious),
    newClientsThisWeek: trend(newClientsCurrent, newClientsPrevious),
  };
}

// ---------------------------------------------------------------------------------
// Fidelo Insight — teaser verrouillé (constantes fixes, aucun accès DB)
// ---------------------------------------------------------------------------------

/**
 * Valeurs neutres, codées en dur, jamais issues de la base — c'est la seule chose envoyée
 * au navigateur pour un commerce non abonné. Ne prend aucun paramètre exprès : impossible
 * qu'une vraie donnée s'y glisse par erreur.
 */
export function getLockedInsightPlaceholder() {
  return {
    overview: { activeClients: 128, returningClients: 64, visits: 342, changePct: 12 },
    frequentationSeries: Array.from({ length: 7 }, (_, i) => ({ date: `J-${6 - i}`, value: 30 + ((i * 7) % 20) })),
    segments: [
      { key: "nouveaux", label: "Nouveaux clients", value: 24 },
      { key: "reguliers", label: "Clients réguliers", value: 41 },
      { key: "fideles", label: "Très fidèles", value: 18 },
      { key: "risque", label: "À risque", value: 12 },
      { key: "inactifs", label: "Inactifs", value: 5 },
    ],
  } as const;
}

// ---------------------------------------------------------------------------------
// Fidelo Insight — tableau de bord premium
// ---------------------------------------------------------------------------------

export type InsightOverview = {
  totalClients: TrendMetric;
  activeClients: TrendMetric;
  newClients: TrendMetric;
  returningClients: TrendMetric;
  passages: TrendMetric;
  scansValidated: TrendMetric;
  rewardsUsed: TrendMetric;
};

export type InsightFrequentation = {
  series: SeriesPoint[];
  newVsReturningSeries: { date: string; new: number; returning: number }[];
  byWeekday: { label: string; value: number }[];
  heatmap: { weekday: number; hour: number; value: number }[];
  avgVisitsPerClient: number;
  avgDaysBetweenVisits: number | null;
  busiestDay: string | null;
  busiestHour: number | null;
};

export type InsightRetention = {
  returnRate7d: number | null;
  returnRate30d: number | null;
  returnRate90d: number | null;
  avgVisitFrequencyDays: number | null;
  inactive30d: number;
  inactive60d: number;
  inactive90d: number;
  reactivated: number;
  cohorts: { cohortWeek: string; size: number; retention: (number | null)[] }[];
};

export type InsightSegments = {
  segments: { key: string; label: string; description: string; size: number; changePct: number | null }[];
};

export type InsightRewards = {
  pointsDistributed: TrendMetric;
  pointsUsed: TrendMetric;
  pointsBalance: number;
  rewardsUsedCount: TrendMetric;
  redemptionRate: number | null;
  avgDaysToFirstReward: number | null;
  topRewards: { rewardId: string; count: number }[];
  lowRewards: { rewardId: string; count: number }[];
  funnel: { registered: number; returned: number; rewardUsed: number };
};

export type InsightTeam = {
  employees: {
    userId: string;
    firstName: string;
    scansValidated: number;
    scansDenied: number;
    commits: number;
  }[];
};

export type InsightFinancial = {
  revenue: TrendMetric;
  avgBasketCents: number;
  avgSpendPerClientCents: number;
  loyalRewardValueCents: number;
  revenueFromRewardsCents: number;
  topSpenders: { customerMembershipId: string; firstName: string; totalCents: number }[];
};

export type InsightPremium = {
  overview: InsightOverview;
  frequentation: InsightFrequentation;
  retention: InsightRetention;
  segments: InsightSegments;
  rewards: InsightRewards;
  team: InsightTeam;
  financial: InsightFinancial | null;
};

export async function getInsightPremium(merchantId: string, range: InsightRange): Promise<InsightPremium> {
  const [
    current,
    previous,
    lifetime,
    lifetimeBeforeStart,
    totalClients,
    totalClientsPrev,
    newClientsCurrent,
    newClientsPrevious,
    revenueEnabled,
  ] = await Promise.all([
    loadTransactionsInWindow(merchantId, range.start, range.end),
    loadTransactionsInWindow(merchantId, range.compareStart, range.compareEnd),
    loadLifetimeVisits(merchantId),
    loadVisitsBefore(merchantId, range.start),
    prisma.customerMembership.count({ where: { merchantId, removedAt: null, createdAt: { lt: range.end } } }),
    // range.compareEnd === range.start : total de clients juste avant le début de la période.
    prisma.customerMembership.count({ where: { merchantId, removedAt: null, createdAt: { lt: range.compareEnd } } }),
    prisma.customerMembership.count({
      where: { merchantId, removedAt: null, createdAt: { gte: range.start, lt: range.end } },
    }),
    prisma.customerMembership.count({
      where: { merchantId, removedAt: null, createdAt: { gte: range.compareStart, lt: range.compareEnd } },
    }),
    hasAnyRecordedRevenue(merchantId),
  ]);

  const overview = buildOverview({
    current,
    previous,
    totalClients,
    totalClientsPrev,
    newClientsCurrent,
    newClientsPrevious,
    range,
  });
  const frequentation = buildFrequentation({ current, lifetime, range });
  const retention = buildRetention({ lifetime, lifetimeBeforeStart, range });
  const segments = buildSegments({ lifetime, range });
  const rewards = await buildRewards({ merchantId, current, previous, range });
  const team = await buildTeam({ merchantId, current, range });
  const financial = revenueEnabled ? await buildFinancial({ current, previous }) : null;

  return { overview, frequentation, retention, segments, rewards, team, financial };
}

function loadVisitsBefore(merchantId: string, before: Date) {
  return prisma.loyaltyTransaction
    .groupBy({
      by: ["customerMembershipId"],
      where: { merchantId, status: "COMPLETED", type: "EARN_VISIT", createdAt: { lt: before } },
      _max: { createdAt: true },
    })
    .then((rows) => {
      const map = new Map<string, Date>();
      for (const row of rows) if (row._max.createdAt) map.set(row.customerMembershipId, row._max.createdAt);
      return map;
    });
}

function buildOverview(input: {
  current: RawTx[];
  previous: RawTx[];
  totalClients: number;
  totalClientsPrev: number;
  newClientsCurrent: number;
  newClientsPrevious: number;
  range: InsightRange;
}): InsightOverview {
  const { current, previous, totalClients, totalClientsPrev, newClientsCurrent, newClientsPrevious } = input;

  const activeCurrent = new Set(current.map((t) => t.customerMembershipId)).size;
  const activePrevious = new Set(previous.map((t) => t.customerMembershipId)).size;

  const visitsByCustomerCurrent = new Map<string, number>();
  for (const t of current) {
    if (t.type !== "EARN_VISIT") continue;
    visitsByCustomerCurrent.set(t.customerMembershipId, (visitsByCustomerCurrent.get(t.customerMembershipId) ?? 0) + 1);
  }
  const returningCurrent = [...visitsByCustomerCurrent.values()].filter((c) => c >= 2).length;
  const visitsByCustomerPrev = new Map<string, number>();
  for (const t of previous) {
    if (t.type !== "EARN_VISIT") continue;
    visitsByCustomerPrev.set(t.customerMembershipId, (visitsByCustomerPrev.get(t.customerMembershipId) ?? 0) + 1);
  }
  const returningPrevious = [...visitsByCustomerPrev.values()].filter((c) => c >= 2).length;

  const passagesCurrent = current.filter((t) => t.type === "EARN_VISIT").length;
  const passagesPrevious = previous.filter((t) => t.type === "EARN_VISIT").length;
  const rewardsUsedCurrent = current.filter((t) => t.type === "REDEEM_REWARD").length;
  const rewardsUsedPrevious = previous.filter((t) => t.type === "REDEEM_REWARD").length;

  return {
    totalClients: trend(totalClients, totalClientsPrev),
    activeClients: trend(activeCurrent, activePrevious),
    newClients: trend(newClientsCurrent, newClientsPrevious),
    returningClients: trend(returningCurrent, returningPrevious),
    passages: trend(passagesCurrent, passagesPrevious),
    scansValidated: trend(passagesCurrent, passagesPrevious),
    rewardsUsed: trend(rewardsUsedCurrent, rewardsUsedPrevious),
  };
}

function buildFrequentation(input: {
  current: RawTx[];
  lifetime: Map<string, LifetimeVisit>;
  range: InsightRange;
}): InsightFrequentation {
  const { current, lifetime, range } = input;
  const earns = current.filter((t) => t.type === "EARN_VISIT");

  const seriesMap = new Map<string, number>();
  const newVsReturning = new Map<string, { new: number; returning: number }>();
  const weekdayCounts = new Array(7).fill(0);
  const heatmapMap = new Map<string, number>();
  const seenBeforeInRange = new Set<string>();

  for (const t of earns) {
    const key = bucketKey(t.createdAt, range.bucket);
    seriesMap.set(key, (seriesMap.get(key) ?? 0) + 1);

    const weekday = parisWeekdayIndex(t.createdAt);
    weekdayCounts[weekday] += 1;

    const hour = parisHour(t.createdAt);
    const hKey = `${weekday}:${hour}`;
    heatmapMap.set(hKey, (heatmapMap.get(hKey) ?? 0) + 1);

    const lifetimeVisit = lifetime.get(t.customerMembershipId);
    const isFirstEver = lifetimeVisit && lifetimeVisit.first.getTime() === t.createdAt.getTime();
    const isNew = Boolean(isFirstEver) && !seenBeforeInRange.has(t.customerMembershipId);
    if (isNew) seenBeforeInRange.add(t.customerMembershipId);
    const bucket = newVsReturning.get(key) ?? { new: 0, returning: 0 };
    if (isNew) bucket.new += 1;
    else bucket.returning += 1;
    newVsReturning.set(key, bucket);
  }

  const heatmap: InsightFrequentation["heatmap"] = [];
  for (let weekday = 0; weekday < 7; weekday += 1) {
    for (let hour = 0; hour < 24; hour += 1) {
      heatmap.push({ weekday, hour, value: heatmapMap.get(`${weekday}:${hour}`) ?? 0 });
    }
  }

  const visitedCustomers = new Set(earns.map((t) => t.customerMembershipId));
  const avgVisitsPerClient = visitedCustomers.size
    ? earns.length / visitedCustomers.size
    : 0;

  const gaps: number[] = [];
  for (const id of visitedCustomers) {
    const lv = lifetime.get(id);
    if (lv && lv.count >= 2) {
      gaps.push((lv.last.getTime() - lv.first.getTime()) / 86_400_000 / (lv.count - 1));
    }
  }
  const avgDaysBetweenVisits = gaps.length ? gaps.reduce((a, b) => a + b, 0) / gaps.length : null;

  const maxWeekday = weekdayCounts.reduce((best, v, i) => (v > weekdayCounts[best] ? i : best), 0);
  let maxHour: number | null = null;
  let maxHourValue = -1;
  const hourTotals = new Array(24).fill(0);
  for (const [key, value] of heatmapMap) {
    const hour = Number(key.split(":")[1]);
    hourTotals[hour] += value;
  }
  hourTotals.forEach((value, hour) => {
    if (value > maxHourValue) {
      maxHourValue = value;
      maxHour = hour;
    }
  });

  return {
    series: fillSeries(range, seriesMap),
    newVsReturningSeries: enumerateBucketKeys(range).map((date) => ({
      date,
      new: newVsReturning.get(date)?.new ?? 0,
      returning: newVsReturning.get(date)?.returning ?? 0,
    })),
    byWeekday: WEEKDAY_LABELS.map((label, i) => ({ label, value: weekdayCounts[i] })),
    heatmap,
    avgVisitsPerClient,
    avgDaysBetweenVisits,
    busiestDay: earns.length ? WEEKDAY_LABELS[maxWeekday] : null,
    busiestHour: earns.length && maxHourValue > 0 ? maxHour : null,
  };
}

function buildRetention(input: {
  lifetime: Map<string, LifetimeVisit>;
  lifetimeBeforeStart: Map<string, Date>;
  range: InsightRange;
}): InsightRetention {
  const { lifetime, lifetimeBeforeStart, range } = input;
  const now = range.end;

  let inactive30 = 0;
  let inactive60 = 0;
  let inactive90 = 0;
  let reactivated = 0;
  let returned7 = 0;
  let returned30 = 0;
  let returned90 = 0;
  let base7 = 0;
  let base30 = 0;
  let base90 = 0;

  for (const [id, visit] of lifetime) {
    const daysSinceLast = (now.getTime() - visit.last.getTime()) / 86_400_000;
    if (daysSinceLast >= 30) inactive30 += 1;
    if (daysSinceLast >= 60) inactive60 += 1;
    if (daysSinceLast >= 90) inactive90 += 1;

    const priorLast = lifetimeBeforeStart.get(id);
    if (priorLast) {
      const gapBeforeRange = (range.start.getTime() - priorLast.getTime()) / 86_400_000;
      const returnedInRange = visit.last.getTime() >= range.start.getTime();
      if (gapBeforeRange >= 60 && returnedInRange) reactivated += 1;
    }

    if (visit.first.getTime() <= now.getTime() - 7 * 86_400_000) {
      base7 += 1;
      if (visit.last.getTime() >= visit.first.getTime() + 7 * 86_400_000) returned7 += 1;
    }
    if (visit.first.getTime() <= now.getTime() - 30 * 86_400_000) {
      base30 += 1;
      if (visit.last.getTime() >= visit.first.getTime() + 30 * 86_400_000) returned30 += 1;
    }
    if (visit.first.getTime() <= now.getTime() - 90 * 86_400_000) {
      base90 += 1;
      if (visit.last.getTime() >= visit.first.getTime() + 90 * 86_400_000) returned90 += 1;
    }
  }

  const gaps: number[] = [];
  for (const visit of lifetime.values()) {
    if (visit.count >= 2) gaps.push((visit.last.getTime() - visit.first.getTime()) / 86_400_000 / (visit.count - 1));
  }
  const avgVisitFrequencyDays = gaps.length ? gaps.reduce((a, b) => a + b, 0) / gaps.length : null;

  const cohorts = buildCohorts(lifetime, range);

  return {
    returnRate7d: base7 ? (returned7 / base7) * 100 : null,
    returnRate30d: base30 ? (returned30 / base30) * 100 : null,
    returnRate90d: base90 ? (returned90 / base90) * 100 : null,
    avgVisitFrequencyDays,
    inactive30d: inactive30,
    inactive60d: inactive60,
    inactive90d: inactive90,
    reactivated,
    cohorts,
  };
}

/**
 * Cohortes hebdomadaires calculées sur la période affichée uniquement (pas l'historique
 * complet du commerce) : pour chaque semaine de première visite dans la période, le taux de
 * clients revenus lors des semaines suivantes, elles aussi dans la période.
 */
function buildCohorts(
  lifetime: Map<string, LifetimeVisit>,
  range: InsightRange,
): InsightRetention["cohorts"] {
  const weeks = enumerateBucketKeys({ start: range.start, end: range.end, bucket: "week" });
  if (weeks.length < 2) return [];

  const cohortMembers = new Map<string, string[]>();
  for (const [id, visit] of lifetime) {
    if (visit.first.getTime() < range.start.getTime() || visit.first.getTime() >= range.end.getTime()) continue;
    const week = bucketKey(visit.first, "week");
    if (!weeks.includes(week)) continue;
    const list = cohortMembers.get(week) ?? [];
    list.push(id);
    cohortMembers.set(week, list);
  }

  return weeks.map((cohortWeek, cohortIndex) => {
    const members = cohortMembers.get(cohortWeek) ?? [];
    const retention = weeks.slice(cohortIndex).map((_, offset) => {
      if (offset === 0) return members.length ? 100 : null;
      if (!members.length) return null;
      const targetWeekIndex = cohortIndex + offset;
      const targetWeekStart = new Date(startOfParisWeek(range.start).getTime() + targetWeekIndex * 7 * 86_400_000);
      const targetWeekEnd = new Date(targetWeekStart.getTime() + 7 * 86_400_000);
      const activeCount = members.filter((id) => {
        const visit = lifetime.get(id);
        return visit && visit.last.getTime() >= targetWeekStart.getTime() && visit.last.getTime() < targetWeekEnd.getTime();
      }).length;
      return (activeCount / members.length) * 100;
    });
    return { cohortWeek, size: members.length, retention };
  });
}

function buildSegments(input: { lifetime: Map<string, LifetimeVisit>; range: InsightRange }): InsightSegments {
  const { lifetime, range } = input;
  const now = range.end;
  const counts = { nouveaux: 0, reguliers: 0, fideles: 0, prometteurs: 0, risque: 0, inactifs: 0, reactives: 0 };

  for (const visit of lifetime.values()) {
    const daysSinceLast = (now.getTime() - visit.last.getTime()) / 86_400_000;
    const daysSinceFirst = (now.getTime() - visit.first.getTime()) / 86_400_000;

    if (daysSinceLast >= 90) {
      counts.inactifs += 1;
    } else if (daysSinceFirst <= 14) {
      counts.nouveaux += 1;
    } else if (visit.count >= 8) {
      counts.fideles += 1;
    } else if (daysSinceLast >= 30 && daysSinceLast < 90) {
      counts.risque += 1;
    } else if (visit.count >= 2) {
      counts.reguliers += 1;
    } else {
      counts.prometteurs += 1;
    }
  }

  const labels: Record<keyof typeof counts, { label: string; description: string }> = {
    nouveaux: { label: "Nouveaux clients", description: "Première visite il y a moins de 14 jours." },
    reguliers: { label: "Clients réguliers", description: "Au moins deux passages, actifs récemment." },
    fideles: { label: "Clients très fidèles", description: "Huit passages ou plus." },
    prometteurs: { label: "Clients prometteurs", description: "Un seul passage pour l'instant, pas encore à risque." },
    risque: { label: "Clients à risque", description: "Aucun passage depuis 30 à 89 jours." },
    inactifs: { label: "Clients inactifs", description: "Aucun passage depuis 90 jours ou plus." },
    reactives: { label: "Clients réactivés", description: "Revenus après une longue absence." },
  };

  return {
    segments: (Object.keys(counts) as (keyof typeof counts)[]).map((key) => ({
      key,
      label: labels[key].label,
      description: labels[key].description,
      size: counts[key],
      changePct: null,
    })),
  };
}

async function buildRewards(input: {
  merchantId: string;
  current: RawTx[];
  previous: RawTx[];
  range: InsightRange;
}): Promise<InsightRewards> {
  const { merchantId, current, previous, range } = input;

  const distributedCurrent = current.filter((t) => t.type === "EARN_VISIT").reduce((s, t) => s + Math.max(0, t.pointsDelta), 0);
  const distributedPrevious = previous.filter((t) => t.type === "EARN_VISIT").reduce((s, t) => s + Math.max(0, t.pointsDelta), 0);
  const usedCurrent = current.filter((t) => t.type === "REDEEM_REWARD").reduce((s, t) => s + Math.abs(t.pointsDelta), 0);
  const usedPrevious = previous.filter((t) => t.type === "REDEEM_REWARD").reduce((s, t) => s + Math.abs(t.pointsDelta), 0);
  const rewardsUsedCurrent = current.filter((t) => t.type === "REDEEM_REWARD").length;
  const rewardsUsedPrevious = previous.filter((t) => t.type === "REDEEM_REWARD").length;

  const [pointsBalanceAgg, rewardCounts] = await Promise.all([
    // `points` est le miroir de solde actif tenu à jour quel que soit le mode du programme
    // (voir loyalty-balance.ts) : c'est la seule colonne à sommer pour éviter un double compte.
    prisma.customerMembership.aggregate({ where: { merchantId }, _sum: { points: true } }),
    prisma.loyaltyTransaction.groupBy({
      by: ["rewardId"],
      where: { merchantId, status: "COMPLETED", type: "REDEEM_REWARD", rewardId: { not: null }, createdAt: { gte: range.start, lt: range.end } },
      _count: { _all: true },
    }),
  ]);

  const ranked = rewardCounts
    .filter((r) => r.rewardId)
    .map((r) => ({ rewardId: r.rewardId as string, count: r._count._all }))
    .sort((a, b) => b.count - a.count);

  const firstRewardGaps: number[] = [];
  const byCustomerFirstVisit = new Map<string, Date>();
  const byCustomerFirstReward = new Map<string, Date>();
  for (const t of current) {
    if (t.type === "EARN_VISIT" && !byCustomerFirstVisit.has(t.customerMembershipId)) {
      byCustomerFirstVisit.set(t.customerMembershipId, t.createdAt);
    }
    if (t.type === "REDEEM_REWARD" && !byCustomerFirstReward.has(t.customerMembershipId)) {
      byCustomerFirstReward.set(t.customerMembershipId, t.createdAt);
    }
  }
  for (const [id, rewardDate] of byCustomerFirstReward) {
    const firstVisit = byCustomerFirstVisit.get(id);
    if (firstVisit) firstRewardGaps.push((rewardDate.getTime() - firstVisit.getTime()) / 86_400_000);
  }

  const registered = new Set(current.map((t) => t.customerMembershipId)).size;
  const visitCounts = new Map<string, number>();
  for (const t of current) {
    if (t.type !== "EARN_VISIT") continue;
    visitCounts.set(t.customerMembershipId, (visitCounts.get(t.customerMembershipId) ?? 0) + 1);
  }
  const returned = [...visitCounts.values()].filter((c) => c >= 2).length;
  const rewardUsed = new Set(current.filter((t) => t.type === "REDEEM_REWARD").map((t) => t.customerMembershipId)).size;

  return {
    pointsDistributed: trend(distributedCurrent, distributedPrevious),
    pointsUsed: trend(usedCurrent, usedPrevious),
    pointsBalance: pointsBalanceAgg._sum.points ?? 0,
    rewardsUsedCount: trend(rewardsUsedCurrent, rewardsUsedPrevious),
    redemptionRate: distributedCurrent > 0 ? (usedCurrent / distributedCurrent) * 100 : null,
    avgDaysToFirstReward: firstRewardGaps.length
      ? firstRewardGaps.reduce((a, b) => a + b, 0) / firstRewardGaps.length
      : null,
    topRewards: ranked.slice(0, 5),
    lowRewards: ranked.slice(-5).reverse(),
    funnel: { registered, returned, rewardUsed },
  };
}

async function buildTeam(input: { merchantId: string; current: RawTx[]; range: InsightRange }): Promise<InsightTeam> {
  const { merchantId, current, range } = input;

  const auditRows = await prisma.auditLog.findMany({
    where: {
      merchantId,
      action: { in: ["CAISSE_SCAN", "CAISSE_SCAN_DENIED"] },
      createdAt: { gte: range.start, lt: range.end },
      actorId: { not: null },
    },
    select: { action: true, actorId: true },
  });

  const commitsByActor = new Map<string, number>();
  for (const t of current) {
    commitsByActor.set(t.performedByUserId, (commitsByActor.get(t.performedByUserId) ?? 0) + 1);
  }

  const scansByActor = new Map<string, { validated: number; denied: number }>();
  for (const row of auditRows) {
    if (!row.actorId) continue;
    const entry = scansByActor.get(row.actorId) ?? { validated: 0, denied: 0 };
    if (row.action === "CAISSE_SCAN") entry.validated += 1;
    else entry.denied += 1;
    scansByActor.set(row.actorId, entry);
  }

  const actorIds = new Set<string>([...commitsByActor.keys(), ...scansByActor.keys()]);
  if (actorIds.size === 0) return { employees: [] };

  const users = await prisma.user.findMany({
    where: { id: { in: [...actorIds] } },
    select: { id: true, firstName: true },
  });
  const nameById = new Map(users.map((u) => [u.id, u.firstName]));

  const employees = [...actorIds].map((userId) => ({
    userId,
    firstName: nameById.get(userId) ?? "Employé",
    scansValidated: scansByActor.get(userId)?.validated ?? 0,
    scansDenied: scansByActor.get(userId)?.denied ?? 0,
    commits: commitsByActor.get(userId) ?? 0,
  }));
  employees.sort((a, b) => b.scansValidated + b.commits - (a.scansValidated + a.commits));

  return { employees };
}

async function buildFinancial(input: { current: RawTx[]; previous: RawTx[] }): Promise<InsightFinancial> {
  const { current, previous } = input;

  const revenueCurrent = current.reduce((s, t) => s + (t.purchaseAmountCents ?? 0), 0);
  const revenuePrevious = previous.reduce((s, t) => s + (t.purchaseAmountCents ?? 0), 0);

  const purchasesWithAmount = current.filter((t) => t.purchaseAmountCents !== null);
  const avgBasketCents = purchasesWithAmount.length
    ? Math.round(purchasesWithAmount.reduce((s, t) => s + (t.purchaseAmountCents ?? 0), 0) / purchasesWithAmount.length)
    : 0;

  const byCustomer = new Map<string, number>();
  for (const t of current) {
    if (!t.purchaseAmountCents) continue;
    byCustomer.set(t.customerMembershipId, (byCustomer.get(t.customerMembershipId) ?? 0) + t.purchaseAmountCents);
  }
  const avgSpendPerClientCents = byCustomer.size
    ? Math.round([...byCustomer.values()].reduce((a, b) => a + b, 0) / byCustomer.size)
    : 0;

  const visitCounts = new Map<string, number>();
  for (const t of current) {
    if (t.type === "EARN_VISIT") visitCounts.set(t.customerMembershipId, (visitCounts.get(t.customerMembershipId) ?? 0) + 1);
  }
  const loyalCustomerIds = [...visitCounts.entries()].filter(([, c]) => c >= 5).map(([id]) => id);
  const loyalRewardValueCents = loyalCustomerIds.reduce((s, id) => s + (byCustomer.get(id) ?? 0), 0);

  const revenueFromRewardsCents = current
    .filter((t) => t.type === "REDEEM_REWARD" && t.purchaseAmountCents)
    .reduce((s, t) => s + (t.purchaseAmountCents ?? 0), 0);

  const topSpenderEntries = [...byCustomer.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topSpenderMemberships = topSpenderEntries.length
    ? await prisma.customerMembership.findMany({
        where: { id: { in: topSpenderEntries.map(([id]) => id) } },
        select: { id: true, user: { select: { firstName: true } } },
      })
    : [];
  const firstNameByMembership = new Map(topSpenderMemberships.map((m) => [m.id, m.user.firstName]));
  const topSpenders = topSpenderEntries.map(([customerMembershipId, totalCents]) => ({
    customerMembershipId,
    firstName: firstNameByMembership.get(customerMembershipId) ?? "Client",
    totalCents,
  }));

  return {
    revenue: trend(revenueCurrent, revenuePrevious),
    avgBasketCents,
    avgSpendPerClientCents,
    loyalRewardValueCents,
    revenueFromRewardsCents,
    topSpenders,
  };
}
