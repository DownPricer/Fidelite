import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeAdDb } from "./helpers/fake-ad-db";

const fake = createFakeAdDb();
const { tables } = fake;

vi.mock("@/lib/prisma", () => ({ prisma: fake.prisma }));

beforeEach(() => {
  for (const key of Object.keys(tables)) tables[key].length = 0;
});

describe("isPublicGoogleWalletHeroMedia", () => {
  it("autorise un google-wallet-hero APPROVED en LIVE", async () => {
    const url = "/api/media/visuels/m1/google-wallet-hero-123.png";
    tables.adRequest.push({
      id: "ad1",
      merchantId: "m1",
      status: "LIVE",
      fundingMode: "LIVE",
      googleWalletVisualStatus: "APPROVED",
      googleWalletHeroUrl: url,
      finalImageUrl: "/api/media/visuels/m1/banniere-red.png",
    });
    const { isPublicGoogleWalletHeroMedia } = await import("../src/lib/ad-visual-public-access");
    expect(await isPublicGoogleWalletHeroMedia("m1", url)).toBe(true);
  });

  it("autorise le hero Wallet en diffusion test sans statut LIVE", async () => {
    const url = "/api/media/visuels/m1/google-wallet-hero-test.png";
    tables.sponsoredAdTestBroadcast.push({ id: "global", adRequestId: "ad1" });
    tables.adRequest.push({
      id: "ad1",
      merchantId: "m1",
      status: "DRAFT",
      fundingMode: "TEST",
      googleWalletVisualStatus: "APPROVED",
      googleWalletHeroUrl: url,
      finalImageUrl: "/api/media/visuels/m1/banniere-red.png",
    });
    const { isPublicTestBroadcastWalletHeroMedia } = await import("../src/lib/ad-visual-public-access");
    expect(await isPublicTestBroadcastWalletHeroMedia("m1", url)).toBe(true);
  });

  it("refuse le bandeau même en LIVE", async () => {
    const banner = "/api/media/visuels/m1/banniere-red.png";
    tables.adRequest.push({
      id: "ad1",
      merchantId: "m1",
      status: "LIVE",
      fundingMode: "LIVE",
      googleWalletVisualStatus: "APPROVED",
      googleWalletHeroUrl: "/api/media/visuels/m1/google-wallet-hero-123.png",
      finalImageUrl: banner,
    });
    const { isPublicGoogleWalletHeroMedia } = await import("../src/lib/ad-visual-public-access");
    expect(await isPublicGoogleWalletHeroMedia("m1", banner)).toBe(false);
  });
});
