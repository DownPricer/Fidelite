import { describe, expect, it } from "vitest";
import { buildProgramSnapshot, publicScanPayload } from "../src/lib/caisse-program";
import type { LoyaltyProgram } from "@prisma/client";

const baseProgram = {
  id: "p1",
  merchantId: "m1",
  mode: "VISITS" as const,
  status: "ACTIVE" as const,
  visitsRequired: 10,
  rewardLabel: "Boisson offerte",
  config: {},
  draftConfig: null,
  version: 1,
  publishedAt: null,
  scheduledAt: null,
  updatedAt: new Date(),
  createdAt: new Date(),
  rewards: [],
} satisfies LoyaltyProgram & { rewards: [] };

describe("programme caisse employé", () => {
  it("formate un programme par passages", () => {
    const snapshot = buildProgramSnapshot(3, baseProgram);
    expect(snapshot.progressLabel).toBe("3 / 10 passages");
    expect(snapshot.earnPreviewLabel).toBe("Valider un passage");
    expect(snapshot.requirePurchaseAmount).toBe(false);
  });

  it("exige un montant pour les points selon achat", () => {
    const snapshot = buildProgramSnapshot(120, {
      ...baseProgram,
      mode: "POINTS_BY_AMOUNT",
      config: { pointsPerAmount: 1, amountForPoints: 1, requirePurchaseAmount: true },
    });
    expect(snapshot.requirePurchaseAmount).toBe(true);
    expect(snapshot.earnPreviewLabel).toBe("Valider les points");
  });

  it("limite la réponse scan aux données minimales", () => {
    const payload = publicScanPayload({
      grantId: "g1",
      firstName: "Léa",
      program: baseProgram,
      points: 4,
      expiresAt: new Date().toISOString(),
    });
    expect(payload.firstName).toBe("Léa");
    expect(payload).not.toHaveProperty("email");
    expect(payload).not.toHaveProperty("phone");
    expect(payload.programMode).toBe("VISITS");
  });
});
