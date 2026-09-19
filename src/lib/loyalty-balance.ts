import type { LoyaltyMode, Prisma } from "@prisma/client";
import { loyaltyUnitForMode, type LoyaltyUnit } from "./loyalty-labels";

export type LoyaltyBalanceFields = {
  points?: number | null;
  pointsBalance?: number | null;
  visitsBalance?: number | null;
};

export function balanceFieldForUnit(unit: LoyaltyUnit): "pointsBalance" | "visitsBalance" {
  return unit === "points" ? "pointsBalance" : "visitsBalance";
}

export function legacyPointsForUnitBalance(input: LoyaltyBalanceFields, mode: LoyaltyMode) {
  return loyaltyBalanceForMode(input, mode);
}

export function loyaltyBalanceForMode(input: LoyaltyBalanceFields, mode: LoyaltyMode) {
  const unit = loyaltyUnitForMode(mode);
  if (unit === "points") return Math.max(0, Math.trunc(input.pointsBalance ?? input.points ?? 0));
  return Math.max(0, Math.trunc(input.visitsBalance ?? input.points ?? 0));
}

export function loyaltyBalanceForUnit(input: LoyaltyBalanceFields, unit: LoyaltyUnit) {
  if (unit === "points") return Math.max(0, Math.trunc(input.pointsBalance ?? input.points ?? 0));
  return Math.max(0, Math.trunc(input.visitsBalance ?? input.points ?? 0));
}

export function incrementBalanceData(mode: LoyaltyMode, delta: number): Prisma.CustomerMembershipUpdateInput {
  const unit = loyaltyUnitForMode(mode);
  const field = balanceFieldForUnit(unit);
  return {
    [field]: { increment: delta },
    points: { increment: delta },
  } as Prisma.CustomerMembershipUpdateInput;
}

export function setActiveBalanceData(mode: LoyaltyMode, balance: number): Prisma.CustomerMembershipUpdateInput {
  const field = balanceFieldForUnit(loyaltyUnitForMode(mode));
  return {
    [field]: balance,
    points: balance,
  } as Prisma.CustomerMembershipUpdateInput;
}

export function selectLoyaltyBalances() {
  return {
    points: true,
    pointsBalance: true,
    visitsBalance: true,
  } as const;
}
