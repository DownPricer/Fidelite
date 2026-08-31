import { describe, expect, it, vi } from "vitest";
import { LoyaltyTxType } from "@prisma/client";

const customerMembershipFindFirst = vi.fn();
const customerMembershipUpdate = vi.fn();
const loyaltyTransactionCreate = vi.fn();
const walletEventCreate = vi.fn();
const userUpdate = vi.fn();
const fifeLifeLedgerCreate = vi.fn();

vi.mock("../src/lib/prisma", () => {
  const tx = {
    customerMembership: {
      findFirst: (...args: unknown[]) => customerMembershipFindFirst(...args),
      update: (...args: unknown[]) => customerMembershipUpdate(...args),
    },
    loyaltyTransaction: {
      create: (...args: unknown[]) => loyaltyTransactionCreate(...args),
    },
    walletEvent: {
      create: (...args: unknown[]) => walletEventCreate(...args),
    },
    user: {
      update: (...args: unknown[]) => userUpdate(...args),
    },
    fifeLifePointsLedger: {
      create: (...args: unknown[]) => fifeLifeLedgerCreate(...args),
    },
  };

  return {
    prisma: {
      $transaction: async (callback: (tx: typeof tx) => Promise<unknown>) => callback(tx),
      ...tx,
    },
  };
});

vi.mock("../src/lib/audit", () => ({
  writeAudit: vi.fn(async () => undefined),
}));

vi.mock("../src/lib/google-wallet", () => ({
  updateWalletBalance: vi.fn(async () => undefined),
}));

const { applyLoyaltyAction } = await import("../src/lib/loyalty-service");

const baseMembership = {
  id: "membership_1",
  userId: "user_1",
  points: 10,
  googleWalletClassId: null as string | null,
  merchant: {
    id: "merchant_1",
    name: "Café Demo",
    program: {
      visitsRequired: 10,
      rewardLabel: "1 boisson offerte",
    },
  },
  user: {
    id: "user_1",
    firstName: "Alice",
    fifeLifePoints: 0,
  },
};

describe("points Fife Life globaux", () => {
  it("un simple passage ne donne aucun point Fife Life", async () => {
    vi.clearAllMocks();
    customerMembershipFindFirst.mockResolvedValue({
      ...baseMembership,
      points: 3,
    });
    customerMembershipUpdate.mockResolvedValue({
      ...baseMembership,
      points: 4,
    });
    loyaltyTransactionCreate.mockResolvedValue({ id: "tx_1" });

    const result = await applyLoyaltyAction({
      membershipId: baseMembership.id,
      merchantId: baseMembership.merchant.id,
      actorId: "staff_1",
      type: LoyaltyTxType.EARN_VISIT,
    });

    expect(result.fifeLifePoints).toBe(0);
    expect(userUpdate).not.toHaveBeenCalled();
    expect(
      walletEventCreate.mock.calls.some(([args]) =>
        (args as any).data?.type === "FIFE_LIFE_POINTS_UPDATED",
      ),
    ).toBe(false);
  });

  it("une récompense validée crédite des points Fife Life configurés", async () => {
    vi.clearAllMocks();
    customerMembershipFindFirst.mockResolvedValue({
      ...baseMembership,
      points: 10,
    });
    customerMembershipUpdate.mockResolvedValue({
      ...baseMembership,
      points: 0,
    });
    loyaltyTransactionCreate.mockResolvedValue({ id: "tx_2" });
    userUpdate.mockResolvedValue({
      ...baseMembership.user,
      fifeLifePoints: 12,
    });

    const result = await applyLoyaltyAction({
      membershipId: baseMembership.id,
      merchantId: baseMembership.merchant.id,
      actorId: "staff_1",
      type: LoyaltyTxType.REDEEM_REWARD,
      reason: "Récompense utilisée",
    });

    expect(result.fifeLifePoints).toBe(12);
    expect(userUpdate).toHaveBeenCalledTimes(1);
    expect(fifeLifeLedgerCreate).toHaveBeenCalledTimes(1);
    expect(
      walletEventCreate.mock.calls.some(([args]) =>
        (args as any).data?.type === "FIFE_LIFE_POINTS_UPDATED",
      ),
    ).toBe(true);
  });
});


