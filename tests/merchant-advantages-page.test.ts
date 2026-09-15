import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("page avantages commerçant", () => {
  it("expose une route dédiée et garde programme en résumé", () => {
    const root = process.cwd();
    const advantagesPage = readFileSync(join(root, "src/app/app/parametres/avantages/page.tsx"), "utf8");
    const programUi = readFileSync(join(root, "src/app/app/parametres/programme/ui.tsx"), "utf8");
    const settingsUi = readFileSync(join(root, "src/app/app/parametres/ui.tsx"), "utf8");
    const dashboardUi = readFileSync(join(root, "src/app/app/ui.tsx"), "utf8");

    expect(advantagesPage).toContain('view="advantages"');
    expect(programUi).toContain('href="/app/parametres/avantages"');
    expect(programUi).toContain("Avantages configurés");
    expect(programUi).toContain("Gérer les avantages");
    expect(settingsUi).toContain("/app/parametres/avantages");
    expect(dashboardUi).toContain("/app/parametres/avantages");
  });

  it("réutilise le backend programme pour CRUD et conserve la limite serveur", () => {
    const programUi = readFileSync(join(process.cwd(), "src/app/app/parametres/programme/ui.tsx"), "utf8");
    const route = readFileSync(join(process.cwd(), "src/app/api/merchant/program/route.ts"), "utf8");

    expect(programUi).toContain('fetch("/api/merchant/program"');
    expect(programUi).toContain("updateReward(index");
    expect(programUi).toContain("archivedAt: new Date().toISOString()");
    expect(programUi).toContain("rewards.filter(isCurrentReward).length >= 10");
    expect(route).toContain("assertRewardLimit(parsed.data.rewards, parsed.data.mode)");
    expect(route).toContain("customerRewardEntitlement.findMany");
  });
});
