import type { LoyaltyMode, LoyaltyTxType, Prisma } from "@prisma/client";
import { getActiveMerchantLoyaltyContext } from "./loyalty-context";
import {
  formatUnitCount,
  historyEntryLabel,
  loyaltyUnitForMode,
  type HistoryTxMetadata,
  type LoyaltyUnit,
} from "./loyalty-labels";
import { formatEurosFromCents } from "./money";
import { prisma } from "./prisma";

export type ActivityItem = {
  id: string;
  merchantId: string;
  merchantName: string;
  merchantSlug: string;
  merchantLogoUrl: string | null;
  createdAt: string;
  type: string;
  title: string;
  detail: string;
  lineLabel: string;
  deltaLabel: string;
  formattedDate: string;
  purchaseAmountCents: number | null;
  status: "completed" | "pending" | "cancelled";
};

export type NextRewardOverview = {
  rewardName: string;
  merchantId: string;
  merchantName: string;
  merchantSlug: string;
  merchantLogoUrl: string | null;
  statusLabel: string;
  progressCurrent: number;
  progressTarget: number;
  progressPercent: number;
  unit: LoyaltyUnit;
  available: boolean;
  mode: LoyaltyMode;
};

export type CustomerLoyaltyOverview = {
  nextReward: NextRewardOverview | null;
  recentActivity: ActivityItem[];
  activityTotal: number;
};

export type NextRewardCandidate = NextRewardOverview & {
  sortAvailable: number;
  sortProgress: number;
  sortRemaining: number;
};

const txSelect = {
  id: true,
  type: true,
  pointsDelta: true,
  reason: true,
  createdAt: true,
  metadata: true,
  ruleApplied: true,
  purchaseAmountCents: true,
  status: true,
  merchantId: true,
  merchant: { select: { id: true, name: true, slug: true, logoUrl: true } },
} satisfies Prisma.LoyaltyTransactionSelect;

type LoyaltyTxRow = Prisma.LoyaltyTransactionGetPayload<{ select: typeof txSelect }>;

export function formatActivityDate(date: Date): string {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  const time = date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  if (date >= startOfToday) return `Aujourd'hui à ${time}`;
  if (date >= startOfYesterday) return `Hier à ${time}`;
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatActivityFromTransaction(tx: LoyaltyTxRow): ActivityItem {
  const meta = (tx.metadata as HistoryTxMetadata | null) ?? null;
  const unit = meta?.unit ?? loyaltyUnitForMode(meta?.mode ?? "VISITS");
  const history = historyEntryLabel({
    type: tx.type,
    pointsDelta: tx.pointsDelta,
    reason: tx.reason,
    metadata: meta,
    ruleApplied: tx.ruleApplied,
  });

  let detail = history.title;
  if (tx.purchaseAmountCents != null && tx.purchaseAmountCents > 0) {
    detail = `Achat de ${formatEurosFromCents(tx.purchaseAmountCents)}`;
  } else if (tx.type === "REDEEM_REWARD" && tx.reason) {
    detail = `${tx.reason} utilisé`;
  }

  return {
    id: tx.id,
    merchantId: tx.merchant.id,
    merchantName: tx.merchant.name,
    merchantSlug: tx.merchant.slug,
    merchantLogoUrl: tx.merchant.logoUrl,
    createdAt: tx.createdAt.toISOString(),
    type: tx.type,
    title: history.title,
    detail,
    lineLabel: `${tx.merchant.name} · ${detail}`,
    deltaLabel: history.deltaLabel,
    formattedDate: formatActivityDate(tx.createdAt),
    purchaseAmountCents: tx.purchaseAmountCents,
    status: tx.status === "COMPLETED" ? "completed" : tx.status === "PENDING" ? "pending" : "cancelled",
  };
}

export function buildNextRewardCandidates(input: {
  merchantId: string;
  merchantName: string;
  merchantSlug: string;
  merchantLogoUrl: string | null;
  mode: LoyaltyMode;
  unit: LoyaltyUnit;
  balance: number;
  rewards: Array<{ id: string; name: string; threshold: number; thresholdUnit: string; isActive?: boolean }>;
}): NextRewardCandidate[] {
  const unit = input.unit;
  const active = input.rewards.filter(
    (reward) => reward.isActive !== false && reward.thresholdUnit === (unit === "passages" ? "visits" : "points"),
  );

  return active.map((reward) => {
    const available = input.balance >= reward.threshold;
    const remaining = Math.max(0, reward.threshold - input.balance);
    const progressPercent =
      reward.threshold > 0 ? Math.min(100, Math.round((input.balance / reward.threshold) * 100)) : 0;

    const statusLabel = available
      ? "Disponible maintenant"
      : `Encore ${formatUnitCount(remaining, unit)}`;

    return {
      rewardName: reward.name,
      merchantId: input.merchantId,
      merchantName: input.merchantName,
      merchantSlug: input.merchantSlug,
      merchantLogoUrl: input.merchantLogoUrl,
      statusLabel,
      progressCurrent: input.balance,
      progressTarget: reward.threshold,
      progressPercent,
      unit,
      available,
      mode: input.mode,
      sortAvailable: available ? 0 : 1,
      sortProgress: -progressPercent,
      sortRemaining: remaining,
    };
  });
}

export function selectBestNextReward(candidates: NextRewardCandidate[]): NextRewardOverview | null {
  if (candidates.length === 0) return null;

  const sorted = [...candidates].sort((a, b) => {
    if (a.sortAvailable !== b.sortAvailable) return a.sortAvailable - b.sortAvailable;
    if (a.sortProgress !== b.sortProgress) return a.sortProgress - b.sortProgress;
    if (a.sortRemaining !== b.sortRemaining) return a.sortRemaining - b.sortRemaining;
    return a.merchantName.localeCompare(b.merchantName, "fr");
  });

  const best = sorted[0]!;
  const { sortAvailable: _sa, sortProgress: _sp, sortRemaining: _sr, ...overview } = best;
  return overview;
}

export async function getCustomerLoyaltyActivity(input: {
  userId: string;
  merchantId?: string;
  limit?: number;
  cursor?: string | null;
}) {
  const limit = Math.min(Math.max(input.limit ?? 5, 1), 50);

  const memberships = await prisma.customerMembership.findMany({
    where: {
      userId: input.userId,
      removedAt: null,
      ...(input.merchantId ? { merchantId: input.merchantId } : {}),
      merchant: { isActive: true },
    },
    select: { id: true },
  });
  const membershipIds = memberships.map((m) => m.id);
  if (membershipIds.length === 0) {
    return { items: [] as ActivityItem[], nextCursor: null as string | null, total: 0 };
  }

  const where = {
    customerMembershipId: { in: membershipIds },
    ...(input.merchantId ? { merchantId: input.merchantId } : {}),
  };

  const [total, rows] = await Promise.all([
    prisma.loyaltyTransaction.count({ where }),
    prisma.loyaltyTransaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      ...(input.cursor
        ? {
            cursor: { id: input.cursor },
            skip: 1,
          }
        : {}),
      select: txSelect,
    }),
  ]);

  const page = rows.slice(0, limit);
  const nextCursor = rows.length > limit ? page[page.length - 1]?.id ?? null : null;

  return {
    items: page.map(formatActivityFromTransaction),
    nextCursor,
    total,
  };
}

export async function getCustomerLoyaltyOverview(input: {
  userId: string;
  merchantId?: string;
  merchantSlug?: string;
  activityLimit?: number;
}): Promise<CustomerLoyaltyOverview> {
  let merchantId = input.merchantId;

  if (input.merchantSlug && !merchantId) {
    const merchant = await prisma.merchant.findFirst({
      where: { slug: input.merchantSlug, isActive: true },
      select: { id: true },
    });
    merchantId = merchant?.id;
  }

  const memberships = await prisma.customerMembership.findMany({
    where: {
      userId: input.userId,
      removedAt: null,
      ...(merchantId ? { merchantId } : {}),
      merchant: { isActive: true },
    },
    include: { merchant: { select: { id: true, name: true, slug: true, logoUrl: true } } },
    orderBy: { updatedAt: "desc" },
  });

  if (merchantId && memberships.length === 0) {
    return { nextReward: null, recentActivity: [], activityTotal: 0 };
  }

  const contexts = await Promise.all(
    memberships.map(async (membership) => ({
      membership,
      context: await getActiveMerchantLoyaltyContext(membership.merchantId),
    })),
  );

  const candidates: NextRewardCandidate[] = [];
  for (const { membership, context } of contexts) {
    if (!context?.isOperational) continue;
    if (context.rewards.length === 0) continue;
    candidates.push(
      ...buildNextRewardCandidates({
        merchantId: membership.merchantId,
        merchantName: membership.merchant.name,
        merchantSlug: membership.merchant.slug,
        merchantLogoUrl: membership.merchant.logoUrl,
        mode: context.mode,
        unit: context.unit,
        balance: membership.points,
        rewards: context.rewards,
      }),
    );
  }

  const nextReward = selectBestNextReward(candidates);

  const activity = await getCustomerLoyaltyActivity({
    userId: input.userId,
    merchantId,
    limit: input.activityLimit ?? 5,
  });

  return {
    nextReward,
    recentActivity: activity.items,
    activityTotal: activity.total,
  };
}

export function activityFromWalletEvent(input: {
  eventId: string;
  merchantId: string;
  merchantName: string;
  merchantSlug: string;
  merchantLogoUrl?: string | null;
  createdAt: string;
  type: string;
  delta: number;
  points?: number;
  rewardLabel?: string | null;
  purchaseAmountCents?: number | null;
  metadata?: HistoryTxMetadata | null;
}): ActivityItem {
  const unit = input.metadata?.unit ?? "points";
  const history = historyEntryLabel({
    type: input.type,
    pointsDelta: input.delta,
    reason: input.rewardLabel ?? null,
    metadata: input.metadata ?? null,
  });

  let detail = history.title;
  if (input.purchaseAmountCents != null && input.purchaseAmountCents > 0) {
    detail = `Achat de ${formatEurosFromCents(input.purchaseAmountCents)}`;
  } else if (input.type === "REDEEM_REWARD" && input.rewardLabel) {
    detail = `${input.rewardLabel} utilisé`;
  }

  return {
    id: input.eventId,
    merchantId: input.merchantId,
    merchantName: input.merchantName,
    merchantSlug: input.merchantSlug,
    merchantLogoUrl: input.merchantLogoUrl ?? null,
    createdAt: input.createdAt,
    type: input.type,
    title: history.title,
    detail,
    lineLabel: `${input.merchantName} · ${detail}`,
    deltaLabel: history.deltaLabel,
    formattedDate: formatActivityDate(new Date(input.createdAt)),
    purchaseAmountCents: input.purchaseAmountCents ?? null,
    status: "completed",
  };
}
