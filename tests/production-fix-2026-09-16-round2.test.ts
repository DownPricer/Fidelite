import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { evaluateEarn } from "@/lib/loyalty-engine";
import { buildProgramSnapshotFromContext } from "@/lib/caisse-program";
import { LoyaltyWidgetView } from "@/components/fife-life/loyalty-widget-view";
import { defaultLoyaltyWidgetConfig } from "@/lib/loyalty-widget";
import { mockLoyaltyContext, mockLoyaltyProgram } from "./helpers/loyalty-context-fixtures";

const emptyHistory = { lastEarnAt: null, earnCountToday: 0, pointsEarnedToday: 0 };

// Second passage de correction (2026-09-16, round 2) : re-test production
// après le commit précédent. Trois défauts restants documentés par
// l'exploitant : bandeau "programme publié" incorrect, objectifs fabriqués
// "5/5"/"5/1", message générique "Aucun gain applicable" pour 10 €.

describe("Test A — programme publié vs brouillon (paramètres commerçant)", () => {
  it("construit le bloc « publié » exclusivement depuis data.active (jamais depuis le brouillon)", () => {
    const ui = readFileSync(
      join(process.cwd(), "src/app/app/parametres/programme/ui.tsx"),
      "utf8",
    );

    // Etat dédié pour le programme publié, alimenté uniquement par data.active.
    expect(ui).toContain("setActiveRules(data.active.rules)");
    expect(ui).toContain("setActiveVersion(typeof data.version");

    // Bloc "Programme actuellement publié" (bandeau fidelo-loyalty-program-redesign-v2,
    // renommé "live strip" depuis la refonte) : titre, version, règle, minimum.
    // Toujours construit depuis activeMode/activeRules/activeVersion (= data.active),
    // jamais depuis mode/rules (le formulaire de brouillon).
    expect(ui).toContain("Programme actuellement en ligne");
    expect(ui).toContain("{modeTitle(activeMode)}");
    expect(ui).toContain('activeVersion ? ` · v${activeVersion}` : ""');
    expect(ui).toContain("publishedEarnDescription(activeMode, activeRules)");
    expect(ui).toContain("publishedMinimumPurchaseLabel(activeRules)");

    // Statut affiché dans le badge d'en-tête (Programme publié / Brouillon non
    // publié / Modifications non enregistrées) : ne présente jamais le
    // brouillon comme le programme actif.
    expect(ui).toContain('"Modifications non enregistrées" : hasDraft ? "Brouillon non publié" : "Programme publié"');

    // Rappel explicite dans l'étape Mode quand un brouillon existe : le mode
    // sélectionné dans le formulaire n'est pas (encore) le mode publié.
    expect(ui).toContain("Brouillon non publié — mode sélectionné dans le formulaire");
    expect(ui).toMatch(/\{hasDraft \? \(\s*<p[^>]*>\s*Brouillon non publié/);
  });

  it("modeTitle+version+règle correspondent au cas de production (POINTS_BY_AMOUNT v7) et non au brouillon (VISITS)", () => {
    // Vérifie que les helpers utilisés par le bloc "publié" décrivent bien
    // POINTS_BY_AMOUNT à partir des règles actives, indépendamment de tout
    // mode de brouillon VISITS potentiellement chargé dans le formulaire.
    const ui = readFileSync(
      join(process.cwd(), "src/app/app/parametres/programme/ui.tsx"),
      "utf8",
    );
    expect(ui).toMatch(/case "POINTS_BY_AMOUNT": \{\s*const pts = Math\.max\(1, Math\.trunc\(rules\.pointsPerAmount/);
    expect(ui).toContain('`${pts} points pour ${amount} € d\'achat`');
    expect(ui).toContain("Minimum d'achat : ${min.toLocaleString(\"fr-FR\")} €");
  });
});

describe("Test B — aucun objectif réel (balance=5, aucune récompense compatible, aucun droit acquis)", () => {
  it("LoyaltyWidgetView : n'affiche jamais 5/5, 5/1 ou 100% ; affiche « Aucun objectif configuré »", () => {
    const html = renderToStaticMarkup(
      LoyaltyWidgetView({
        config: defaultLoyaltyWidgetConfig("POINTS_BY_AMOUNT"),
        progress: { current: 5, target: null, label: "Aucun objectif configuré" },
        primaryColor: "#8557ff",
      }),
    );
    expect(html).toContain("Aucun objectif configuré");
    expect(html).toContain("5 pts");
    expect(html).not.toContain("5/5");
    expect(html).not.toContain("5/1");
    expect(html).not.toContain("100%");
  });

  it("caisse (buildProgramSnapshotFromContext) : hasObjective=false, threshold=null, pas de 5/1", () => {
    const program = mockLoyaltyProgram({
      mode: "POINTS_BY_AMOUNT",
      config: { pointsPerAmount: 1, amountForPoints: 20, minPurchase: 10, rounding: "floor" },
      rewards: [],
    });
    const context = mockLoyaltyContext(program);
    const snapshot = buildProgramSnapshotFromContext(5, context);

    expect(snapshot.hasObjective).toBe(false);
    expect(snapshot.threshold).toBeNull();
    expect(snapshot.rewardLabel).toBe("");
    expect(snapshot.rewardAvailable).toBe(false);
    expect(snapshot.progressLabel).not.toContain("/1");
    expect(snapshot.progressLabel).not.toContain("/5");
  });

  it("caisse : une récompense incompatible avec le mode actif ne fabrique pas d'objectif (non-régression avantage fantôme)", () => {
    const program = mockLoyaltyProgram({
      mode: "POINTS_BY_AMOUNT",
      config: { pointsPerAmount: 1, amountForPoints: 20, minPurchase: 10, rounding: "floor" },
      rewards: [{ id: "old-visits-reward", threshold: 10, thresholdUnit: "visits", isActive: true }],
    });
    const context = mockLoyaltyContext(program);
    const snapshot = buildProgramSnapshotFromContext(5, context);

    expect(context.rewards).toEqual([]);
    expect(snapshot.hasObjective).toBe(false);
    expect(snapshot.threshold).toBeNull();
  });

  it("merchant-detail.tsx : la branche sans récompense compatible envoie target: null (jamais card.points)", () => {
    const src = readFileSync(
      join(process.cwd(), "src/components/fife-life/merchant-detail.tsx"),
      "utf8",
    );
    expect(src).toContain('current: card.points,\n          target: null,\n          label: "Aucun objectif configuré"');
  });

  it("caisse-program.ts et loyalty-commit.ts : le seuil n'est jamais calculé quand hasObjective est faux", () => {
    const caisseSrc = readFileSync(join(process.cwd(), "src/lib/caisse-program.ts"), "utf8");
    expect(caisseSrc).toContain("const hasObjective = context.rewards.length > 0");
    expect(caisseSrc).toContain("const threshold = hasObjective ? view.progressTarget : null");

    const commitSrc = readFileSync(join(process.cwd(), "src/lib/loyalty-commit.ts"), "utf8");
    expect(commitSrc).toContain("const hasObjective = config.rewards.length > 0");
    expect(commitSrc).toContain("const threshold = hasObjective ? progressTargetForBalance(config, input.points) : null");
  });
});

describe("Test C — objectif réel inchangé (balance=5, récompense à 10 points)", () => {
  it("LoyaltyWidgetView affiche toujours 5/10 quand une vraie récompense existe", () => {
    const html = renderToStaticMarkup(
      LoyaltyWidgetView({
        config: defaultLoyaltyWidgetConfig("POINTS_BY_AMOUNT"),
        progress: { current: 5, target: 10, label: "Encore 5" },
        primaryColor: "#8557ff",
      }),
    );
    expect(html).toContain("5 / 10");
  });

  it("caisse : hasObjective=true et seuil réel conservé quand une récompense compatible existe", () => {
    const program = mockLoyaltyProgram({
      mode: "POINTS_BY_AMOUNT",
      config: { pointsPerAmount: 1, amountForPoints: 20, minPurchase: 10, rounding: "floor" },
      rewards: [{ id: "reward-10", threshold: 10, thresholdUnit: "points", isActive: true }],
    });
    const context = mockLoyaltyContext(program);
    const snapshot = buildProgramSnapshotFromContext(5, context);

    expect(snapshot.hasObjective).toBe(true);
    expect(snapshot.threshold).toBe(10);
    expect(snapshot.rewardLabel).not.toBe("");
  });
});

describe("Test D — message explicite pour un achat de 10 € (aucun point gagné après arrondi)", () => {
  const rules = { pointsPerAmount: 1, amountForPoints: 20, minPurchase: 10, rounding: "floor" as const };

  it("10 € : allowed=false, gain=0, code stable, message explicite (pas de générique)", () => {
    const evaluation = evaluateEarn({
      mode: "POINTS_BY_AMOUNT",
      rules,
      currentBalance: 5,
      purchaseAmountCents: 1000,
      history: emptyHistory,
      programActive: true,
      merchantActive: true,
    });

    expect(evaluation.ok).toBe(false);
    expect(evaluation.earned).toBe(0);
    expect(evaluation.block?.code).toBe("no_earn_rounded");
    expect(evaluation.block?.message).toBe(
      "Aucun point gagné pour 10,00 €. Il faut atteindre 20,00 € pour gagner 1 point.",
    );
    // Le composant caisse affiche details[0] en priorité : il doit porter
    // le même message complet, jamais un fragment générique.
    expect(evaluation.block?.details?.[0]).toBe(evaluation.block?.message);
    expect(evaluation.block?.message).not.toBe("Aucun gain applicable pour cette transaction.");
  });

  it("20 € : allowed=true, gain=1", () => {
    const evaluation = evaluateEarn({
      mode: "POINTS_BY_AMOUNT",
      rules,
      currentBalance: 5,
      purchaseAmountCents: 2000,
      history: emptyHistory,
      programActive: true,
      merchantActive: true,
    });
    expect(evaluation.ok).toBe(true);
    expect(evaluation.earned).toBe(1);
    expect(evaluation.newBalance).toBe(6);
  });

  it("40 € : allowed=true, gain=2", () => {
    const evaluation = evaluateEarn({
      mode: "POINTS_BY_AMOUNT",
      rules,
      currentBalance: 5,
      purchaseAmountCents: 4000,
      history: emptyHistory,
      programActive: true,
      merchantActive: true,
    });
    expect(evaluation.ok).toBe(true);
    expect(evaluation.earned).toBe(2);
    expect(evaluation.newBalance).toBe(7);
  });

  it("le composant caisse ne remplace jamais details[0] par le message générique", () => {
    const src = readFileSync(join(process.cwd(), "src/components/caisse/cashier-checkout.tsx"), "utf8");
    // La sélection historique (details[0] prioritaire sur message) n'a pas
    // été modifiée : c'est la source (loyalty-engine.ts) qui a été alignée.
    expect(src).toContain("view.block.details?.[0] ?? view.block.message");
  });
});

describe("Test E — non-régression (comportements déjà corrigés, à ne pas casser)", () => {
  it("une récompense incompatible avec le mode actif n'est jamais renvoyée par le resolver canonique", () => {
    const program = mockLoyaltyProgram({
      mode: "POINTS_BY_AMOUNT",
      config: { pointsPerAmount: 1, amountForPoints: 20, minPurchase: 10, rounding: "floor" },
      rewards: [{ id: "old-visits-reward", threshold: 10, thresholdUnit: "visits", isActive: true }],
    });
    const context = mockLoyaltyContext(program);
    expect(context.rewards).toEqual([]);
  });

  it("un programme VISITS avec un vrai objectif conserve sa progression normale", () => {
    const program = mockLoyaltyProgram({
      mode: "VISITS",
      config: { visitsPerScan: 1, minPurchase: 0 },
      rewards: [{ id: "reward-visits", threshold: 10, thresholdUnit: "visits", isActive: true }],
    });
    const context = mockLoyaltyContext(program);
    const snapshot = buildProgramSnapshotFromContext(3, context);

    expect(snapshot.hasObjective).toBe(true);
    expect(snapshot.threshold).toBe(10);
    expect(snapshot.progressLabel).toContain("10");
  });

  it("20 € reste +1 point sur un solde initial de 4 (comportement déjà validé en production)", () => {
    const evaluation = evaluateEarn({
      mode: "POINTS_BY_AMOUNT",
      rules: { pointsPerAmount: 1, amountForPoints: 20, minPurchase: 10, rounding: "floor" },
      currentBalance: 4,
      purchaseAmountCents: 2000,
      history: emptyHistory,
      programActive: true,
      merchantActive: true,
    });
    expect(evaluation.ok).toBe(true);
    expect(evaluation.earned).toBe(1);
    expect(evaluation.newBalance).toBe(5);
  });
});
