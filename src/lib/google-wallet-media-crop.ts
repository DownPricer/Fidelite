import { centeredCropState, clampCropState, computeCoverCrop, type CropState } from "./cover-crop";

export type { CropState };
export { centeredCropState, clampCropState, computeCoverCrop };

export type GoogleWalletMediaKind = "hero" | "logo" | "wide-logo";

export type GoogleWalletCropSpec = {
  kind: GoogleWalletMediaKind;
  width: number;
  height: number;
  filename: string;
  label: string;
};

export const GOOGLE_WALLET_CROP_SPECS: Record<GoogleWalletMediaKind, GoogleWalletCropSpec> = {
  hero: {
    kind: "hero",
    width: 1032,
    height: 812,
    filename: "google-wallet-hero.png",
    label: "Hero",
  },
  logo: {
    kind: "logo",
    width: 660,
    height: 660,
    filename: "google-wallet-logo.png",
    label: "Logo carré",
  },
  "wide-logo": {
    kind: "wide-logo",
    width: 1280,
    height: 400,
    filename: "google-wallet-wide-logo.png",
    label: "Logo large",
  },
};

export async function fileToObjectUrl(file: File) {
  return URL.createObjectURL(file);
}

export async function exportGoogleWalletCrop(input: {
  image: CanvasImageSource;
  sourceWidth: number;
  sourceHeight: number;
  spec: GoogleWalletCropSpec;
  state: CropState;
}) {
  const canvas = document.createElement("canvas");
  canvas.width = input.spec.width;
  canvas.height = input.spec.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponible.");
  const crop = computeCoverCrop({
    sourceWidth: input.sourceWidth,
    sourceHeight: input.sourceHeight,
    outputWidth: input.spec.width,
    outputHeight: input.spec.height,
    state: input.state,
  });
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.clearRect(0, 0, input.spec.width, input.spec.height);
  ctx.drawImage(input.image, crop.drawX, crop.drawY, crop.drawWidth, crop.drawHeight);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("Export PNG impossible.");
  return new File([blob], input.spec.filename, { type: "image/png" });
}
