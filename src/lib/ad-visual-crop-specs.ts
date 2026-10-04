/** Export bandeau (carré) — même valeur que AD_VISUAL_EXPORT_PX dans ad-visuals.ts, sans dépendance fs. */
const AD_BANNER_EXPORT_PX = 800;

export type AdVisualCropTarget = "banniere" | "google-wallet-hero";

export type AdVisualCropSpec = {
  target: AdVisualCropTarget;
  width: number;
  height: number;
  label: string;
  mime: "image/jpeg" | "image/png";
  ext: "jpg" | "png";
};

export const AD_BANNER_CROP_SPEC: AdVisualCropSpec = {
  target: "banniere",
  width: AD_BANNER_EXPORT_PX,
  height: AD_BANNER_EXPORT_PX,
  label: "Bandeau public",
  mime: "image/jpeg",
  ext: "jpg",
};

export const AD_GOOGLE_WALLET_HERO_CROP_SPEC: AdVisualCropSpec = {
  target: "google-wallet-hero",
  width: 1032,
  height: 812,
  label: "Visuel Google Wallet",
  mime: "image/png",
  ext: "png",
};

export const AD_VISUAL_CROP_SPECS: Record<AdVisualCropTarget, AdVisualCropSpec> = {
  banniere: AD_BANNER_CROP_SPEC,
  "google-wallet-hero": AD_GOOGLE_WALLET_HERO_CROP_SPEC,
};
