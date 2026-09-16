import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { evaluateEarn } from "@/lib/loyalty-engine";
import { DEFAULT_RULES } from "@/lib/loyalty-program";
import { buildCustomerProgramView, resolveWalletCardObjective } from "@/lib/loyalty-context";
import { mockLoyaltyContext, mockLoyaltyProgram } from "./helpers/loyalty-context-fixtures";

const emptyHistory = { lastEarnAt: null, earnCountToday: 0, pointsEarnedToday: 0 };

// Correction basée sur l'incident de production documenté :
// commerce "test" (cmtu8z8mk0008my01qlxttt3j), programme actif
// POINTS_BY_AMOUNT (programId cmtu8z8mk0009my01rs5zap6n, v7), une ancienne
// récompense "visits" encore active en base et aucun CustomerRewardEntitlement
// pour le client (points: 4).

describe("Cas 1 — source du programme publié dans les paramètres commerçant", () => {
  it("initialise toujours le formulaire à partir de la réponse serveur et signale un brouillon séparément de l'actif publié", () => {
    const ui = readFileSync(
      join(process.cwd(), "src/app/app/parametres/programme/ui.tsx"),
      "utf8",
    );

    // Le brouillon (le cas échéant) ne doit jamais être présenté comme le
    // programme actif : un indicateur dédié doit exister...
    expect(ui).toContain("hasDraft");
    expect(ui).toContain("setHasDraft(Boolean(data.draft))");
    // ...et le programme réellement publié doit rester visible séparément.
    expect(ui).toContain("Programme actuellement publié");
    expect(ui).toContain("modeTitle(activeMode)");
    // Aucun état local (localStorage/sessionStorage) ne doit pouvoir écraser
    // les données serveur après rechargement.
    expect(ui).not.toContain("localStorage");
    expect(ui).not.toContain("sessionStorage");
  });
});

describe("Cas 2 — récompense incompatible sans droit acquis (avantage fantôme)", () => {
  it("ne renvoie aucun objectif ni libellé fabriqué quand la seule récompense est incompatible avec le mode actif", () => {
    const program = mockLoyaltyProgram({
      mode: "POINTS_BY_AMOUNT",
      config: { pointsPerAmount: 1, amountForPoints: 20, minPurchase: 10, rounding: "floor" },
      rewards: [{ id: "old-visits-reward", threshold: 10, thresholdUnit: "visits", isActive: true }],
    });
    const context = mockLoyaltyContext(program);
    const balance = 4;
    const programView = buildCustomerProgramView(context, balance);

    // Le resolver canonique filtre bien la récompense incompatible.
    expect(programView.rewards).toEqual([]);

    // Aucun CustomerRewardEntitlement acquis pour ce client (detailReward = null).
    const objective = resolveWalletCardObjective(programView, balance, null);

    expect(objective.hasObjective).toBe(false);
    // Le solde réel est affiché, jamais un dénominateur fabriqué (ex. "/1").
    expect(objective.visitsRequired).toBe(balance);
    expect(objective.rewardLabel).toBe("");
  });
});

describe("Cas 3 — droit acquis réel conservé séparément", () => {
  it("affiche l'avantage conservé sans le confondre avec la progression du programme courant", () => {
    const program = mockLoyaltyProgram({
      mode: "POINTS_BY_AMOUNT",
      config: { pointsPerAmount: 1, amountForPoints: 20, minPurchase: 10, rounding: "floor" },
      rewards: [{ id: "old-visits-reward", threshold: 10, thresholdUnit: "visits", isActive: true }],
    });
    const context = mockLoyaltyContext(program);
    const balance = 4;
    const programView = buildCustomerProgramView(context, balance);

    const entitlement = { progressTarget: 10, rewardName: "1 café offert (ancien programme)" };
    const objective = resolveWalletCardObjective(programView, balance, entitlement);

    expect(objective.hasObjective).toBe(true);
    expect(objective.visitsRequired).toBe(10);
    expect(objective.rewardLabel).toBe("1 café offert (ancien programme)");
    // Le programme courant, lui, ne propose toujours aucune récompense compatible.
    expect(programView.rewards).toEqual([]);
  });
});

describe("Cas 4 — calcul caisse POINTS_BY_AMOUNT (1 point / 20 €, minimum 10 €)", () => {
  const rules = { ...DEFAULT_RULES.POINTS_BY_AMOUNT, pointsPerAmount: 1, amountForPoints: 20, minPurchase: 10, rounding: "floor" as const };

  it("10 € : aucun gain, avec message explicite (pas le message générique)", () => {
    const result = evaluateEarn({
      mode: "POINTS_BY_AMOUNT",
      rules,
      currentBalance: 0,
      purchaseAmountCents: 1000,
      history: emptyHistory,
    });
    expect(result.ok).toBe(false);
    expect(result.earned).toBe(0);
    expect(result.block?.code).toBe("no_earn_rounded");
    expect(result.block?.message).toBe(
      "Aucun point gagné pour 10,00 €. Il faut atteindre 20,00 € pour gagner 1 point.",
    );
  });

  it("20 € : 1 point", () => {
    const result = evaluateEarn({
      mode: "POINTS_BY_AMOUNT",
      rules,
      currentBalance: 0,
      purchaseAmountCents: 2000,
      history: emptyHistory,
    });
    expect(result.ok).toBe(true);
    expect(result.earned).toBe(1);
  });

  it("40 € : 2 points", () => {
    const result = evaluateEarn({
      mode: "POINTS_BY_AMOUNT",
      rules,
      currentBalance: 0,
      purchaseAmountCents: 4000,
      history: emptyHistory,
    });
    expect(result.ok).toBe(true);
    expect(result.earned).toBe(2);
  });
});

describe("Cas 5 — aucun impact sur un programme VISITS réel", () => {
  it("continue de fonctionner normalement (gain, objectif, avantage compatible)", () => {
    const rules = { ...DEFAULT_RULES.VISITS, minPurchase: 0 };
    const result = evaluateEarn({
      mode: "VISITS",
      rules,
      currentBalance: 3,
      purchaseAmountCents: 500,
      history: emptyHistory,
    });
    expect(result.ok).toBe(true);
    expect(result.earned).toBe(1);
    expect(result.newBalance).toBe(4);

    const program = mockLoyaltyProgram({
      mode: "VISITS",
      rewards: [{ id: "r1", threshold: 10, thresholdUnit: "visits", isActive: true }],
    });
    const context = mockLoyaltyContext(program);
    const programView = buildCustomerProgramView(context, 4);
    expect(programView.rewards).toHaveLength(1);

    const objective = resolveWalletCardObjective(programView, 4, null);
    expect(objective.hasObjective).toBe(true);
    expect(objective.visitsRequired).toBe(10);
    expect(objective.rewardLabel).toBe(programView.rewards[0]!.name);
  });
});
