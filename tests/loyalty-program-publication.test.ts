import { describe, expect, it, vi } from "vitest";
import {
  REWARD_LIMIT_MESSAGE,
  assertRewardLimit,
  createAcquiredRewardEntitlements,
  modeChangeRequiresRewardDecision,
  publishLoyaltyProgram,
  type LoyaltyProgramDraft,
} from "@/lib/loyalty-program-publication";

vi.mock("@/lib/loyalty-context", () => ({
  buildCustomerProgramView: vi.fn(() => ({
    progressTarget: 30,
    rewards: [{ name: "Nouveau café" }],
    programTitle: "Par passages",
    programDescription: "1 passage par achat",
    minimumPurchaseLabel: null,
  })),
  getActiveMerchantLoyaltyContext: vi.fn(async () => ({ isOperational: true })),
}));

vi.mock("@/lib/merchant-card-template-service", () => ({
  normalizeResolvedPublishedTemplate: vi.fn(() => null),
  resolvePublishedMerchantCardTemplate: vi.fn(async () => null),
}));

const oldReward = {
  id: "old-reward",
  programId: "program-1",
  name: "10 % de réduction",
  description: "Sur votre prochain achat",
  iconUrl: null,
  rewardType: "PERCENT_DISCOUNT" as const,
  threshold: 10,
  thresholdUnit: "points",
  value: 10,
  minPurchase: null,
  maxDiscount: null,
  isActive: true,
  sortOrder: 0,
  validFrom: null,
  validUntil: null,
  maxUsesPerCustomer: null,
  reuseDelayDays: null,
  globalLimit: null,
  conditions: null,
  archivedAt: null,
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
};

const oldExpiringReward = {
  ...oldReward,
  id: "old-expiring",
  validUntil: new Date("2026-12-31"),
};

const program = {
  id: "program-1",
  merchantId: "merchant-1",
  mode: "FIXED_POINTS" as const,
  status: "ACTIVE" as const,
  visitsRequired: 10,
  rewardLabel: "10 % de réduction",
  config: { fixedPointsPerPurchase: 5 },
  draftConfig: null,
  version: 4,
  publishedAt: new Date("2026-01-01"),
  scheduledAt: null,
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
  rewards: [oldReward],
};

const draft: LoyaltyProgramDraft = {
  mode: "FIXED_POINTS",
  rules: { fixedPointsPerPurchase: 10 },
  rewards: [
    {
      id: "old-reward",
      name: "10 % de réduction",
      description: "Mis à jour",
      rewardType: "PERCENT_DISCOUNT",
      threshold: 15,
      thresholdUnit: "points",
      value: 10,
      minPurchase: null,
      maxDiscount: null,
      isActive: true,
      sortOrder: 0,
      validFrom: null,
      validUntil: null,
      maxUsesPerCustomer: 1,
      reuseDelayDays: null,
      globalLimit: null,
      archivedAt: null,
      conditions: null,
    },
  ],
};

function tx(overrides: Record<string, unknown> = {}) {
  return {
    customerMembership: {
      findMany: vi.fn(async () => [
        { id: "member-eligible", userId: "user-1", points: 12, pointsBalance: 12, visitsBalance: 0 },
        { id: "member-low", userId: "user-2", points: 8, pointsBalance: 8, visitsBalance: 0 },
      ]),
      update: vi.fn(async () => ({})),
    },
    customerRewardEntitlement: {
      upsert: vi.fn(async () => ({})),
    },
    loyaltyProgram: {
      update: vi.fn(async () => ({})),
      findUnique: vi.fn(async () => ({ ...program, rewards: draft.rewards.map((reward) => ({ ...oldReward, ...reward })) })),
    },
    loyaltyReward: {
      update: vi.fn(async () => ({})),
      create: vi.fn(async () => ({})),
      updateMany: vi.fn(async () => ({ count: 1 })),
    },
    loyaltyProgramVersion: {
      create: vi.fn(async () => ({})),
    },
    walletEvent: {
      create: vi.fn(async () => ({})),
    },
    auditLog: {
      create: vi.fn(async () => ({})),
    },
    ...overrides,
  } as any;
}

describe("publication programme fidélité", () => {
  it("refuse plus de 10 avantages configurés non archivés côté serveur", () => {
    expect(() => assertRewardLimit(Array.from({ length: 11 }, () => ({ archivedAt: null })))).toThrow(
      REWARD_LIMIT_MESSAGE,
    );
    expect(() =>
      assertRewardLimit([...Array.from({ length: 10 }, () => ({ archivedAt: null })), { archivedAt: new Date() }]),
    ).not.toThrow();
  });

  it("ne demande pas de conversion et conserve l'identifiant si le mode ne change pas", async () => {
    const db = tx();
    const result = await publishLoyaltyProgram({
      tx: db,
      program,
      merchant: null,
      draft,
      actorId: "admin-1",
    });
    expect(result.requiresRewardDecision).toBe(false);
    expect(db.loyaltyReward.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "old-reward" } }));
    expect(db.loyaltyReward.updateMany).not.toHaveBeenCalled();
    expect(db.customerRewardEntitlement.upsert).not.toHaveBeenCalled();
  });

  it("demande une décision si le mode change", async () => {
    expect(modeChangeRequiresRewardDecision("FIXED_POINTS", "VISITS")).toBe(true);
    expect(modeChangeRequiresRewardDecision("POINTS_BY_AMOUNT", "FIXED_POINTS")).toBe(false);
    const result = await publishLoyaltyProgram({
      tx: tx(),
      program,
      merchant: null,
      draft: { ...draft, mode: "VISITS" },
      actorId: "admin-1",
    });
    expect(result.requiresRewardDecision).toBe(true);
  });

  it("ne demande pas de décision si aucun avantage incompatible actif n'existe", async () => {
    const db = tx();
    const result = await publishLoyaltyProgram({
      tx: db,
      program: { ...program, rewards: [] },
      merchant: null,
      draft: { ...draft, mode: "VISITS", rewards: [{ ...draft.rewards[0]!, id: undefined, thresholdUnit: "visits" }] },
      actorId: "admin-1",
    });
    expect(result.requiresRewardDecision).toBe(false);
    expect(db.loyaltyReward.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ thresholdUnit: "visits" }) }),
    );
  });

  it("archive les anciens avantages sans créer de droits si la politique le demande", async () => {
    const db = tx();
    await publishLoyaltyProgram({
      tx: db,
      program,
      merchant: null,
      draft: { ...draft, mode: "VISITS", rewards: [{ ...draft.rewards[0]!, id: undefined, thresholdUnit: "visits" }] },
      actorId: "admin-1",
      decision: { action: "ARCHIVE_OLD" },
      now: new Date("2026-09-15"),
    });
    expect(db.loyaltyReward.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ isActive: false }) }),
    );
    expect(db.customerRewardEntitlement.upsert).not.toHaveBeenCalled();
    expect(db.customerMembership.update).not.toHaveBeenCalled();
  });

  it("convertit les avantages déjà acquis en droits conservés sans transformer les soldes", async () => {
    const db = tx();
    await publishLoyaltyProgram({
      tx: db,
      program,
      merchant: null,
      draft: { ...draft, mode: "VISITS", rewards: [{ ...draft.rewards[0]!, id: undefined, thresholdUnit: "visits" }] },
      actorId: "admin-1",
      decision: { action: "CONVERT", rewards: [] },
    });
    expect(db.loyaltyReward.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ thresholdUnit: "visits" }) }),
    );
    expect(db.customerRewardEntitlement.upsert).toHaveBeenCalledTimes(1);
    expect(db.customerMembership.update).not.toHaveBeenCalled();
    expect(db.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: "LOYALTY_PROGRAM_UNIT_SWITCH",
          metadata: expect.objectContaining({
            previousMode: "FIXED_POINTS",
            nextMode: "VISITS",
            balancePolicy: "separate_unit_balances",
            rewardPolicy: "CONVERT",
          }),
        }),
      }),
    );
  });

  it("valide les avantages du brouillon publié même avec une politique de conservation", async () => {
    await expect(
      publishLoyaltyProgram({
        tx: tx(),
        program,
        merchant: null,
        draft: {
          ...draft,
          mode: "VISITS",
          rewards: Array.from({ length: 11 }, (_, index) => ({
            ...draft.rewards[0]!,
            id: undefined,
            name: `Avantage ${index + 1}`,
            threshold: index + 1,
            thresholdUnit: "visits",
          })),
        },
        actorId: "admin-1",
        decision: { action: "CONVERT", rewards: [] },
      }),
    ).rejects.toThrow(REWARD_LIMIT_MESSAGE);
  });

  it("crée un droit acquis intemporel pour un client déjà éligible", async () => {
    const db = tx();
    await createAcquiredRewardEntitlements(db, {
      program,
      merchantId: "merchant-1",
      now: new Date("2026-09-15"),
    });
    expect(db.customerRewardEntitlement.upsert).toHaveBeenCalledTimes(1);
    expect(db.customerRewardEntitlement.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ create: expect.objectContaining({ expiresAt: null, historicalBalance: 12 }) }),
    );
  });

  it("conserve la date d'expiration d'origine du droit acquis", async () => {
    const db = tx();
    await createAcquiredRewardEntitlements(db, {
      program: { ...program, rewards: [oldExpiringReward] },
      merchantId: "merchant-1",
      now: new Date("2026-09-15"),
    });
    expect(db.customerRewardEntitlement.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ create: expect.objectContaining({ expiresAt: new Date("2026-12-31") }) }),
    );
  });

  it("publie un événement wallet de rafraîchissement synchronisé avec le mode actif", async () => {
    const db = tx();
    await publishLoyaltyProgram({
      tx: db,
      program,
      merchant: { id: "merchant-1", slug: "demo", name: "Demo" },
      draft: { ...draft, mode: "VISITS", rewards: [{ ...draft.rewards[0]!, id: undefined, thresholdUnit: "visits" }] },
      actorId: "admin-1",
      decision: { action: "ARCHIVE_OLD" },
    });
    expect(db.walletEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          type: "MERCHANT_CARD_UPDATED",
          payload: expect.objectContaining({ loyaltyMode: "VISITS", refreshOnly: true }),
        }),
      }),
    );
  });
});
