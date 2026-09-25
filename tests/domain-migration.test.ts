import { describe, expect, it } from "vitest";
import { getAllowedOrigins, env } from "../src/lib/env";
import { isAppHost, isCustomerHost, isEmployeeHost, legacyRedirectOrigin } from "../src/lib/hosts";
import { extractFifeLifeQrToken } from "../src/lib/qr-input";

const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJ0ZXN0LTEyMyJ9.signature";

describe("migration vers fideto.fr", () => {
  it("utilise fideto.fr comme origine publique par défaut", () => {
    expect(env.customerOrigin).toBe("https://fideto.fr");
    expect(env.appName).toBe("Fideto");
  });

  it("reconnaît les nouveaux hôtes et les anciens alias", () => {
    expect(isCustomerHost("fideto.fr")).toBe(true);
    expect(isCustomerHost("fidelite.sitereadyshd.fr")).toBe(true);
    expect(isAppHost("app.fideto.fr")).toBe(true);
    expect(isAppHost("app-fidelite.sitereadyshd.fr")).toBe(true);
    expect(isEmployeeHost("employe.fideto.fr:443")).toBe(true);
    expect(isCustomerHost("evil.example")).toBe(false);
  });

  it("autorise les deux domaines côté CSRF", () => {
    const origins = getAllowedOrigins();
    expect(origins).toContain("https://fideto.fr");
    expect(origins).toContain("https://fidelite.sitereadyshd.fr");
  });

  it("associe chaque ancien hôte à son nouvel hôte", () => {
    expect(legacyRedirectOrigin("fidelite.sitereadyshd.fr")).toBe("https://fideto.fr");
    expect(legacyRedirectOrigin("app-fidelite.sitereadyshd.fr")).toBe("https://app.fideto.fr");
    expect(legacyRedirectOrigin("fideto.fr")).toBeNull();
  });

  it("accepte les liens QR de l'ancien et du nouveau domaine", () => {
    expect(extractFifeLifeQrToken(`https://fideto.fr/carte?token=${jwt}`)).toBe(jwt);
    expect(extractFifeLifeQrToken(`https://fidelite.sitereadyshd.fr/carte?token=${jwt}`)).toBe(jwt);
  });
});
