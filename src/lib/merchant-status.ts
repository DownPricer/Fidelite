import type { MerchantStatus } from "@prisma/client";

export function merchantStatusFromLegacy(isActive: boolean): MerchantStatus {
  return isActive ? "ACTIVE" : "SUSPENDED";
}

export function syncIsActiveFromStatus(status: MerchantStatus): boolean {
  return status === "ACTIVE" || status === "TRIAL";
}

export function isMerchantOperational(status: MerchantStatus): boolean {
  return status === "ACTIVE" || status === "TRIAL";
}

export const MERCHANT_STATUS_LABELS: Record<MerchantStatus, string> = {
  DRAFT: "Brouillon",
  TRIAL: "Essai",
  ACTIVE: "Actif",
  SUSPENDED: "Suspendu",
  ARCHIVED: "Archivé",
};
