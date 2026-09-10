import { describe, expect, it } from "vitest";
import {
  formatEurosFromCents,
  parsePurchaseAmountToCents,
  purchaseAmountCentsFromUnknown,
  tryParsePurchaseAmountToCents,
} from "../src/lib/money";

describe("montants en centimes", () => {
  it("accepte les formats français", () => {
    expect(parsePurchaseAmountToCents("12")).toBe(1200);
    expect(parsePurchaseAmountToCents("12,50")).toBe(1250);
    expect(parsePurchaseAmountToCents("12.50")).toBe(1250);
    expect(formatEurosFromCents(1250)).toBe("12,50 €");
  });

  it("refuse les montants négatifs, trop de décimales et le plafond", () => {
    expect(tryParsePurchaseAmountToCents("-1").ok).toBe(false);
    expect(tryParsePurchaseAmountToCents("12,555").ok).toBe(false);
    expect(tryParsePurchaseAmountToCents("100001").ok).toBe(false);
  });

  it("ne fait confiance qu'aux centimes entiers côté serveur", () => {
    expect(purchaseAmountCentsFromUnknown({ purchaseAmountCents: 1850 })).toBe(1850);
    expect(purchaseAmountCentsFromUnknown({ purchaseAmount: 18.5 })).toBe(1850);
    expect(() => purchaseAmountCentsFromUnknown({ purchaseAmountCents: 12.5 })).toThrow(/centimes/);
  });
});
