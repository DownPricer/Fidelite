export type GoogleWalletMediaKind = "hero" | "logo" | "wide-logo";

export type GoogleWalletCropSpec = {
  kind: GoogleWalletMediaKind;
  width: number;
  height: number;
  filename: string;
  label: string;
};

export type CropState = {
  x: number;
  y: number;
  zoom: number;
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

export function centeredCropState(): CropState {
  return { x: 0.5, y: 0.5, zoom: 1 };
}

export function clampCropState(state: CropState): CropState {
  return {
    x: Math.min(1, Math.max(0, state.x)),
    y: Math.min(1, Math.max(0, state.y)),
    zoom: Math.min(4, Math.max(1, state.zoom)),
  };
}

export function computeCoverCrop(input: {
  sourceWidth: number;
  sourceHeight: number;
  outputWidth: number;
  outputHeight: number;
  state: CropState;
}) {
  const state = clampCropState(input.state);
  const baseScale = Math.max(input.outputWidth / input.sourceWidth, input.outputHeight / input.sourceHeight);
  const scaledWidth = input.sourceWidth * baseScale * state.zoom;
  const scaledHeight = input.sourceHeight * baseScale * state.zoom;
  const overflowX = Math.max(0, scaledWidth - input.outputWidth);
  const overflowY = Math.max(0, scaledHeight - input.outputHeight);

  return {
    drawWidth: scaledWidth,
    drawHeight: scaledHeight,
    drawX: -overflowX * state.x,
    drawY: -overflowY * state.y,
  };
}

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
