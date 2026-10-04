/** État de cadrage normalisé — unique source de vérité éditeur / aperçu / export serveur. */
export type CropState = {
  /** Position horizontale du centre visible (0 = bord gauche, 1 = bord droit). */
  x: number;
  /** Position verticale du centre visible (0 = haut, 1 = bas). */
  y: number;
  /** Zoom ≥ 1 (1 = couverture minimale du cadre). */
  zoom: number;
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

export type CoverCropRect = {
  drawWidth: number;
  drawHeight: number;
  drawX: number;
  drawY: number;
};

/** Même règle « object-cover » pour l'aperçu CSS et le canvas / sharp. */
export function computeCoverCrop(input: {
  sourceWidth: number;
  sourceHeight: number;
  outputWidth: number;
  outputHeight: number;
  state: CropState;
}): CoverCropRect {
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

/** Région à extraire dans l'image source (pixels), après orientation EXIF appliquée. */
export function coverCropExtractRegion(input: {
  sourceWidth: number;
  sourceHeight: number;
  outputWidth: number;
  outputHeight: number;
  state: CropState;
}) {
  const crop = computeCoverCrop(input);
  const { sourceWidth, sourceHeight, outputWidth, outputHeight } = input;
  const left = Math.max(0, (-crop.drawX / crop.drawWidth) * sourceWidth);
  const top = Math.max(0, (-crop.drawY / crop.drawHeight) * sourceHeight);
  const width = Math.min(sourceWidth - left, (outputWidth / crop.drawWidth) * sourceWidth);
  const height = Math.min(sourceHeight - top, (outputHeight / crop.drawHeight) * sourceHeight);
  return {
    left: Math.round(left),
    top: Math.round(top),
    width: Math.max(1, Math.round(width)),
    height: Math.max(1, Math.round(height)),
  };
}
