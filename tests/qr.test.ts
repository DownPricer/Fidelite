import { describe, expect, it } from "vitest";
import { QrError, assertQrUsable, signQrToken, verifyQrToken } from "../src/lib/qr";

describe("QR fixe et opaque", () => {
  it("le même client récupère exactement le même QR fixe", async () => {
    const token1 = await signQrToken({ jti: "card_123" });
    const token2 = await signQrToken({ jti: "card_123" });

    // QR fixe : même identifiant -> même jeton signé
    expect(token1).toBe(token2);

    const payload = await verifyQrToken(token1);
    expect(payload.jti).toBe("card_123");
  });

  it("le même QR peut être scanné plusieurs fois pour le bon commerce", () => {
    const payload = { jti: "card_123" };

    expect(() =>
      assertQrUsable({
        payload,
        merchantId: "merchant_1",
        storedMerchantId: "merchant_1",
      }),
    ).not.toThrow();

    // Second scan, toujours pour le même commerce : toujours accepté
    expect(() =>
      assertQrUsable({
        payload,
        merchantId: "merchant_1",
        storedMerchantId: "merchant_1",
      }),
    ).not.toThrow();
  });

  it("un QR d'un autre commerce est refusé", () => {
    const payload = { jti: "card_123" };

    expect(() =>
      assertQrUsable({
        payload,
        merchantId: "merchant_2",
        storedMerchantId: "merchant_1",
      }),
    ).toThrow(QrError);
  });

  it("rejette un jeton invalide", async () => {
    await expect(verifyQrToken("not-a-valid-token")).rejects.toBeInstanceOf(QrError);
  });
});
