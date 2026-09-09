import type { CardElement } from "./card-template-schema";

export const ELEMENT_DATA_KEYS: Record<CardElement["type"], string> = {
  logo: "merchant.logo",
  merchantName: "merchant.name",
  clientName: "customer.fullName",
  qr: "customer.qrCode",
  pointsBalance: "loyalty.balance",
  visitsCount: "loyalty.balance",
  progressText: "loyalty.progress",
  progressBar: "loyalty.progress",
  nextReward: "loyalty.nextReward",
  unlockedReward: "loyalty.unlockedReward",
  tierLevel: "loyalty.tier",
  expiryDate: "loyalty.expiry",
  staticText: "static.text",
};

export function defaultDataKey(type: CardElement["type"]) {
  return ELEMENT_DATA_KEYS[type];
}
