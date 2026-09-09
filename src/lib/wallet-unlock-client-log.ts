type ClientUnlockStep =
  | "SSE connecté"
  | "événement reçu"
  | "événement mis en attente"
  | "overlay monté"
  | "animation démarrée"
  | "acquittement envoyé"
  | "acquittement réussi";

export function logWalletUnlockClient(step: ClientUnlockStep, context: { eventId?: string } = {}) {
  console.info("[wallet-unlock-client]", step, context);
}
