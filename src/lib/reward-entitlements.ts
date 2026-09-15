import { Prisma, type CustomerRewardEntitlement } from "@prisma/client";
import type { EvaluatedReward } from "./loyalty-rewards";
import { prisma } from "./prisma";

type EntitlementDb = Prisma.TransactionClient | typeof prisma;

function unitLabel(unit: string) {
  return unit === "visits" ? "passages" : "points";
}

export function entitlementToEvaluatedReward(
  entitlement: CustomerRewardEntitlement,
  merchantName: string,
): EvaluatedReward {
  const unit = unitLabel(entitlement.originalUnit);
  const expired = entitlement.expiresAt ? entitlement.expiresAt < new Date() : false;
  return {
    id: `entitlement:${entitlement.id}`,
    source: "ENTITLEMENT",
    name: entitlement.originalRewardName,
    description: entitlement.originalDescription,
    cost: 0,
    costLabel: `${entitlement.originalThreshold} ${unit} acquis`,
    merchantName,
    expiresAt: entitlement.expiresAt?.toISOString() ?? null,
    expiresLabel: entitlement.expiresAt
      ? `Expire le ${entitlement.expiresAt.toLocaleDateString("fr-FR")}`
      : "Sans expiration",
    conditions: [
      "Avantage conservé de votre ancien programme",
      `Solde acquis : ${entitlement.historicalBalance} ${unit}`,
    ],
    status: expired ? "Expiré" : entitlement.status === "AVAILABLE" ? "Disponible" : "Indisponible",
    available: entitlement.status === "AVAILABLE" && !expired,
    reason: expired ? "Cet avantage conservé a expiré." : null,
    threshold: entitlement.originalThreshold,
    thresholdUnit: entitlement.originalUnit === "points" ? "points" : "visits",
    minPurchaseCents: null,
    stackable: false,
  };
}

export async function listAvailableRewardEntitlements(
  db: EntitlementDb,
  input: { customerMembershipId: string },
) {
  return db.customerRewardEntitlement.findMany({
    where: {
      customerMembershipId: input.customerMembershipId,
      status: "AVAILABLE",
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
    orderBy: [{ acquiredAt: "asc" }],
  });
}

export async function markExpiredRewardEntitlements(
  db: EntitlementDb,
  input: { customerMembershipId: string; now?: Date },
) {
  const now = input.now ?? new Date();
  return db.customerRewardEntitlement.updateMany({
    where: {
      customerMembershipId: input.customerMembershipId,
      status: "AVAILABLE",
      expiresAt: { lt: now },
    },
    data: { status: "EXPIRED" },
  });
}
