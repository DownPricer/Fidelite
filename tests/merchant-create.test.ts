import { beforeEach, describe, expect, it, vi } from "vitest";
import { ALL_MERCHANT_CARD_SLOTS } from "@/lib/merchant-card-slots";
import {
  createAllModeTemplatesForMerchant,
  createMerchantCardSlots,
} from "@/lib/merchant-card-template-service";

const merchantFindUnique = vi.fn();
const userFindUnique = vi.fn();
const transaction = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    merchant: { findUnique: (...args: unknown[]) => merchantFindUnique(...args) },
    user: { findUnique: (...args: unknown[]) => userFindUnique(...args) },
    $transaction: (...args: unknown[]) => transaction(...args),
  },
}));

vi.mock("@/lib/password", () => ({
  hashPassword: vi.fn(async () => "hashed"),
}));

describe("createMerchantCardSlots", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("utilise le client transactionnel passé en paramètre", async () => {
    const txFindFirst = vi.fn().mockResolvedValue(null);
    const txCreate = vi.fn().mockImplementation(({ data }) =>
      Promise.resolve({ id: `tpl-${data.cardSlot}`, ...data }),
    );
    const tx = {
      merchantCardTemplate: {
        findFirst: txFindFirst,
        create: txCreate,
      },
    };

    await createMerchantCardSlots(tx as never, "merchant-1", {
      activeMode: "VISITS",
    });

    expect(txFindFirst).toHaveBeenCalledTimes(5);
    expect(txCreate).toHaveBeenCalledTimes(5);
    expect(ALL_MERCHANT_CARD_SLOTS).toHaveLength(5);
  });

  it("crée les cinq emplacements dans l’ordre attendu", async () => {
    const txFindFirst = vi.fn().mockResolvedValue(null);
    const txCreate = vi.fn().mockImplementation(({ data }) =>
      Promise.resolve({ id: `tpl-${data.cardSlot}`, ...data }),
    );
    const tx = {
      merchantCardTemplate: {
        findFirst: txFindFirst,
        create: txCreate,
      },
    };

    const created = await createAllModeTemplatesForMerchant({
      db: tx as never,
      merchantId: "merchant-2",
      activeMode: "FIXED_POINTS",
    });

    expect(created).toHaveLength(5);
    const slots = txCreate.mock.calls.map((call) => call[0].data.cardSlot);
    expect(slots).toEqual(ALL_MERCHANT_CARD_SLOTS);
  });

  it("propage une erreur de gabarit sans créer de commerce partiel côté transaction", async () => {
    let createCount = 0;
    const txFindFirst = vi.fn().mockResolvedValue(null);
    const txCreate = vi.fn().mockImplementation(({ data }) => {
      createCount += 1;
      if (createCount === 3) {
        return Promise.reject(new Error("Foreign key constraint violated"));
      }
      return Promise.resolve({ id: `tpl-${data.cardSlot}`, ...data });
    });
    const tx = {
      merchantCardTemplate: {
        findFirst: txFindFirst,
        create: txCreate,
      },
    };

    await expect(
      createMerchantCardSlots(tx as never, "merchant-rollback", { activeMode: "VISITS" }),
    ).rejects.toThrow(/Foreign key/i);
    expect(txCreate).toHaveBeenCalledTimes(3);
  });
});

describe("createMerchantFull", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    merchantFindUnique.mockResolvedValue(null);
    userFindUnique.mockResolvedValue(null);
  });

  it("passe le même tx à createMerchantCardSlots", async () => {
    const txFindFirst = vi.fn().mockResolvedValue(null);
    const txCreate = vi.fn().mockImplementation(({ data }) =>
      Promise.resolve({ id: `tpl-${data.cardSlot}`, ...data }),
    );

    transaction.mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) =>
      callback({
        merchant: {
          create: vi.fn().mockResolvedValue({
            id: "merchant-new",
            slug: "cafe-test",
          }),
        },
        user: {
          create: vi.fn().mockResolvedValue({ id: "user-new" }),
        },
        merchantMembership: { create: vi.fn().mockResolvedValue({}) },
        loyaltyProgram: {
          findUniqueOrThrow: vi.fn().mockResolvedValue({ id: "prog-1" }),
        },
        loyaltyReward: { create: vi.fn().mockResolvedValue({}) },
        merchantCardTemplate: {
          findFirst: txFindFirst,
          create: txCreate,
        },
      }),
    );

    const { createMerchantFull } = await import("@/lib/merchant-create-service");
    const result = await createMerchantFull({
      identity: {
        name: "Café Test",
        slug: "cafe-test",
      },
      legal: {},
      availability: {},
      admin: {
        firstName: "Admin",
        email: "admin@cafe-test.local",
        password: "Motdepasse1",
      },
      program: {
        mode: "VISITS",
        rewardLabel: "Boisson offerte",
      },
      subscription: {
        plan: "STARTER",
        amount: 29,
        frequency: "MONTHLY",
      },
    });

    expect(result.merchant.id).toBe("merchant-new");
    expect(txCreate).toHaveBeenCalledTimes(5);
  });

  it("refuse un slug déjà utilisé", async () => {
    merchantFindUnique.mockResolvedValue({ id: "existing" });
    const { createMerchantFull } = await import("@/lib/merchant-create-service");
    await expect(
      createMerchantFull({
        identity: { name: "Dup", slug: "dup" },
        legal: {},
        availability: {},
        admin: { firstName: "A", email: "a@dup.local", password: "Motdepasse1" },
        program: { mode: "VISITS", rewardLabel: "Reward" },
        subscription: { plan: "STARTER", amount: 29, frequency: "MONTHLY" },
      }),
    ).rejects.toThrow("SLUG_TAKEN");
    expect(transaction).not.toHaveBeenCalled();
  });
});

describe("POST /api/super-admin/merchants erreurs JSON", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("retourne 409 JSON pour slug existant", async () => {
    vi.doMock("@/lib/api-guard", () => ({
      requireMutatingRequest: vi.fn(async () => ({ error: null })),
      requireSuperAdmin: vi.fn(async () => ({ error: null, user: { id: "admin-1" } })),
    }));
    vi.doMock("@/lib/audit", () => ({ writeAudit: vi.fn() }));
    vi.doMock("@/lib/merchant-create-service", () => ({
      createMerchantFull: vi.fn(async () => {
        throw new Error("SLUG_TAKEN");
      }),
    }));

    const { POST } = await import("@/app/api/super-admin/merchants/route");
    const response = await POST(
      new Request("http://localhost/api/super-admin/merchants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identity: { name: "Test", slug: "test" },
          legal: {},
          availability: {},
          admin: {
            firstName: "A",
            lastName: "B",
            email: "a@test.local",
            password: "Motdepasse1",
            passwordConfirm: "Motdepasse1",
          },
          program: { mode: "VISITS", rewardLabel: "Reward" },
          subscription: { plan: "STARTER", amount: 29, frequency: "MONTHLY" },
        }),
      }),
    );

    const body = await response.json();
    expect(response.status).toBe(409);
    expect(body.error).toContain("slug");
    expect(body.code).toBe("SLUG_TAKEN");
  });

  it("retourne 500 JSON pour erreur serveur", async () => {
    vi.doMock("@/lib/api-guard", () => ({
      requireMutatingRequest: vi.fn(async () => ({ error: null })),
      requireSuperAdmin: vi.fn(async () => ({ error: null, user: { id: "admin-1" } })),
    }));
    vi.doMock("@/lib/audit", () => ({ writeAudit: vi.fn() }));
    vi.doMock("@/lib/merchant-create-service", () => ({
      createMerchantFull: vi.fn(async () => {
        throw new Error("P2003");
      }),
    }));

    const { POST } = await import("@/app/api/super-admin/merchants/route");
    const response = await POST(
      new Request("http://localhost/api/super-admin/merchants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identity: { name: "Test", slug: "test-2" },
          legal: {},
          availability: {},
          admin: {
            firstName: "A",
            lastName: "B",
            email: "b@test.local",
            password: "Motdepasse1",
            passwordConfirm: "Motdepasse1",
          },
          program: { mode: "VISITS", rewardLabel: "Reward" },
          subscription: { plan: "STARTER", amount: 29, frequency: "MONTHLY" },
        }),
      }),
    );

    const body = await response.json();
    expect(response.status).toBe(500);
    expect(body.error).toBe("Impossible de créer le commerce.");
    expect(body.code).toBe("MERCHANT_CREATE_FAILED");
  });
});

describe("createMerchantFull (PostgreSQL)", () => {
  it("crée un commerce avec cinq gabarits en transaction", async (ctx) => {
    if (!process.env.DATABASE_URL) {
      ctx.skip();
      return;
    }

    const { prisma } = await import("@/lib/prisma");
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      ctx.skip();
      return;
    }

    const slug = `integration-${Date.now()}`;
    const email = `${slug}@test.local`;
    const { createMerchantFull } = await import("@/lib/merchant-create-service");

    const result = await createMerchantFull({
      identity: { name: "Integration Test", slug },
      legal: {},
      availability: {},
      admin: { firstName: "Int", email, password: "Motdepasse1" },
      program: { mode: "VISITS", rewardLabel: "Reward" },
      subscription: { plan: "STARTER", amount: 29, frequency: "MONTHLY" },
    });

    const templates = await prisma.merchantCardTemplate.findMany({
      where: { merchantId: result.merchant.id },
    });
    expect(templates).toHaveLength(5);

    await prisma.merchantCardTemplate.deleteMany({ where: { merchantId: result.merchant.id } });
    await prisma.loyaltyReward.deleteMany({
      where: { program: { merchantId: result.merchant.id } },
    });
    await prisma.merchantMembership.deleteMany({ where: { merchantId: result.merchant.id } });
    await prisma.merchantSubscription.deleteMany({ where: { merchantId: result.merchant.id } });
    await prisma.loyaltyProgram.deleteMany({ where: { merchantId: result.merchant.id } });
    await prisma.user.deleteMany({ where: { email } });
    await prisma.merchant.delete({ where: { id: result.merchant.id } });
    await prisma.$disconnect();
  });
});
