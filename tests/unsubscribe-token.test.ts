import { describe, expect, it } from "vitest";
import { UnsubscribeTokenError, signUnsubscribeToken, unsubscribeUrl, verifyUnsubscribeToken } from "../src/lib/unsubscribe-token";

describe("jeton de désinscription signé", () => {
  it("signe puis vérifie un jeton scopé à un utilisateur et un champ", async () => {
    const token = await signUnsubscribeToken({ userId: "user_1", scope: "adsMerchantEmail", merchantId: "m1" });
    const payload = await verifyUnsubscribeToken(token);
    expect(payload).toEqual({ userId: "user_1", scope: "adsMerchantEmail", merchantId: "m1" });
  });

  it("rejette un jeton corrompu", async () => {
    await expect(verifyUnsubscribeToken("not-a-token")).rejects.toBeInstanceOf(UnsubscribeTokenError);
  });

  it("rejette un jeton signé avec une autre clé", async () => {
    const { SignJWT } = await import("jose");
    const wrongKey = new TextEncoder().encode("wrong-secret-at-least-32-characters-long");
    const token = await new SignJWT({ scope: "adsNetworkEmail" })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setSubject("user_1")
      .sign(wrongKey);
    await expect(verifyUnsubscribeToken(token)).rejects.toBeInstanceOf(UnsubscribeTokenError);
  });

  it("construit l'URL de désinscription", () => {
    expect(unsubscribeUrl("https://app.example.com/", "tok123")).toBe(
      "https://app.example.com/desinscription?token=tok123",
    );
  });
});
