import { beforeEach, describe, expect, it, vi } from "vitest";

const globalObjects = [
  { id: "g1", userId: "u1", googleObjectId: "issuer.global.u1" },
  { id: "g2", userId: "u2", googleObjectId: "issuer.global.u2" },
  { id: "g3", userId: "u3", googleObjectId: "issuer.global.u3" },
  { id: "g4", userId: "u4", googleObjectId: "issuer.global.u4" },
];

const findMany = vi.fn();
const findFirst = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    googleWalletObject: {
      findMany: (...args: unknown[]) => findMany(...args),
      findFirst: (...args: unknown[]) => findFirst(...args),
      findUnique: vi.fn().mockResolvedValue(null),
      update: vi.fn().mockResolvedValue({}),
    },
  },
}));

vi.mock("@/lib/env", () => ({
  isGoogleWalletConfigured: () => true,
  env: { googleWalletOrigin: "https://fideto.fr" },
}));

beforeEach(() => {
  vi.clearAllMocks();
  findMany.mockImplementation(async (args: { where?: { merchantId?: null } }) => {
    if (args?.where?.merchantId === null) return globalObjects;
    return [];
  });
  findFirst.mockResolvedValue(null);
});

describe("diffusion test → sync cartes globales uniquement", () => {
  it("ne parcourt que les LoyaltyObject globaux (merchantId et customerMembershipId null)", async () => {
    vi.resetModules();
    const gw = await import("../src/lib/google-wallet");
    const result = await gw.syncAllGoogleWalletGlobalObjects({
      clearCampaignModule: false,
      verifyRemoteHero: "dedicated-wallet-hero",
    });

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ merchantId: null, customerMembershipId: null }),
      }),
    );
    expect(result.attempted).toBe(4);
    expect(findFirst).toHaveBeenCalledTimes(4);
    for (const call of findFirst.mock.calls) {
      expect(call[0]).toMatchObject({
        where: expect.objectContaining({ merchantId: null, customerMembershipId: null }),
      });
    }
  });
});
