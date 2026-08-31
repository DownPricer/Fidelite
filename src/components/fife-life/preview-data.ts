import type { MerchantCardData } from "./types";

export const PREVIEW_CARDS: MerchantCardData[] = [
  {
    id: "preview-hotel",
    merchantId: "m-hotel",
    slug: "prism-hotel",
    name: "Prism Hôtel",
    logoUrl: null,
    primaryColor: "#7085ff",
    points: 7,
    visitsRequired: 10,
    rewardLabel: "Nuit offerte",
  },
  {
    id: "preview-nova",
    merchantId: "m-nova",
    slug: "brasserie-nova",
    name: "Brasserie Nova",
    logoUrl: null,
    primaryColor: "#e774ff",
    points: 4,
    visitsRequired: 8,
    rewardLabel: "Dessert offert",
  },
  {
    id: "preview-cinema",
    merchantId: "m-cinema",
    slug: "cinema-lumiere",
    name: "Cinéma Lumière",
    logoUrl: null,
    primaryColor: "#8557ff",
    points: 9,
    visitsRequired: 10,
    rewardLabel: "Séance offerte",
  },
];

export const PREVIEW_HISTORY: import("./types").CardHistoryItem[] = [
  {
    id: "h1",
    type: "EARN_VISIT",
    pointsDelta: 480,
    reason: "Brasserie Nova",
    createdAt: new Date(Date.now() - 3600_000).toISOString(),
  },
  {
    id: "h2",
    type: "EARN_VISIT",
    pointsDelta: 260,
    reason: "Cinéma Lumière",
    createdAt: new Date(Date.now() - 86400_000).toISOString(),
  },
  {
    id: "h3",
    type: "REDEEM_REWARD",
    pointsDelta: -1200,
    reason: "Prism Hôtel · Check-in",
    createdAt: new Date(Date.now() - 172800_000).toISOString(),
  },
];

export const PREVIEW_QR =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect fill="#fff" width="32" height="32"/><rect fill="#0F172A" x="2" y="2" width="8" height="8"/><rect fill="#0F172A" x="22" y="2" width="8" height="8"/><rect fill="#0F172A" x="2" y="22" width="8" height="8"/><rect fill="#0F172A" x="13" y="13" width="6" height="6"/><rect fill="#0F172A" x="12" y="4" width="2" height="2"/><rect fill="#0F172A" x="16" y="4" width="2" height="2"/><rect fill="#0F172A" x="18" y="8" width="2" height="2"/><rect fill="#0F172A" x="4" y="12" width="2" height="2"/><rect fill="#0F172A" x="8" y="16" width="2" height="2"/><rect fill="#0F172A" x="20" y="18" width="2" height="2"/><rect fill="#0F172A" x="24" y="14" width="2" height="2"/><rect fill="#0F172A" x="14" y="22" width="2" height="2"/><rect fill="#0F172A" x="18" y="26" width="2" height="2"/></svg>`,
  );
