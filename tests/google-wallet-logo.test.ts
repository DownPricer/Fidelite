import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const LOGO_PATH = resolve(process.cwd(), "public/google-wallet/fife-life-logo.png");
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function readPngDimensions(buffer: Buffer) {
  expect(buffer.subarray(0, 8)).toEqual(PNG_SIGNATURE);
  expect(buffer.subarray(12, 16).toString("ascii")).toBe("IHDR");
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

describe("logo public Google Wallet Fife Life", () => {
  it("existe dans public/ et est un PNG 1024×1024 valide", () => {
    const buffer = readFileSync(LOGO_PATH);
    expect(buffer.length).toBeGreaterThan(512);

    const { width, height } = readPngDimensions(buffer);
    expect(width).toBe(1024);
    expect(height).toBe(1024);
  });

  it("est servi statiquement par Next.js sans route authentifiée", () => {
    const middleware = readFileSync(resolve(process.cwd(), "src/middleware.ts"), "utf8");
    expect(middleware).toContain("png|jpg|jpeg|gif|webp");
  });
});
