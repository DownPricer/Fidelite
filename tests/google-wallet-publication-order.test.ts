import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, expect, it } from "vitest";

describe("Google Wallet publication media order", () => {
  it("enregistre la configuration publiée avant l'appel Google", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/app/api/super-admin/merchants/[id]/google-wallet/route.ts"),
      "utf8",
    );

    const publishIndex = source.indexOf("publishGoogleWalletConfig(withDraft.configByMode)");
    const testIndex = source.indexOf("await testGoogleWalletMerchantConfig(id)");
    const syncIndex = source.indexOf("await syncGoogleWalletMerchant");

    expect(publishIndex).toBeGreaterThan(-1);
    expect(testIndex).toBeGreaterThan(publishIndex);
    expect(syncIndex).toBeGreaterThan(testIndex);
    expect(source).toContain("assertPublishedGoogleWalletMediaReadable");
  });
});
