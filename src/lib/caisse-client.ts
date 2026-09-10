import type { LoyaltyTransactionView } from "./loyalty-commit";

async function postCaisse<T>(path: string, body: Record<string, unknown>) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await response.json()) as T & { error?: string };
  return { ok: response.ok, status: response.status, data };
}

export function newIdempotencyKey() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `idemp-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function previewCaisseTransaction(body: {
  grantId: string;
  action: "EARN" | "REDEEM";
  purchaseAmountCents?: number;
  rewardId?: string;
}) {
  return postCaisse<LoyaltyTransactionView>("/api/caisse/preview", body);
}

export function commitCaisseTransaction(body: {
  grantId: string;
  action: "EARN" | "REDEEM";
  purchaseAmountCents?: number;
  rewardId?: string;
  idempotencyKey: string;
}) {
  return postCaisse<LoyaltyTransactionView>("/api/caisse/commit", body);
}
