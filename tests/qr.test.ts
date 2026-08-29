import { describe, expect, it } from "vitest";
import { QrError, assertQrUsable, type QrPayload } from "../src/lib/qr";

function payload(overrides: Partial<QrPayload> = {}): QrPayload {
  return {
    mid: "card_1",
    merch: "merchant_1",
    jti: "jti_1",
    exp: Math.floor(Date.now() / 1000) + 60,
    iat: Math.floor(Date.now() / 1000),
    ...overrides,
  };
}

describe("validation du QR", () => {
  it("accepte un QR encore valide et non utilisé", () => {
    expect(() =>
      assertQrUsable({
        payload: payload(),
        merchantId: "merchant_1",
      }),
    ).not.toThrow();
  });

  it("refuse un QR expiré", () => {
    expect(() =>
      assertQrUsable({
        payload: payload({ exp: Math.floor(Date.now() / 1000) - 5 }),
        merchantId: "merchant_1",
        now: new Date(),
      }),
    ).toThrow(QrError);
  });

  it("refuse un QR déjà utilisé", () => {
    expect(() =>
      assertQrUsable({
        payload: payload(),
        merchantId: "merchant_1",
        usedAt: new Date(),
      }),
    ).toThrow(/déjà été utilisé/);
  });

  it("refuse un QR d'un autre commerce", () => {
    expect(() =>
      assertQrUsable({
        payload: payload(),
        merchantId: "autre_commerce",
      }),
    ).toThrow(/n'appartient pas/);
  });
});
