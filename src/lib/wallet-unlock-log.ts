type UnlockLogStep =
  | "scan validé"
  | "carte créée ou réactivée"
  | "événement créé"
  | "événement envoyé"
  | "événement reçu"
  | "animation démarrée"
  | "événement acquitté";

type UnlockLogContext = {
  eventId?: string;
  merchantId?: string;
  membershipId?: string;
  userId?: string;
  eventType?: string;
};

export function logWalletUnlock(step: UnlockLogStep, context: UnlockLogContext = {}) {
  console.info("[wallet-unlock]", step, context);
}
