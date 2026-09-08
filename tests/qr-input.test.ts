import { describe, expect, it } from "vitest";
import { extractFifeLifeQrToken, QrInputError } from "../src/lib/qr-input";

describe("extractFifeLifeQrToken", () => {
  const jwt =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJ0ZXN0LTEyMyJ9.signature";

  it("accepte un jeton JWT brut", () => {
    expect(extractFifeLifeQrToken(jwt)).toBe(jwt);
  });

  it("extrait un jeton depuis un lien autorisé", () => {
    const url = `https://fidelite.sitereadyshd.fr/carte?token=${jwt}`;
    expect(extractFifeLifeQrToken(url)).toBe(jwt);
  });

  it("refuse un domaine non autorisé", () => {
    expect(() => extractFifeLifeQrToken(`https://evil.example/?token=${jwt}`)).toThrow(QrInputError);
  });
});
