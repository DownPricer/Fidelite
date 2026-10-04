import { describe, expect, it } from "vitest";
import { approvedGoogleWalletHeroUrl } from "../src/lib/google-wallet-campaign-hero";

describe("approvedGoogleWalletHeroUrl", () => {
  it("utilise uniquement le hero Wallet validé, jamais le bandeau", () => {
    expect(
      approvedGoogleWalletHeroUrl({
        googleWalletVisualStatus: "APPROVED",
        googleWalletHeroUrl: "/api/media/visuels/m1/google-wallet-hero-blue.png",
        finalImageUrl: "/api/media/visuels/m1/banniere-red.png",
      }),
    ).toBe("/api/media/visuels/m1/google-wallet-hero-blue.png");
  });

  it("refuse le bandeau même si marqué APPROVED par erreur", () => {
    const url = "/api/media/visuels/m1/banniere-red.png";
    expect(
      approvedGoogleWalletHeroUrl({
        googleWalletVisualStatus: "APPROVED",
        googleWalletHeroUrl: url,
        finalImageUrl: url,
      }),
    ).toBeNull();
  });

  it("retourne null sans visuel Wallet validé", () => {
    expect(
      approvedGoogleWalletHeroUrl({
        googleWalletVisualStatus: "SENT_TO_MERCHANT",
        googleWalletHeroUrl: "/api/media/visuels/m1/google-wallet-hero-blue.png",
        finalImageUrl: "/api/media/visuels/m1/banniere-red.png",
      }),
    ).toBeNull();
  });
});
