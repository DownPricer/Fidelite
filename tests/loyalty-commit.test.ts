import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoyaltyError } from "../src/lib/loyalty";

const grantFindFirst = vi.fn();
const membershipFindFirst = vi.fn();
const txFindUnique = vi.fn();
const txFindFirst = vi.fn();
const txFindMany = vi.fn();
const txCount = vi.fn();
const queryRaw = vi.fn();
const grantUpdate = vi.fn();
const membershipUpdate = vi.fn();
const txCreate = vi.fn();
const walletEventCreate = vi.fn();
const merchantMembershipUpdateMany = vi.fn();

vi.mock("../src/lib/prisma", () => {
  const tx = {
    $queryRaw: (...args: unknown[]) => queryRaw(...args),
    caisseGrant: {
      findFirst: (...args: unknown[]) => grantFindFirst(...args),
      update: (...args: unknown[]) => grantUpdate(...args),
    },
    customerMembership: {
      findFirst: (...args: unknown[]) => membershipFindFirst(...args),
      update: (...args: unknown[]) => membershipUpdate(...args),
    },
    loyaltyTransaction: {
      findUnique: (...args: unknown[]) => txFindUnique(...args),
      findFirst: (...args: unknown[]) => txFindFirst(...args),
      findMany: (...args: unknown[]) => txFindMany(...args),
      count: (...args: unknown[]) => txCount(...args),
      create: (...args: unknown[]) => txCreate(...args),
    },
    walletEvent: { create: (...args: unknown[]) => walletEventCreate(...args) },
    merchantMembership: { updateMany: (...args: unknown[]) => merchantMembershipUpdateMany(...args) },
    user: { update: vi.fn() },
    fifeLifePointsLedger: { create: vi.fn() },
  };
  return {
    prisma: {
      $transaction: async (callback: (client: typeof tx) => Promise<unknown>) => callback(tx),
      ...tx,
    },
  };
});

vi.mock("../src/lib/audit", () => ({ writeAudit: vi.fn(async () => undefined) }));
vi.mock("../src/lib/google-wallet", () => ({ updateWalletBalance: vi.fn(async () => undefined) }));

const { commitLoyaltyTransaction, previewLoyaltyTransaction } = await import("../src/lib/loyalty-commit");

const program = {
  id: "p1",
  merchantId: "m1",
  mode: "VISITS" as const,
  status: "ACTIVE" as const,
  visitsRequired: 10,
  rewardLabel: "Boisson offerte",
  config: { visitsPerScan: 1, minPurchase: 0 },
  version: 1,
  rewards: [
    {
      id: "r1",
      name: "Boisson offerte",
      description: null,
      iconUrl: null,
      rewardType: "FREE_PRODUCT",
      threshold: 10,
      thresholdUnit: "visits",
      value: null,
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
    },
  ],
};

const membership = {
  id: "cm1",
  points: 6,
  merchantId: "m1",
  userId: "u1",
  googleWalletClassId: null,
  user: { id: "u1", firstName: "Léa", lastName: "Martin", fifeLifePoints: 0 },
  merchant: {
    id: "m1",
    name: "Café Demo",
    isActive: true,
    status: "ACTIVE",
    program,
  },
};

const grant = {
  id: "g1",
  actorUserId: "staff1",
  merchantId: "m1",
  customerMembershipId: "cm1",
  expiresAt: new Date(Date.now() + 60_000),
  createdAt: new Date(),
  earnCommittedAt: null,
  consumedAt: null,
};

describe("preview et commit caisse", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    grantFindFirst.mockResolvedValue(grant);
    membershipFindFirst.mockResolvedValue(membership);
    txFindUnique.mockResolvedValue(null);
    txFindFirst.mockResolvedValue(null);
    txFindMany.mockResolvedValue([]);
    txCount.mockResolvedValue(0);
    queryRaw.mockResolvedValue([{ id: "cm1" }]);
    membershipUpdate.mockResolvedValue({ ...membership, points: 7 });
    txCreate.mockResolvedValue({ id: "tx1" });
    grantUpdate.mockResolvedValue({ ...grant, earnCommittedAt: new Date() });
    walletEventCreate.mockResolvedValue({ id: "we1" });
    merchantMembershipUpdateMany.mockResolvedValue({ count: 1 });
  });

  it("prévisualise sans créer de transaction", async () => {
    const view = await previewLoyaltyTransaction({
      grantId: "g1",
      actorUserId: "staff1",
      merchantId: "m1",
      action: "EARN",
      purchaseAmountCents: 1800,
    });
    expect(view.committed).toBe(false);
    expect(view.earned).toBe(1);
    expect(txCreate).not.toHaveBeenCalled();
    expect(membershipUpdate).not.toHaveBeenCalled();
  });

  it("rejoue une clé d'idempotence déjà utilisée par le même employé", async () => {
    txFindUnique.mockResolvedValue({
      id: "tx1",
      merchantId: "m1",
      performedByUserId: "staff1",
      balanceBefore: 6,
      balanceAfter: 7,
      purchaseAmountCents: 1800,
      rewardId: null,
    });
    const view = await commitLoyaltyTransaction({
      grantId: "g1",
      actorUserId: "staff1",
      merchantId: "m1",
      action: "EARN",
      purchaseAmountCents: 1800,
      idempotencyKey: "same-key-123",
    });
    expect(view.committed).toBe(true);
    expect(view.points).toBe(7);
    expect(txCreate).not.toHaveBeenCalled();
  });

  it("refuse une clé d'idempotence réutilisée par un autre acteur", async () => {
    txFindUnique.mockResolvedValue({
      id: "tx1",
      merchantId: "m1",
      performedByUserId: "other",
      balanceAfter: 7,
    });
    await expect(
      commitLoyaltyTransaction({
        grantId: "g1",
        actorUserId: "staff1",
        merchantId: "m1",
        action: "EARN",
        purchaseAmountCents: 1800,
        idempotencyKey: "stolen-key-123",
      }),
    ).rejects.toThrow(/idempotence/);
  });

  it("refuse une seconde validation sur le même grant", async () => {
    grantFindFirst.mockResolvedValue({ ...grant, earnCommittedAt: new Date() });
    await expect(
      commitLoyaltyTransaction({
        grantId: "g1",
        actorUserId: "staff1",
        merchantId: "m1",
        action: "EARN",
        purchaseAmountCents: 1800,
        idempotencyKey: "second-key-123",
      }),
    ).rejects.toThrow(LoyaltyError);
  });

  it("refuse un grant expiré ou d'un autre commerce", async () => {
    grantFindFirst.mockResolvedValue(null);
    await expect(
      previewLoyaltyTransaction({
        grantId: "g1",
        actorUserId: "staff1",
        merchantId: "other",
        action: "EARN",
      }),
    ).rejects.toThrow(/expir/);
  });
});
