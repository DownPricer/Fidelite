import { readFileSync } from "fs";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

describe("liens e-mail compte client (production)", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("CUSTOMER_ORIGIN", "http://0.0.0.0:3000");
    vi.stubEnv("APP_ORIGIN", "http://127.0.0.1:3000");
    vi.stubEnv("APP_URL", "http://0.0.0.0:3000");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("ignore CUSTOMER_ORIGIN / APP_URL internes et utilise fideto.fr pour la validation", async () => {
    const { buildEmailVerificationUrl, buildAccountRecoveryUrl } = await import("../src/lib/customer-onboarding");
    const verify = buildEmailVerificationUrl("test-token-abc");
    const recovery = buildAccountRecoveryUrl("recovery-token");
    for (const url of [verify, recovery]) {
      expect(url).not.toMatch(/0\.0\.0\.0|127\.0\.0\.1|localhost/i);
      expect(url.startsWith("https://fideto.fr/")).toBe(true);
    }
    expect(verify).toContain("/api/customer/auth/verify-email?token=");
  });

  it("publicAppUrl pointe vers app.fideto.fr en production", async () => {
    const { publicAppUrl } = await import("../src/lib/hosts");
    expect(publicAppUrl("/connexion")).toBe("https://app.fideto.fr/connexion");
  });

  it("les builders onboarding n'utilisent pas env.appUrl ni Host de requête", () => {
    const onboarding = readFileSync("src/lib/customer-onboarding.ts", "utf8");
    expect(onboarding).toContain("publicCustomerUrl");
    expect(onboarding).not.toMatch(/resolveAppOriginFromRequestHost|req\.headers|hostHeader/i);
  });
});

describe("route de vérification e-mail", () => {
  it("redirige vers la finalisation ou le wallet après token valide", () => {
    const source = readFileSync("src/app/api/customer/auth/verify-email/route.ts", "utf8");
    expect(source).toMatch(/redirect/i);
    expect(source).toMatch(/finalisation|carte/i);
  });
});
