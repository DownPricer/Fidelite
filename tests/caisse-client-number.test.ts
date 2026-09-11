import { beforeEach, describe, expect, it, vi } from "vitest";
import { scanSchema } from "../src/lib/validation";
import { readManualClientNumber, postCaisseScan } from "../src/lib/scan-session";
import { QrInputError } from "../src/lib/qr-input";

const userFindFirst = vi.fn();
const fifeLifeQrTokenFindUnique = vi.fn();
const fifeLifeQrTokenCreate = vi.fn();

vi.mock("../src/lib/prisma", () => {
  const tx = {
    fifeLifeQrToken: {
      findUnique: (...args: unknown[]) => fifeLifeQrTokenFindUnique(...args),
      update: vi.fn(async () => ({})),
      create: (...args: unknown[]) => fifeLifeQrTokenCreate(...args),
    },
    merchant: {
      findFirst: vi.fn(async () => null),
      findUnique: vi.fn(async () => ({
        id: "merchant_demo",
        name: "Demo",
        slug: "demo",
        logoUrl: null,
        primaryColor: "#875BFF",
        isActive: true,
        status: "ACTIVE",
      })),
    },
    loyaltyProgram: {
      findUnique: vi.fn(async () => ({
        id: "prog_demo",
        merchantId: "merchant_demo",
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
        rewards: [],
      })),
    },
    customerMembership: {
      findFirst: vi.fn(async () => ({
        id: "membership_1",
        points: 3,
        user: { firstName: "Alice", lastName: null },
      })),
      create: vi.fn(),
      update: vi.fn(),
    },
    caisseGrant: {
      create: vi.fn(async () => ({
        id: "grant_client",
        expiresAt: new Date("2026-08-30T12:01:30.000Z"),
        createdAt: new Date(),
      })),
    },
    walletEvent: { create: vi.fn() },
    merchantCardTemplate: { findFirst: vi.fn(async () => null) },
  };

  return {
    prisma: {
      $transaction: async (callback: (tx: typeof tx) => Promise<unknown>) => callback(tx),
      user: { findFirst: (...args: unknown[]) => userFindFirst(...args) },
      ...tx,
    },
  };
});

const { processCaisseScanByClientNumber } = await import("../src/lib/caisse-scan");
const { CaisseScanError } = await import("../src/lib/caisse-scan-errors");

describe("scanSchema — body explicite", () => {
  it("accepte QR et numéro client séparément", () => {
    expect(
      scanSchema.safeParse({ inputType: "QR", value: "eyJhbGciOiJIUzI1NiJ9.abc.signature" }).success,
    ).toBe(true);
    expect(scanSchema.safeParse({ inputType: "CLIENT_NUMBER", value: "482 917" }).success).toBe(true);
  });

  it("refuse un body legacy token/clientNumber", () => {
    expect(scanSchema.safeParse({ token: "1234567890" }).success).toBe(false);
    expect(scanSchema.safeParse({ clientNumber: "482917" }).success).toBe(false);
  });

  it("refuse un numéro brut présenté comme QR", () => {
    expect(scanSchema.safeParse({ inputType: "QR", value: "482917" }).success).toBe(false);
  });
});

describe("readManualClientNumber", () => {
  it("normalise espaces et tirets", () => {
    expect(readManualClientNumber("482 917")).toBe("482917");
    expect(readManualClientNumber("482-917")).toBe("482917");
  });

  it("rejette un numéro trop court", () => {
    expect(() => readManualClientNumber("123")).toThrow(QrInputError);
    expect(() => readManualClientNumber("123")).toThrow("Numéro client invalide.");
  });
});

describe("postCaisseScan — lecture JSON sûre", () => {
  it("ne plante pas sur une réponse vide", async () => {
    const fetchMock = vi.fn(async () => ({
      ok: false,
      status: 400,
      headers: { get: () => "application/json" },
      json: async () => {
        throw new Error("Unexpected end of JSON input");
      },
    }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await postCaisseScan({ inputType: "CLIENT_NUMBER", value: "482917" });
    expect(result.ok).toBe(false);
    expect(result.data.error).toBe("Une erreur est survenue. Réessayez.");

    vi.unstubAllGlobals();
  });
});

describe("processCaisseScanByClientNumber", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    userFindFirst.mockResolvedValue({
      id: "user_1",
      firstName: "Alice",
      lastName: null,
      clientNumber: "482917",
      isActive: true,
    });
    fifeLifeQrTokenFindUnique.mockResolvedValue({
      id: "global_qr_1",
      userId: "user_1",
      jti: "jti_1",
    });
  });

  it("recherche par numéro normalisé exact", async () => {
    const result = await processCaisseScanByClientNumber({
      clientNumber: "482917",
      merchantId: "merchant_demo",
      actorUserId: "staff_1",
    });

    expect(result.grantId).toBe("grant_client");
    expect(userFindFirst).toHaveBeenCalledWith({
      where: { clientNumber: "482917", isActive: true },
    });
  });

  it("signale un client introuvable", async () => {
    userFindFirst.mockResolvedValueOnce(null);
    await expect(
      processCaisseScanByClientNumber({
        clientNumber: "999999",
        merchantId: "merchant_demo",
        actorUserId: "staff_1",
      }),
    ).rejects.toBeInstanceOf(CaisseScanError);
  });
});
