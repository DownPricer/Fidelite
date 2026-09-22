import type { Prisma } from "@prisma/client";

/** Version de la politique de consentement — à faire évoluer si les cases/libellés changent. */
export const CONSENT_POLICY_VERSION = "2026-09-22";

/** Champs de prospection soumis à consentement explicite (jamais précochés). */
export const CONSENT_FIELDS = [
  "notifyMerchantOffers",
  "notifyFifeLifeNews",
  "adsMerchantPush",
  "adsMerchantEmail",
  "adsNetworkPush",
  "adsNetworkEmail",
  "consentPersonalizedOffers",
  "consentMarketing",
  "consentAnalytics",
] as const;

export type ConsentField = (typeof CONSENT_FIELDS)[number];

export function extractConsentChanges(patch: Record<string, unknown>): Partial<Record<ConsentField, boolean>> {
  const changes: Partial<Record<ConsentField, boolean>> = {};
  for (const field of CONSENT_FIELDS) {
    if (typeof patch[field] === "boolean") {
      changes[field] = patch[field] as boolean;
    }
  }
  return changes;
}

/**
 * Journalise chaque changement de consentement (append-only, jamais réécrit) : date, source,
 * version de la politique, valeur — Partie 6 ("date, source et version du consentement
 * enregistrées").
 */
export async function recordConsentEvents(
  tx: Pick<Prisma.TransactionClient, "consentEvent">,
  input: { userId: string; changes: Partial<Record<ConsentField, boolean>>; source: string; version?: string },
) {
  const entries = Object.entries(input.changes) as [ConsentField, boolean][];
  if (!entries.length) return;

  await tx.consentEvent.createMany({
    data: entries.map(([field, value]) => ({
      userId: input.userId,
      field,
      value,
      source: input.source,
      version: input.version ?? CONSENT_POLICY_VERSION,
    })),
  });
}
