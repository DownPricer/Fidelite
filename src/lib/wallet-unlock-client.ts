import type { WalletEventPayload } from "@/lib/wallet-unlock";

/** Ne pas lancer ni acquitter tant que l’onglet n’est pas visible. */
export function shouldDeferUnlockPlayback(isDocumentVisible: boolean) {
  return !isDocumentVisible;
}

/** Peut-on ajouter cet événement à la file (dédup par id uniquement) ? */
export function canEnqueueUnlockEvent(
  event: Pick<WalletEventPayload, "id" | "acknowledgedAt">,
  queuedOrPlayingIds: Set<string>,
) {
  if (event.acknowledgedAt) return false;
  if (queuedOrPlayingIds.has(event.id)) return false;
  return true;
}

/** Une connexion SSE ne doit envoyer qu’une fois chaque événement. */
export function shouldSendSseEvent(eventId: string, sentEventIds: Set<string>) {
  return !sentEventIds.has(eventId);
}
