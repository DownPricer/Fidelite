import type { MerchantPayment, MerchantSubscription, SubscriptionFrequency } from "@prisma/client";

export function normalizeToMrr(amount: number, frequency: SubscriptionFrequency): number {
  if (frequency === "YEARLY") return amount / 12;
  return amount;
}

/** MRR encaissable : abonnements ACTIVE uniquement, montant > 0. */
export function computeBillableMrr(
  subscriptions: Pick<MerchantSubscription, "amount" | "frequency" | "status">[],
) {
  return subscriptions
    .filter((sub) => sub.status === "ACTIVE" && sub.amount > 0)
    .reduce((sum, sub) => sum + normalizeToMrr(sub.amount, sub.frequency), 0);
}

/** @deprecated Utiliser computeBillableMrr */
export function computeMrr(subscriptions: Pick<MerchantSubscription, "amount" | "frequency" | "status">[]) {
  return computeBillableMrr(subscriptions);
}

export function computeArr(mrr: number) {
  return mrr * 12;
}

/** Potentiel mensuel des essais (montant contractuel après conversion). */
export function computeTrialPotentialMrr(
  subscriptions: Pick<MerchantSubscription, "amount" | "frequency" | "status">[],
) {
  return subscriptions
    .filter((sub) => sub.status === "TRIAL" && sub.amount > 0)
    .reduce((sum, sub) => sum + normalizeToMrr(sub.amount, sub.frequency), 0);
}

export function countActiveTrials(
  subscriptions: Pick<MerchantSubscription, "status" | "trialEndsAt">[],
) {
  return subscriptions.filter((sub) => sub.status === "TRIAL").length;
}

export function sumCollectedRevenue(
  payments: Pick<MerchantPayment, "amount" | "status" | "paidAt">[],
  from: Date,
  to: Date,
) {
  return payments
    .filter(
      (payment) =>
        payment.status === "PAID" &&
        payment.paidAt &&
        payment.paidAt >= from &&
        payment.paidAt <= to,
    )
    .reduce((sum, payment) => sum + payment.amount, 0);
}

/** Revenu contractuel prévisionnel (ACTIVE + PAST_DUE + essais payants). */
export function sumContractualForecast(
  subscriptions: Pick<MerchantSubscription, "amount" | "frequency" | "status">[],
) {
  return subscriptions
    .filter((sub) => ["ACTIVE", "PAST_DUE"].includes(sub.status) && sub.amount > 0)
    .reduce((sum, sub) => sum + normalizeToMrr(sub.amount, sub.frequency), 0);
}

export type BillingSummary = {
  mrr: number;
  arr: number;
  collectedMonth: number;
  collectedYear: number;
  contractualForecast: number;
  trialPotentialMrr: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
  pastDueSubscriptions: number;
  expiringSoon: number;
  hasPaymentProvider: false;
};

export function buildBillingSummary(input: {
  subscriptions: MerchantSubscription[];
  payments: MerchantPayment[];
  now?: Date;
}): BillingSummary {
  const now = input.now ?? new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const active = input.subscriptions.filter((s) => s.status === "ACTIVE");
  const trial = input.subscriptions.filter((s) => s.status === "TRIAL");
  const pastDue = input.subscriptions.filter((s) => s.status === "PAST_DUE");
  const expiringSoon = input.subscriptions.filter(
    (s) => s.nextBillingAt && s.nextBillingAt <= in30Days && s.status === "ACTIVE",
  ).length;

  const mrr = computeBillableMrr(input.subscriptions);

  return {
    mrr,
    arr: computeArr(mrr),
    collectedMonth: sumCollectedRevenue(input.payments, monthStart, now),
    collectedYear: sumCollectedRevenue(input.payments, yearStart, now),
    contractualForecast: sumContractualForecast(input.subscriptions),
    trialPotentialMrr: computeTrialPotentialMrr(input.subscriptions),
    activeSubscriptions: active.length,
    trialSubscriptions: trial.length,
    pastDueSubscriptions: pastDue.length,
    expiringSoon,
    hasPaymentProvider: false,
  };
}
