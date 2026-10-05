import { describe, expect, it, vi, beforeEach } from "vitest";
import { generateSignupCode, hashSignupCode, verifySignupCode } from "../src/lib/merchant-signup-codes";
import { encodeMerchantSignupGrant, decodeMerchantSignupGrant } from "../src/lib/merchant-signup-grant";
import { merchantSignupEntryHref } from "../src/lib/merchant-signup-routing";

vi.mock("../src/lib/env", () => ({
  env: {
    merchantSignupCodePepper: "test-pepper",
    merchantSignupGrantSecret: "test-grant-secret",
    merchantSignupGrantHours: 24,
    merchantSignupCodeDays: 14,
    merchantSignupMode: "beta_form",
  },
}));

describe("merchant signup codes", () => {
  it("génère un code à 6 chiffres et le vérifie", () => {
    const code = generateSignupCode();
    expect(code).toMatch(/^\d{6}$/);
    const hash = hashSignupCode(code);
    expect(verifySignupCode(code, hash)).toBe(true);
    expect(verifySignupCode("000000", hash)).toBe(false);
  });
});

describe("merchant signup grant", () => {
  it("encode et décode un jeton de session", () => {
    const token = encodeMerchantSignupGrant({ requestId: "req1", email: "pro@example.fr" });
    const payload = decodeMerchantSignupGrant(token);
    expect(payload?.requestId).toBe("req1");
    expect(payload?.email).toBe("pro@example.fr");
  });
});

describe("merchant signup routing", () => {
  beforeEach(() => {
    vi.stubEnv("MERCHANT_SIGNUP_MODE", "beta_form");
  });

  it("redirige vers /demarrer en mode bêta", () => {
    expect(merchantSignupEntryHref("fideto")).toBe("/demarrer?plan=fideto");
  });
});
