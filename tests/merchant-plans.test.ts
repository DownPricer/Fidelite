import { describe, expect, it } from "vitest";
import { formatEurosFromCents, isMerchantPlanId, MERCHANT_PLANS } from "@/lib/merchant-plans";

describe("merchant-plans", () => {
  it("expose exactement les deux offres commerçant attendues, avec les bons montants", () => {
    expect(Object.keys(MERCHANT_PLANS).sort()).toEqual(["fideto", "fideto-phone"]);

    expect(MERCHANT_PLANS.fideto).toMatchObject({
      id: "fideto",
      monthlyPriceCents: 1999,
      setupPriceCents: null,
      firstMonthIncluded: false,
    });

    expect(MERCHANT_PLANS["fideto-phone"]).toMatchObject({
      id: "fideto-phone",
      monthlyPriceCents: 1999,
      setupPriceCents: 19900,
      firstMonthIncluded: true,
    });
  });

  it("isMerchantPlanId accepte uniquement les identifiants d'offre connus", () => {
    expect(isMerchantPlanId("fideto")).toBe(true);
    expect(isMerchantPlanId("fideto-phone")).toBe(true);
    expect(isMerchantPlanId("insight")).toBe(false);
    expect(isMerchantPlanId(undefined)).toBe(false);
    expect(isMerchantPlanId(null)).toBe(false);
    expect(isMerchantPlanId("")).toBe(false);
  });

  it("formatEurosFromCents affiche les décimales seulement quand nécessaire", () => {
    expect(formatEurosFromCents(1999)).toBe("19,99 €");
    expect(formatEurosFromCents(19900)).toBe("199 €");
    expect(formatEurosFromCents(100)).toBe("1 €");
    expect(formatEurosFromCents(105)).toBe("1,05 €");
  });
});
