import { describe, expect, it, vi } from "vitest";

async function walletModule() {
  vi.resetModules();
  process.env.GOOGLE_WALLET_ISSUER_ID = "3388000000023198536";
  process.env.GOOGLE_WALLET_GLOBAL_CLASS_ID = "3388000000023198536.fifelife_global";
  return import("../src/lib/google-wallet");
}

describe("Google Wallet IDs", () => {
  it("réutilise la classe générale existante", async () => {
    const { buildGoogleWalletIds } = await walletModule();
    expect(buildGoogleWalletIds({}).globalClassId).toBe("3388000000023198536.fifelife_global");
  });

  it("crée une seule classe opaque par commerce", async () => {
    const { buildGoogleWalletIds } = await walletModule();
    const first = buildGoogleWalletIds({ merchantId: "merchant_abc123" }).merchantClassId;
    const second = buildGoogleWalletIds({ merchantId: "merchant_abc123" }).merchantClassId;
    expect(first).toBe(second);
    expect(first).toMatch(/^3388000000023198536\.merchant_[a-f0-9]{32}$/);
  });

  it("ne place pas d'e-mail, téléphone ou nom client dans les identifiants", async () => {
    const { buildGoogleWalletIds } = await walletModule();
    const ids = buildGoogleWalletIds({
      userId: "user@example.com +33 6 12 34 56 78 Alice",
      merchantId: "merchant@example.com +33 1 23",
      membershipId: "membership Bob +33",
    });
    const joined = Object.values(ids).join("|");
    expect(joined).not.toContain("@");
    expect(joined).not.toContain("+");
    expect(joined).not.toContain(" ");
  });

  it("réutilise le même objet pour la même adhésion", async () => {
    const { buildGoogleWalletIds } = await walletModule();
    expect(buildGoogleWalletIds({ membershipId: "cm123" }).merchantObjectId).toBe(
      buildGoogleWalletIds({ membershipId: "cm123" }).merchantObjectId,
    );
  });
});
