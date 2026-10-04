import sharp from "sharp";
import { coverCropExtractRegion, type CropState } from "./cover-crop";
import type { AdVisualCropSpec } from "./ad-visual-crop-specs";

/** Applique l'orientation EXIF puis recadre avec les coordonnées normalisées du commerçant / super-admin. */
export async function renderAdVisualCrop(input: { buffer: Buffer; spec: AdVisualCropSpec; state: CropState }) {
  const oriented = sharp(input.buffer).rotate();
  const meta = await oriented.metadata();
  const sourceWidth = meta.width ?? 0;
  const sourceHeight = meta.height ?? 0;
  if (sourceWidth < 1 || sourceHeight < 1) throw new Error("Image illisible.");

  const region = coverCropExtractRegion({
    sourceWidth,
    sourceHeight,
    outputWidth: input.spec.width,
    outputHeight: input.spec.height,
    state: input.state,
  });

  let pipeline = oriented.extract(region).resize(input.spec.width, input.spec.height, { fit: "fill" });
  if (input.spec.mime === "image/jpeg") {
    pipeline = pipeline.jpeg({ quality: 92, mozjpeg: true });
  } else {
    pipeline = pipeline.png();
  }
  return pipeline.toBuffer();
}
