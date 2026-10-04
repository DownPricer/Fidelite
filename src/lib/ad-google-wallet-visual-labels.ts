import type { AdGoogleWalletVisualStatus } from "@prisma/client";

export const WALLET_VISUAL_STATUS_LABELS: Record<AdGoogleWalletVisualStatus, string> = {
  NOT_PREPARED: "À préparer",
  SENT_TO_MERCHANT: "Envoyé au commerçant",
  CHANGES_REQUESTED: "Modification demandée",
  APPROVED: "Validé",
};
