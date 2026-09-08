import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { isEmailConfigured, emailConfigHint } from "../src/lib/email";

describe("configuration e-mail", () => {
  const env = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...env };
  });

  afterEach(() => {
    process.env = env;
  });

  it("signale l'absence de configuration", async () => {
    delete process.env.RESEND_API_KEY;
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
    const mod = await import("../src/lib/email");
    expect(mod.isEmailConfigured()).toBe(false);
    expect(mod.emailConfigHint()).toMatch(/RESEND_API_KEY|SMTP_HOST/);
  });

  it("détecte Resend", async () => {
    process.env.RESEND_API_KEY = "re_test";
    const mod = await import("../src/lib/email");
    expect(mod.isEmailConfigured()).toBe(true);
    expect(mod.emailConfigHint()).toBeNull();
  });
});

describe("status employé", () => {
  it("distingue suspendu et accès retiré", async () => {
    const { statusLabel } = await import("../src/lib/staff-permissions");
    expect(
      statusLabel({ isActive: false, userActive: true, invitationStatus: "ACCEPTED" }),
    ).toBe("Suspendu");
    expect(
      statusLabel({ isActive: false, userActive: true, invitationStatus: "CANCELLED" }),
    ).toBe("Accès retiré");
  });
});
