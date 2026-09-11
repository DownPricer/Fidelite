import { beforeEach, describe, expect, it, vi } from "vitest";
import { signQrToken } from "../src/lib/qr";

const fifeLifeQrTokenFindUnique = vi.fn();
const fifeLifeQrTokenUpdate = vi.fn();
const merchantFindFirst = vi.fn();
const merchantFindUnique = vi.fn();
const loyaltyProgramFindUnique = vi.fn();
const customerMembershipFindFirst = vi.fn();
const customerMembershipCreate = vi.fn();
const customerMembershipUpdate = vi.fn();
const caisseGrantCreate = vi.fn();
const walletEventCreate = vi.fn();
const merchantCardTemplateFindFirst = vi.fn();

vi.mock("../src/lib/prisma", () => {
  const tx = {
    fifeLifeQrToken: {
      findUnique: (...args: unknown[]) => fifeLifeQrTokenFindUnique(...args),
      update: (...args: unknown[]) => fifeLifeQrTokenUpdate(...args),
    },
    merchant: {
      findFirst: (...args: unknown[]) => merchantFindFirst(...args),
      findUnique: (...args: unknown[]) => merchantFindUnique(...args),
    },
    loyaltyProgram: {
      findUnique: (...args: unknown[]) => loyaltyProgramFindUnique(...args),
    },
    customerMembership: {
      findFirst: (...args: unknown[]) => customerMembershipFindFirst(...args),
      create: (...args: unknown[]) => customerMembershipCreate(...args),
      update: (...args: unknown[]) => customerMembershipUpdate(...args),
    },
    caisseGrant: {
      create: (...args: unknown[]) => caisseGrantCreate(...args),
    },
    walletEvent: {
      create: (...args: unknown[]) => walletEventCreate(...args),
    },
    merchantCardTemplate: {
      findFirst: (...args: unknown[]) => merchantCardTemplateFindFirst(...args),
    },
    loyaltyTransaction: {
      count: vi.fn(async () => 0),
      findFirst: vi.fn(async () => null),
    },
  };

  return {
    prisma: {
      $transaction: async (callback: (tx: typeof tx) => Promise<unknown>) => callback(tx),
      ...tx,
    },
  };
});

const { processCaisseScan } = await import("../src/lib/caisse-scan");

const merchantId = "merchant_demo";
const actorUserId = "staff_1";
const qrGlobalId = "global_qr_1";
const membershipId = "membership_1";
const jti = "card_fixed_123";

const membership = {
  id: membershipId,
  points: 3,
  user: { firstName: "Alice" },
  merchant: {
    id: merchantId,
    program: {
      visitsRequired: 10,
      rewardLabel: "1 boisson offerte",
    },
  },
};

describe("processCaisseScan — QR global Fife Life", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fifeLifeQrTokenFindUnique.mockResolvedValue({
      id: qrGlobalId,
      jti,
      userId: "user_1",
      lastScannedAt: new Date("2026-08-30T11:00:00.000Z"),
      user: { id: "user_1", firstName: "Alice" },
    });
    fifeLifeQrTokenUpdate.mockResolvedValue({});
    merchantFindFirst.mockResolvedValue({
      id: merchantId,
      name: "Demo Commerce",
      slug: "demo-commerce",
      logoUrl: null,
      primaryColor: "#875BFF",
      isActive: true,
      program: {
        mode: "VISITS",
        visitsRequired: 10,
        rewardLabel: "1 boisson offerte",
      },
    });
    merchantFindUnique.mockResolvedValue({
      id: merchantId,
      name: "Demo Commerce",
      slug: "demo-commerce",
      logoUrl: null,
      primaryColor: "#875BFF",
      isActive: true,
      status: "ACTIVE",
    });
    loyaltyProgramFindUnique.mockResolvedValue({
      id: "prog_demo",
      merchantId,
      mode: "VISITS",
      status: "ACTIVE",
      visitsRequired: 10,
      rewardLabel: "1 boisson offerte",
      config: { visitsPerScan: 1 },
      draftConfig: null,
      version: 1,
      publishedAt: new Date(),
      scheduledAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      rewards: [
        {
          id: "reward_demo",
          programId: "prog_demo",
          name: "1 boisson offerte",
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
    });
    merchantCardTemplateFindFirst.mockResolvedValue(null);
    customerMembershipFindFirst.mockResolvedValue(membership);
    customerMembershipCreate.mockResolvedValue(membership);
    customerMembershipUpdate.mockResolvedValue(membership);
    caisseGrantCreate
      .mockResolvedValueOnce({
        id: "grant_1",
        expiresAt: new Date("2026-08-30T12:01:30.000Z"),
      })
      .mockResolvedValueOnce({
        id: "grant_2",
        expiresAt: new Date("2026-08-30T12:03:00.000Z"),
      });
    walletEventCreate.mockResolvedValue({
      id: "wallet_evt_1",
      type: "CARD_UNLOCKED",
    });
  });

  it("accepte deux scans successifs avec exactement le même QR et le même commerce", async () => {
    const token = await signQrToken({ jti });

    const first = await processCaisseScan({ token, merchantId, actorUserId });
    const second = await processCaisseScan({ token, merchantId, actorUserId });

    expect(first.grantId).toBe("grant_1");
    expect(second.grantId).toBe("grant_2");
    expect(first.firstName).toBe("Alice");
    expect(second.firstName).toBe("Alice");
    expect(caisseGrantCreate).toHaveBeenCalledTimes(2);
    expect(fifeLifeQrTokenUpdate).toHaveBeenCalledTimes(2);
    expect(caisseGrantCreate).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        data: expect.objectContaining({ qrTokenId: qrGlobalId, merchantId, actorUserId }),
      }),
    );
    expect(caisseGrantCreate).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        data: expect.objectContaining({ qrTokenId: qrGlobalId, merchantId, actorUserId }),
      }),
    );
  });

  it("crée une carte pour un nouveau commerce lors du premier scan", async () => {
    customerMembershipFindFirst.mockResolvedValueOnce(null);

    const token = await signQrToken({ jti });
    const result = await processCaisseScan({ token, merchantId, actorUserId });

    expect(result.cardJustCreated).toBe(true);
    expect(customerMembershipCreate).toHaveBeenCalledTimes(1);
    expect(walletEventCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          type: "CARD_UNLOCKED",
        }),
      }),
    );
  });
});
