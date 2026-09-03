import type { LoyaltyTxType } from "@prisma/client";

export type HistoryCategory = "earned" | "used" | "expired" | "correction" | "pending";

export type HistoryEntry = {
  id: string;
  merchantId: string | null;
  merchantName: string;
  merchantLogoUrl: string | null;
  createdAt: string;
  operationType: string;
  operationLabel: string;
  pointsDelta: number | null;
  passagesDelta: number | null;
  amountCents: number | null;
  reason: string | null;
  status: "completed" | "pending" | "cancelled";
  category: HistoryCategory;
  tone: "gain" | "use" | "expire" | "correction" | "pending";
};

export type BenefitEntry = {
  id: string;
  merchantId: string;
  merchantName: string;
  merchantLogoUrl: string | null;
  benefitName: string;
  usedAt: string;
  costLabel: string;
  status: "used" | "cancelled" | "expired" | "pending";
  expiresBeforeUse: string | null;
};

function mapLoyaltyTone(type: LoyaltyTxType, delta: number): HistoryEntry["tone"] {
  if (type === "ADJUSTMENT") return "correction";
  if (type === "REDEEM_REWARD") return "use";
  return delta >= 0 ? "gain" : "use";
}

function mapLoyaltyCategory(type: LoyaltyTxType, delta: number): HistoryCategory {
  if (type === "ADJUSTMENT") return "correction";
  if (type === "REDEEM_REWARD") return "used";
  return delta >= 0 ? "earned" : "used";
}

export function formatLoyaltyEntry(input: {
  id: string;
  type: LoyaltyTxType;
  pointsDelta: number;
  reason: string | null;
  createdAt: Date;
  merchant: { id: string; name: string; logoUrl: string | null };
  visitsRequired?: number;
}): HistoryEntry {
  const { type, pointsDelta } = input;
  let operationType = "Mouvement";
  let operationLabel = "";
  let passagesDelta: number | null = null;
  let pointsDeltaOut: number | null = null;

  if (type === "EARN_VISIT") {
    operationType = "Passage ajouté";
    passagesDelta = pointsDelta;
    operationLabel = `+${Math.abs(pointsDelta)} passage${Math.abs(pointsDelta) > 1 ? "s" : ""}`;
  } else if (type === "REDEEM_REWARD") {
    operationType = "Passages utilisés";
    passagesDelta = pointsDelta;
    operationLabel = `−${Math.abs(pointsDelta)} passage${Math.abs(pointsDelta) > 1 ? "s" : ""}`;
  } else if (type === "ADJUSTMENT") {
    operationType = "Correction";
    if (Math.abs(pointsDelta) === 1) {
      passagesDelta = pointsDelta;
      operationLabel =
        pointsDelta > 0
          ? `Correction +${pointsDelta} passage`
          : `Correction ${pointsDelta} passage`;
    } else {
      pointsDeltaOut = pointsDelta;
      operationLabel =
        pointsDelta > 0
          ? `Correction +${pointsDelta} points`
          : `Correction ${pointsDelta} points`;
    }
  }

  return {
    id: input.id,
    merchantId: input.merchant.id,
    merchantName: input.merchant.name,
    merchantLogoUrl: input.merchant.logoUrl,
    createdAt: input.createdAt.toISOString(),
    operationType,
    operationLabel,
    pointsDelta: pointsDeltaOut,
    passagesDelta,
    amountCents: null,
    reason: input.reason,
    status: "completed",
    category: mapLoyaltyCategory(type, pointsDelta),
    tone: mapLoyaltyTone(type, pointsDelta),
  };
}

export function formatFifeLifeEntry(input: {
  id: string;
  delta: number;
  reason: string;
  createdAt: Date;
  merchantName?: string | null;
  merchantLogoUrl?: string | null;
}): HistoryEntry {
  const isExpired = /expir/i.test(input.reason);
  const isCorrection = /correction|ajust/i.test(input.reason);

  let category: HistoryCategory = input.delta >= 0 ? "earned" : "used";
  let tone: HistoryEntry["tone"] = input.delta >= 0 ? "gain" : "use";
  let operationType = input.delta >= 0 ? "Points gagnés" : "Points utilisés";

  if (isExpired) {
    category = "expired";
    tone = "expire";
    operationType = "Points expirés";
  } else if (isCorrection) {
    category = "correction";
    tone = "correction";
    operationType = "Correction";
  }

  const abs = Math.abs(input.delta);
  const operationLabel = isExpired
    ? `${abs} points expirés`
    : input.delta >= 0
      ? `+${abs} points`
      : `−${abs} points`;

  return {
    id: `fl-${input.id}`,
    merchantId: null,
    merchantName: input.merchantName ?? "Fife Life",
    merchantLogoUrl: input.merchantLogoUrl ?? null,
    createdAt: input.createdAt.toISOString(),
    operationType,
    operationLabel,
    pointsDelta: input.delta,
    passagesDelta: null,
    amountCents: null,
    reason: input.reason,
    status: "completed",
    category,
    tone,
  };
}

export function formatBenefitEntry(input: {
  id: string;
  createdAt: Date;
  pointsDelta: number;
  reason: string | null;
  merchant: { id: string; name: string; logoUrl: string | null };
  rewardLabel: string;
  visitsRequired: number;
}): BenefitEntry {
  const cost =
    input.pointsDelta !== 0
      ? `${Math.abs(input.pointsDelta)} passage${Math.abs(input.pointsDelta) > 1 ? "s" : ""}`
      : `${input.visitsRequired} passages`;

  return {
    id: input.id,
    merchantId: input.merchant.id,
    merchantName: input.merchant.name,
    merchantLogoUrl: input.merchant.logoUrl,
    benefitName: input.rewardLabel,
    usedAt: input.createdAt.toISOString(),
    costLabel: cost,
    status: "used",
    expiresBeforeUse: null,
  };
}

export function groupHistoryByDate(entries: HistoryEntry[]) {
  const groups = new Map<string, HistoryEntry[]>();
  for (const entry of entries) {
    const key = new Date(entry.createdAt).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const list = groups.get(key) ?? [];
    list.push(entry);
    groups.set(key, list);
  }
  return Array.from(groups.entries()).map(([date, items]) => ({ date, items }));
}
