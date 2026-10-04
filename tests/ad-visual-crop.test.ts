import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { AD_BANNER_CROP_SPEC } from "../src/lib/ad-visual-crop-specs";
import { renderAdVisualCrop } from "../src/lib/ad-visual-crop-server";
import { centeredCropState, coverCropExtractRegion } from "../src/lib/cover-crop";

describe("coverCropExtractRegion et renderAdVisualCrop", () => {
  it("produit le même recadrage côté région et côté sharp", async () => {
    const sourceWidth = 1600;
    const sourceHeight = 900;
    const state = { x: 0.35, y: 0.62, zoom: 1.25 };
    const spec = AD_BANNER_CROP_SPEC;

    const region = coverCropExtractRegion({
      sourceWidth,
      sourceHeight,
      outputWidth: spec.width,
      outputHeight: spec.height,
      state,
    });

    const sourceBuffer = await sharp({
      create: { width: sourceWidth, height: sourceHeight, channels: 3, background: { r: 40, g: 120, b: 200 } },
    })
      .png()
      .toBuffer();

    const manual = await sharp(sourceBuffer).extract(region).resize(spec.width, spec.height, { fit: "fill" }).jpeg({ quality: 92 }).toBuffer();
    const pipeline = await renderAdVisualCrop({ buffer: sourceBuffer, spec, state });

    const manualMeta = await sharp(manual).raw().toBuffer({ resolveWithObject: true });
    const pipelineMeta = await sharp(pipeline).raw().toBuffer({ resolveWithObject: true });

    expect(pipelineMeta.info.width).toBe(spec.width);
    expect(pipelineMeta.info.height).toBe(spec.height);
    expect(manualMeta.data.length).toBe(pipelineMeta.data.length);

    let diff = 0;
    for (let i = 0; i < manualMeta.data.length; i += 1) {
      if (manualMeta.data[i] !== pipelineMeta.data[i]) diff += 1;
    }
    expect(diff).toBeLessThan(manualMeta.data.length * 0.02);
  });

  it("utilise l'état centré par défaut sans décalage", () => {
    const sourceWidth = 1600;
    const sourceHeight = 900;
    const state = centeredCropState();
    const region = coverCropExtractRegion({
      sourceWidth,
      sourceHeight,
      outputWidth: 800,
      outputHeight: 800,
      state,
    });
    expect(region.left).toBeGreaterThanOrEqual(0);
    expect(region.top).toBeGreaterThanOrEqual(0);
    expect(region.left + region.width).toBeLessThanOrEqual(sourceWidth + 1);
    expect(region.top + region.height).toBeLessThanOrEqual(sourceHeight + 1);
  });
});
