import { z } from "zod";
import { AD_VISUAL_CROP_SPECS, type AdVisualCropTarget } from "./ad-visual-crop-specs";
import { renderAdVisualCrop } from "./ad-visual-crop-server";
import { clampCropState, type CropState } from "./cover-crop";
import {
  inspectAdImage,
  isExactBannerFormat,
  readAdVisualFileByUrl,
  saveAdVisualFile,
  validateStagedAdFile,
} from "./ad-visuals";

export const cropStateSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
  zoom: z.number().min(1).max(4),
});

export function parseCropState(raw: unknown): CropState {
  return clampCropState(cropStateSchema.parse(raw));
}

/** Génère le fichier final côté serveur (EXIF + cadrage normalisé) à partir d'un original déjà téléversé. */
export async function applyAdVisualCropFromStagedOriginal(input: {
  merchantId: string;
  originalUrl: string;
  target: AdVisualCropTarget;
  crop: CropState;
}) {
  const staged = await validateStagedAdFile(input.originalUrl, input.merchantId, { requireExactFormat: false });
  if (!staged.ok) return staged;
  const buffer = await readAdVisualFileByUrl(input.originalUrl);
  if (!buffer) return { ok: false as const, error: "Fichier d'origine introuvable." };

  const spec = AD_VISUAL_CROP_SPECS[input.target];
  let outBuffer: Buffer;
  try {
    outBuffer = await renderAdVisualCrop({ buffer, spec, state: input.crop });
  } catch {
    return { ok: false as const, error: "Recadrage impossible sur ce fichier." };
  }

  const inspected = inspectAdImage(outBuffer);
  if (!inspected.ok) return inspected;
  const kind = input.target === "banniere" ? "banniere" : "google-wallet-hero";
  if (kind === "banniere" && !isExactBannerFormat(inspected.image.width, inspected.image.height)) {
    return { ok: false as const, error: "Le bandeau exporté n'est pas au format attendu." };
  }
  if (kind === "google-wallet-hero" && (inspected.image.width !== 1032 || inspected.image.height !== 812)) {
    return { ok: false as const, error: "Le visuel Google Wallet exporté n'est pas au format attendu." };
  }

  const url = await saveAdVisualFile(input.merchantId, kind, outBuffer, inspected.image.ext);
  return {
    ok: true as const,
    url,
    originalUrl: input.originalUrl,
    width: inspected.image.width,
    height: inspected.image.height,
    reframed: true,
  };
}
