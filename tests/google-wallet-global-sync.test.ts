import { readFileSync } from "fs";
import { describe, expect, it } from "vitest";

describe("sync Google Wallet globale (campagnes)", () => {
  it("paginate tous les objets globaux (lots de 80) jusqu'au dernier enregistrement", () => {
    const source = readFileSync("src/lib/google-wallet.ts", "utf8");
    expect(source).toContain("GLOBAL_WALLET_CAMPAIGN_SYNC_BATCH = 80");
    expect(source).toMatch(/syncAllGoogleWalletGlobalObjects[\s\S]*for \(;;\)/);
    expect(source).toMatch(/if \(rows\.length < batchSize\) break/);
    expect(source).toMatch(/lastId = rows\[rows\.length - 1\]/);
  });

  it("syncGoogleWalletGlobalObjectsForCampaignVisibility appelle syncAll (pagination complète)", () => {
    const source = readFileSync("src/lib/google-wallet.ts", "utf8");
    expect(source).toMatch(/syncGoogleWalletGlobalObjectsForCampaignVisibility[\s\S]*return syncAllGoogleWalletGlobalObjects/);
    expect(source).toMatch(/scheduleGoogleWalletGlobalCampaignResync[\s\S]*syncAllGoogleWalletGlobalObjects/);
    expect(source).not.toMatch(/syncGoogleWalletGlobalObjectsForCampaignVisibility[\s\S]*take:\s*limit/);
    expect(source).toMatch(/logGoogleWalletPatchFailure/);
  });
});
