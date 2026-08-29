export type LoyaltySnapshot = {
  points: number;
  visitsRequired: number;
  rewardAvailable: boolean;
  progressLabel: string;
};

export function computeLoyalty(points: number, visitsRequired: number): LoyaltySnapshot {
  const safeRequired = Math.max(1, visitsRequired);
  const safePoints = Math.max(0, points);
  return {
    points: safePoints,
    visitsRequired: safeRequired,
    rewardAvailable: safePoints >= safeRequired,
    progressLabel: `${safePoints} / ${safeRequired} passages`,
  };
}

export function applyEarnVisit(points: number, visitsRequired: number) {
  const next = points + 1;
  return {
    delta: 1,
    ...computeLoyalty(next, visitsRequired),
  };
}

export function applyRedeemReward(points: number, visitsRequired: number) {
  const required = Math.max(1, visitsRequired);
  if (points < required) {
    throw new LoyaltyError("Aucune récompense disponible.");
  }
  const next = points - required;
  return {
    delta: -required,
    ...computeLoyalty(next, required),
  };
}

export function applyAdjustment(points: number, delta: number, reason: string, visitsRequired: number) {
  if (!reason.trim()) {
    throw new LoyaltyError("Un motif est obligatoire pour un ajustement.");
  }
  if (!Number.isInteger(delta) || delta === 0) {
    throw new LoyaltyError("L'ajustement doit être un entier non nul.");
  }
  const next = points + delta;
  if (next < 0) {
    throw new LoyaltyError("Le solde ne peut pas devenir négatif.");
  }
  return {
    delta,
    ...computeLoyalty(next, visitsRequired),
  };
}

export class LoyaltyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LoyaltyError";
  }
}
