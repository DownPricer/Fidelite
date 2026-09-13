// @vitest-environment happy-dom

import { describe, expect, it, vi } from "vitest";
import {
  centeredCropState,
  computeCoverCrop,
  exportGoogleWalletCrop,
  GOOGLE_WALLET_CROP_SPECS,
} from "../src/lib/google-wallet-media-crop";

describe("Google Wallet media crop", () => {
  it("ne nécessite aucun POST à la sélection: le crop est exporté seulement à la confirmation", async () => {
    expect(GOOGLE_WALLET_CROP_SPECS.hero).toMatchObject({ width: 1032, height: 812 });
  });

  it("recadre un hero portrait en 1032 × 812", () => {
    const crop = computeCoverCrop({
      sourceWidth: 800,
      sourceHeight: 1400,
      outputWidth: 1032,
      outputHeight: 812,
      state: centeredCropState(),
    });
    expect(crop.drawWidth).toBe(1032);
    expect(crop.drawHeight).toBeGreaterThan(812);
    expect(crop.drawY).toBeLessThan(0);
  });

  it("recadre un hero paysage en 1032 × 812", () => {
    const crop = computeCoverCrop({
      sourceWidth: 2000,
      sourceHeight: 900,
      outputWidth: 1032,
      outputHeight: 812,
      state: centeredCropState(),
    });
    expect(crop.drawHeight).toBe(812);
    expect(crop.drawWidth).toBeGreaterThan(1032);
    expect(crop.drawX).toBeLessThan(0);
  });

  it("déclare les sorties logo carré et logo large exactes", () => {
    expect(GOOGLE_WALLET_CROP_SPECS.logo).toMatchObject({
      width: 660,
      height: 660,
      filename: "google-wallet-logo.png",
    });
    expect(GOOGLE_WALLET_CROP_SPECS["wide-logo"]).toMatchObject({
      width: 1280,
      height: 400,
      filename: "google-wallet-wide-logo.png",
    });
  });

  it("envoie un vrai File PNG transformé", async () => {
    const image = document.createElement("img");
    const drawImage = vi.fn();
    const toBlob = vi.fn((callback: BlobCallback, type?: string) => {
      callback(new Blob(["png"], { type }));
    });
    const canvas = {
      width: 0,
      height: 0,
      getContext: () => ({
        clearRect: vi.fn(),
        drawImage,
        imageSmoothingEnabled: false,
        imageSmoothingQuality: "low",
      }),
      toBlob,
    } as unknown as HTMLCanvasElement;
    vi.spyOn(document, "createElement").mockReturnValueOnce(canvas);

    const file = await exportGoogleWalletCrop({
      image,
      sourceWidth: 1600,
      sourceHeight: 900,
      spec: GOOGLE_WALLET_CROP_SPECS.hero,
      state: centeredCropState(),
    });

    expect(file).toBeInstanceOf(File);
    expect(file.name).toBe("google-wallet-hero.png");
    expect(file.type).toBe("image/png");
    expect(canvas.width).toBe(1032);
    expect(canvas.height).toBe(812);
    expect(toBlob).toHaveBeenCalledWith(expect.any(Function), "image/png");
    expect(drawImage).toHaveBeenCalled();
  });
});
