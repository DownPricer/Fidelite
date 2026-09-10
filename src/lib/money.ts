export const MAX_PURCHASE_EUROS = 100_000;
export const MAX_PURCHASE_CENTS = MAX_PURCHASE_EUROS * 100;

export class MoneyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MoneyError";
  }
}

export function eurosToCents(euros: number): number {
  if (!Number.isFinite(euros)) {
    throw new MoneyError("Montant invalide.");
  }
  return Math.round(euros * 100);
}

export function centsToEuros(cents: number): number {
  return cents / 100;
}

export function formatEurosFromCents(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(Math.trunc(cents));
  const euros = Math.floor(abs / 100);
  const dec = String(abs % 100).padStart(2, "0");
  return `${sign}${euros.toLocaleString("fr-FR")},${dec} €`;
}

export function parsePurchaseAmountToCents(raw: string): number {
  const trimmed = raw.trim().replace(/\s/g, "").replace(/€/g, "");
  if (!trimmed) {
    throw new MoneyError("Indiquez le montant de l'achat.");
  }
  if (trimmed.startsWith("-")) {
    throw new MoneyError("Le montant ne peut pas être négatif.");
  }

  const normalized = trimmed.replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    throw new MoneyError("Montant invalide. Utilisez le format 12,50.");
  }

  const [whole = "0", fraction = ""] = normalized.split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  if (!Number.isInteger(cents) || cents < 0) {
    throw new MoneyError("Montant invalide.");
  }
  if (cents > MAX_PURCHASE_CENTS) {
    throw new MoneyError(`Le montant ne peut pas dépasser ${formatEurosFromCents(MAX_PURCHASE_CENTS)}.`);
  }
  return cents;
}

export function tryParsePurchaseAmountToCents(raw: string): { ok: true; cents: number } | { ok: false; error: string } {
  try {
    return { ok: true, cents: parsePurchaseAmountToCents(raw) };
  } catch (error) {
    return { ok: false, error: error instanceof MoneyError ? error.message : "Montant invalide." };
  }
}

export function purchaseAmountCentsFromUnknown(input: {
  purchaseAmountCents?: number | null;
  purchaseAmount?: number | null;
}): number | undefined {
  if (input.purchaseAmountCents !== undefined && input.purchaseAmountCents !== null) {
    if (!Number.isInteger(input.purchaseAmountCents) || input.purchaseAmountCents < 0) {
      throw new MoneyError("Le montant doit être exprimé en centimes entiers.");
    }
    if (input.purchaseAmountCents > MAX_PURCHASE_CENTS) {
      throw new MoneyError(`Le montant ne peut pas dépasser ${formatEurosFromCents(MAX_PURCHASE_CENTS)}.`);
    }
    return input.purchaseAmountCents;
  }
  if (input.purchaseAmount !== undefined && input.purchaseAmount !== null) {
    if (!Number.isFinite(input.purchaseAmount) || input.purchaseAmount < 0) {
      throw new MoneyError("Montant invalide.");
    }
    const cents = eurosToCents(input.purchaseAmount);
    if (cents > MAX_PURCHASE_CENTS) {
      throw new MoneyError(`Le montant ne peut pas dépasser ${formatEurosFromCents(MAX_PURCHASE_CENTS)}.`);
    }
    return cents;
  }
  return undefined;
}
