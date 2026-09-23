import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("page avantages commerçant", () => {
  it("expose une route dédiée et garde programme en résumé", () => {
    const root = process.cwd();
    const advantagesPage = readFileSync(join(root, "src/app/app/parametres/avantages/page.tsx"), "utf8");
    const programUi = readFileSync(join(root, "src/app/app/parametres/programme/ui.tsx"), "utf8");
    // Depuis la refonte Avantages/Programme (suivant les maquettes fidelo-advantages-redesign-v2
    // et fidelo-loyalty-program-redesign-v2), les deux écrans sont deux composants distincts :
    // AdvantagesEditor (avantages-ui.tsx) et ProgramConfigurator (programme/ui.tsx), reliés par un
    // lien "Gérer les avantages" plutôt que par une prop view="advantages" sur un composant partagé.
    // Depuis la Partie 4 (réorganisation Fidélisation/Campagnes/Paramètres), le lien vers
    // les avantages vit dans fidelisation/ui.tsx et non plus dans parametres/ui.tsx.
    const fidelisationUi = readFileSync(join(root, "src/app/app/fidelisation/ui.tsx"), "utf8");
    const dashboardUi = readFileSync(join(root, "src/app/app/ui.tsx"), "utf8");

    expect(advantagesPage).toContain('import { AdvantagesEditor } from "./advantages-ui"');
    expect(programUi).toContain('href="/app/parametres/avantages"');
    expect(programUi).toContain("Gérer les avantages");
    expect(fidelisationUi).toContain("/app/parametres/avantages");
    expect(dashboardUi).toContain("/app/parametres/avantages");
  });

  it("réutilise le backend programme pour CRUD et conserve la limite serveur", () => {
    const advantagesUi = readFileSync(
      join(process.cwd(), "src/app/app/parametres/avantages/advantages-ui.tsx"),
      "utf8",
    );
    const route = readFileSync(join(process.cwd(), "src/app/api/merchant/program/route.ts"), "utf8");

    expect(advantagesUi).toContain('fetch("/api/merchant/program"');
    expect(advantagesUi).toContain("updateReward(index");
    expect(advantagesUi).toContain("archivedAt: new Date().toISOString()");
    expect(advantagesUi).toContain("rewards.filter(isCurrentReward).length >= 10");
    expect(route).toContain("assertRewardLimit(parsed.data.rewards, parsed.data.mode)");
    expect(route).toContain("customerRewardEntitlement.findMany");
  });
});
