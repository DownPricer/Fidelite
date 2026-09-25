import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import type { StripeModeValue } from "./stripe-mode";

/** Recharges proposées (centimes). Un montant libre est accepté à partir de MIN_TOPUP_CENTS. */
export const TOPUP_PRESETS_CENTS = [500, 1000, 2000] as const;
export const MIN_TOPUP_CENTS = 500;
export const MAX_TOPUP_CENTS = 50_000;

export function isValidTopupAmountCents(value: unknown): value is number {
  return (
    typeof value === "number" && Number.isInteger(value) && value >= MIN_TOPUP_CENTS && value <= MAX_TOPUP_CENTS
  );
}

/** Solde du mode demandé : les soldes TEST et LIVE sont totalement indépendants. */
export async function getMarketingBalanceCents(merchantId: string, mode: StripeModeValue): Promise<number> {
  const row = await prisma.marketingBalance.findUnique({
    where: { merchantId_mode: { merchantId, mode } },
    select: { balanceCents: true },
  });
  return row?.balanceCents ?? 0;
}

/**
 * Débit atomique d'un envoi payant, dans le SEUL mode demandé (un solde test ne finance jamais une
 * campagne réelle). L'UPDATE conditionnel (solde >= montant) garantit que le solde ne devient jamais
 * négatif, même en concurrence (la contrainte CHECK en base sert de filet). La ligne d'historique
 * porte campaignId UNIQUE : un envoi ne peut jamais être débité deux fois — en cas de doublon la
 * transaction appelante échoue et le débit est annulé. À appeler dans la transaction de confirmation.
 */
export async function debitForCampaign(
  tx: Prisma.TransactionClient,
  input: { merchantId: string; mode: StripeModeValue; campaignId: string; amountCents: number; description: string },
): Promise<{ ok: true; balanceAfterCents: number } | { ok: false }> {
  if (!Number.isInteger(input.amountCents) || input.amountCents <= 0) return { ok: false };

  const updated = await tx.$executeRaw`
    UPDATE "MarketingBalance"
    SET "balanceCents" = "balanceCents" - ${input.amountCents}, "updatedAt" = now()
    WHERE "merchantId" = ${input.merchantId}
      AND "mode" = ${input.mode}::"StripeMode"
      AND "balanceCents" >= ${input.amountCents}
  `;
  if (updated === 0) return { ok: false };

  const balance = await tx.marketingBalance.findUnique({
    where: { merchantId_mode: { merchantId: input.merchantId, mode: input.mode } },
    select: { balanceCents: true },
  });
  const balanceAfterCents = balance?.balanceCents ?? 0;

  await tx.marketingLedgerEntry.create({
    data: {
      merchantId: input.merchantId,
      mode: input.mode,
      type: "DEBIT",
      status: "PAID",
      amountCents: input.amountCents,
      balanceAfterCents,
      campaignId: input.campaignId,
      description: input.description,
    },
  });
  return { ok: true, balanceAfterCents };
}

/**
 * Crédite une recharge confirmée par webhook signé, dans le mode de l'ÉVÉNEMENT. La recharge doit
 * avoir été créée dans ce même mode : un événement d'un autre mode ne crédite rien. Idempotent :
 * seule la transition PENDING/FAILED → PAID (updateMany conditionnel) crédite le solde ; un événement
 * rejoué ne fait rien. Le montant crédité est celui enregistré côté serveur à la création de la session.
 */
export async function creditTopup(
  tx: Prisma.TransactionClient,
  input: {
    checkoutSessionId: string;
    mode: StripeModeValue;
    paymentIntentId: string | null;
    amountPaidCents: number | null;
  },
): Promise<"credited" | "already" | "unknown" | "amount_mismatch"> {
  const entry = await tx.marketingLedgerEntry.findUnique({
    where: { stripeCheckoutSessionId: input.checkoutSessionId },
  });
  if (!entry || entry.type !== "TOPUP" || entry.mode !== input.mode) return "unknown";
  if (entry.status === "PAID") return "already";
  if (entry.status === "CANCELLED") return "unknown";
  if (input.amountPaidCents !== null && input.amountPaidCents !== entry.amountCents) return "amount_mismatch";

  const claimed = await tx.marketingLedgerEntry.updateMany({
    where: { id: entry.id, status: { in: ["PENDING", "FAILED"] } },
    data: { status: "PAID", stripePaymentIntentId: input.paymentIntentId },
  });
  if (claimed.count === 0) return "already";

  const key = { merchantId: entry.merchantId, mode: entry.mode };
  await tx.marketingBalance.upsert({
    where: { merchantId_mode: key },
    create: { ...key, balanceCents: entry.amountCents },
    update: { balanceCents: { increment: entry.amountCents } },
  });
  const balance = await tx.marketingBalance.findUnique({
    where: { merchantId_mode: key },
    select: { balanceCents: true },
  });
  await tx.marketingLedgerEntry.update({
    where: { id: entry.id },
    data: { balanceAfterCents: balance?.balanceCents ?? null },
  });
  return "credited";
}

/**
 * Restitue le débit d'une campagne annulée ou refusée AVANT toute diffusion, dans le mode du débit
 * d'origine. Idempotent (reversalOfId unique). Ne s'applique jamais à une diffusion commencée : pas de
 * remboursement automatique d'un envoi partiel.
 */
export async function refundCampaignDebit(
  tx: Prisma.TransactionClient,
  campaignId: string,
  reason: string,
): Promise<boolean> {
  const debit = await tx.marketingLedgerEntry.findUnique({ where: { campaignId } });
  if (!debit || debit.type !== "DEBIT" || debit.status !== "PAID") return false;

  const already = await tx.marketingLedgerEntry.findUnique({ where: { reversalOfId: debit.id } });
  if (already) return false;

  const key = { merchantId: debit.merchantId, mode: debit.mode };
  await tx.marketingBalance.upsert({
    where: { merchantId_mode: key },
    create: { ...key, balanceCents: debit.amountCents },
    update: { balanceCents: { increment: debit.amountCents } },
  });
  const balance = await tx.marketingBalance.findUnique({
    where: { merchantId_mode: key },
    select: { balanceCents: true },
  });
  await tx.marketingLedgerEntry.create({
    data: {
      merchantId: debit.merchantId,
      mode: debit.mode,
      type: "REFUND",
      status: "PAID",
      amountCents: debit.amountCents,
      balanceAfterCents: balance?.balanceCents ?? null,
      reversalOfId: debit.id,
      description: reason,
    },
  });
  return true;
}
