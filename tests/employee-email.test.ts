import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { isEmailConfigured, emailConfigHint } from "../src/lib/email";

describe("configuration e-mail", () => {
  beforeEach(() => {
    vi.resetModules();
    // vi.stubEnv touche uniquement les clés listées, sans jamais réaffecter tout
    // process.env — une réaffectation globale (l'ancien code ici) ouvre une fenêtre de
    // course avec d'autres fichiers de test exécutés dans le même worker (repéré en
    // stabilisant la suite complète : provoquait un échec intermittent dans
    // tests/google-wallet.test.ts selon l'ordre d'exécution).
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("SMTP_HOST", "");
    vi.stubEnv("SMTP_USER", "");
    vi.stubEnv("SMTP_PASS", "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("signale l'absence de configuration", async () => {
    const mod = await import("../src/lib/email");
    expect(mod.isEmailConfigured()).toBe(false);
    expect(mod.emailConfigHint()).toMatch(/RESEND_API_KEY|SMTP_HOST/);
  });

  it("détecte Resend", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
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
