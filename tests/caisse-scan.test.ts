import { beforeEach, describe, expect, it, vi } from "vitest";
import { signQrToken } from "../src/lib/qr";

const qrTokenFindUnique = vi.fn();
const qrTokenUpdate = vi.fn();
const customerMembershipFindFirst = vi.fn();
const caisseGrantCreate = vi.fn();

vi.mock("../src/lib/prisma", () => ({
  prisma: {
    qrToken: {
      findUnique: (...args: unknown[]) => qrTokenFindUnique(...args),
      update: (...args: unknown[]) => qrTokenUpdate(...args),
    },
    customerMembership: {
      findFirst: (...args: unknown[]) => customerMembershipFindFirst(...args),
    },
    caisseGrant: {
      create: (...args: unknown[]) => caisseGrantCreate(...args),
    },
  },
}));

const { processCaisseScan } = await import("../src/lib/caisse-scan");

const merchantId = "merchant_demo";
const actorUserId = "staff_1";
const qrTokenId = "qrtoken_1";
const membershipId = "membership_1";
const jti = "card_fixed_123";

const membership = {
  id: membershipId,
  points: 3,
  user: { firstName: "Alice" },
  merchant: {
    program: {
      visitsRequired: 10,
      rewardLabel: "1 boisson offerte",
    },
  },
};

describe("processCaisseScan — QR fixe réutilisable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    qrTokenFindUnique.mockResolvedValue({
      id: qrTokenId,
      jti,
      merchantId,
      customerMembershipId: membershipId,
      usedAt: new Date("2026-08-30T11:00:00.000Z"),
    });
    qrTokenUpdate.mockResolvedValue({});
    customerMembershipFindFirst.mockResolvedValue(membership);
    caisseGrantCreate
      .mockResolvedValueOnce({
        id: "grant_1",
        expiresAt: new Date("2026-08-30T12:01:30.000Z"),
      })
      .mockResolvedValueOnce({
        id: "grant_2",
        expiresAt: new Date("2026-08-30T12:03:00.000Z"),
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
    expect(qrTokenUpdate).toHaveBeenCalledTimes(2);
    expect(caisseGrantCreate).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        data: expect.objectContaining({ qrTokenId, merchantId, actorUserId }),
      }),
    );
    expect(caisseGrantCreate).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        data: expect.objectContaining({ qrTokenId, merchantId, actorUserId }),
      }),
    );
  });
});
