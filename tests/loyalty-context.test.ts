import { describe, expect, it } from "vitest";
import type { LoyaltyMode, LoyaltyProgram, LoyaltyReward } from "@prisma/client";
import {
  buildCustomerProgramView,
  progressTargetForBalance,
} from "@/lib/loyalty-context";
import { rewardsForProgramMode } from "@/lib/loyalty-program";
import { earnActionLabel, historyEntryLabel } from "@/lib/loyalty-labels";
import { buildProgramSnapshotFromContext } from "@/lib/caisse-program";
import { assertGrantMatchesActiveProgram, type ActiveMerchantLoyaltyContext } from "@/lib/loyalty-context";
import { programToConfig } from "@/lib/loyalty-program";

function mockProgram(mode: LoyaltyMode, rewards: Partial<LoyaltyReward>[]): LoyaltyProgram & { rewards: LoyaltyReward[] } {
  return {
    id: "prog-1",
    merchantId: "merchant-1",
    mode,
    status: "ACTIVE",
    visitsRequired: 30,
    rewardLabel: "1 café",
    config: {
      fixedPointsPerPurchase: 20,
      minPurchase: 10,
    },
    draftConfig: null,
    version: 3,
    publishedAt: new Date("2026-01-01"),
    scheduledAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    rewards: rewards.map((reward, index) => ({
      id: reward.id ?? `reward-${index}`,
      programId: "prog-1",
      name: reward.name ?? "Récompense",
      description: null,
      iconUrl: null,
      rewardType: "CUSTOM",
      threshold: reward.threshold ?? 10,
      thresholdUnit: reward.thresholdUnit ?? (mode === "VISITS" ? "visits" : "points"),
      value: null,
      minPurchase: null,
      maxDiscount: null,
      isActive: reward.isActive ?? true,
      sortOrder: index,
      validFrom: null,
      validUntil: null,
      maxUsesPerCustomer: null,
      reuseDelayDays: null,
      globalLimit: null,
      conditions: null,
    })),
  };
}

function mockContext(mode: LoyaltyMode, rewards: Partial<LoyaltyReward>[]): ActiveMerchantLoyaltyContext {
  const program = mockProgram(mode, rewards);
  const config = programToConfig(program, { activeOnly: true, filterByMode: true });
  return {
    merchant: {
      id: "merchant-1",
      name: "Demo",
      slug: "demo",
      logoUrl: null,
      primaryColor: "#875BFF",
      isActive: true,
      status: "ACTIVE",
    },
    program,
    programId: program.id,
    programVersion: program.version,
    mode: config.mode,
    config,
    unit: mode === "VISITS" || mode === "AMOUNT_TIERS" ? "passages" : "points",
    isOperational: true,
    publishedAt: program.publishedAt,
    cardTemplate: null,
    cardTemplateMeta: null,
    rewards: config.rewards,
    progressTarget: progressTargetForBalance(config, 0),
    primaryRewardLabel: config.rewards[0]?.name ?? null,
    programTitle: "Points fixes par achat",
    programDescription: "20 points par achat",
    minimumPurchaseLabel: "Minimum d'achat : 10,00 €",
  };
}

describe("rewardsForProgramMode", () => {
  it("conserve les récompenses VISITS quand le programme actif est VISITS", () => {
    const program = mockProgram("VISITS", [
      { id: "visit", name: "Café offert", threshold: 10, thresholdUnit: "visits", isActive: true },
      { id: "points", name: "Boisson offerte", threshold: 100, thresholdUnit: "points", isActive: true },
    ]);
    const filtered = rewardsForProgramMode(program.rewards, "VISITS");
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.name).toBe("Café offert");
    expect(filtered[0]?.thresholdUnit).toBe("visits");
  });

  it("ignore les récompenses d'un ancien mode VISITS quand le programme actif est FIXED_POINTS", () => {
    const program = mockProgram("FIXED_POINTS", [
      { id: "old", name: "1 café", threshold: 30, thresholdUnit: "visits", isActive: true },
      { id: "new", name: "Boisson offerte", threshold: 100, thresholdUnit: "points", isActive: true },
    ]);
    const filtered = rewardsForProgramMode(program.rewards, "FIXED_POINTS");
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.name).toBe("Boisson offerte");
    expect(filtered[0]?.thresholdUnit).toBe("points");
  });
});

describe("buildCustomerProgramView", () => {
  it("expose le programme FIXED_POINTS avec récompense en points", () => {
    const context = mockContext("FIXED_POINTS", [
      { name: "Boisson offerte", threshold: 100, thresholdUnit: "points" },
    ]);
    const view = buildCustomerProgramView(context, 40);
    expect(view.mode).toBe("FIXED_POINTS");
    expect(view.unit).toBe("points");
    expect(view.rewards).toHaveLength(1);
    expect(view.rewards[0]?.name).toBe("Boisson offerte");
    expect(view.upcomingRemaining).toBe(60);
  });
});

describe("caisse snapshot FIXED_POINTS", () => {
  it("propose Valider +X points", () => {
    const context = mockContext("FIXED_POINTS", [
      { name: "Boisson offerte", threshold: 100, thresholdUnit: "points" },
    ]);
    const snapshot = buildProgramSnapshotFromContext(40, context);
    expect(snapshot.mode).toBe("FIXED_POINTS");
    expect(snapshot.unitLabel).toBe("points");
    expect(snapshot.earnPreviewLabel).toContain("points");
    expect(snapshot.progressLabel).toContain("points");
    expect(snapshot.rewardLabel).toBe("Boisson offerte");
  });
});

describe("libellés dynamiques", () => {
  it("utilise Valider +20 points pour FIXED_POINTS", () => {
    expect(earnActionLabel("FIXED_POINTS", 20)).toBe("Valider +20 points");
    expect(earnActionLabel("VISITS", 1)).toBe("Valider le passage");
  });
});

describe("historique", () => {
  it("conserve le libellé passage pour une ancienne transaction VISITS", () => {
    const old = historyEntryLabel({
      type: "EARN_VISIT",
      pointsDelta: 1,
      metadata: { mode: "VISITS", unit: "passages", earnLabel: "+1 passage" },
    });
    expect(old.title).toContain("passage");
    expect(old.deltaLabel).toContain("passage");
  });

  it("libelle une nouvelle transaction FIXED_POINTS en points", () => {
    const recent = historyEntryLabel({
      type: "EARN_VISIT",
      pointsDelta: 20,
      metadata: { mode: "FIXED_POINTS", unit: "points", earnLabel: "+20 points par achat" },
      ruleApplied: "20 points par achat",
    });
    expect(recent.deltaLabel).toContain("points");
  });
});

describe("grant programme actif", () => {
  it("refuse un grant obsolète après changement de version", () => {
    const context = mockContext("FIXED_POINTS", [
      { name: "Boisson offerte", threshold: 100, thresholdUnit: "points" },
    ]);
    expect(() =>
      assertGrantMatchesActiveProgram(
        { programId: context.programId, programVersion: 2, programMode: "VISITS" },
        context,
      ),
    ).toThrow(/Rescannez/);
  });
});
