import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderMerchantSignupAdminNotifyEmail } from "../src/emails/templates/merchant-signup/admin-notify";
import { superAdminSignupRequestUrl } from "../src/lib/hosts";

vi.mock("../src/lib/env", () => ({
  env: {
    nodeEnv: "production",
    customerOrigin: "https://fideto.fr",
    appOrigin: "https://app.fideto.fr",
    adminOrigin: "https://admin.fideto.fr",
    employeeAppUrl: "https://employe.fideto.fr",
    employeeOrigin: "https://employe.fideto.fr",
    legacyCustomerHost: "",
    legacyAppHost: "",
    legacyAdminHost: "",
    legacyEmployeeHost: "",
  },
  isProduction: () => true,
}));

describe("e-mail nouvelle demande bêta — lien super-admin", () => {
  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "production");
  });

  it("construit l'URL de fiche sur admin.fideto.fr avec l'identifiant réel", () => {
    const requestId = "clx9demo-request-id";
    const url = superAdminSignupRequestUrl(requestId);
    expect(url).toBe(`https://admin.fideto.fr/super-admin/demandes-inscription/${requestId}`);
    expect(url).not.toContain("fiduto");
    expect(url).not.toContain("app.fideto.fr");
  });

  it("inclut le bouton Ouvrir la demande vers l'URL admin", () => {
    const { html, text } = renderMerchantSignupAdminNotifyEmail({
      businessName: "Boulangerie Test",
      email: "pro@test.fr",
      planName: "Fideto",
      openRequestUrl: superAdminSignupRequestUrl("req_abc"),
    });
    expect(html).toContain("https://admin.fideto.fr/super-admin/demandes-inscription/req_abc");
    expect(html).toContain("Ouvrir la demande");
    expect(text).toContain("admin.fideto.fr");
    expect(html).not.toMatch(/fiduto|localhost|0\.0\.0\.0/i);
  });
});
