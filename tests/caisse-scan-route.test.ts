import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const requireMutatingRequest = vi.fn();
const requireCaisse = vi.fn();
const processCaisseScan = vi.fn();
const processCaisseScanByClientNumber = vi.fn();
const writeAudit = vi.fn();

vi.mock("@/lib/api-guard", () => ({
  requireMutatingRequest,
  requireCaisse,
}));

vi.mock("@/lib/caisse-scan", () => ({
  processCaisseScan,
  processCaisseScanByClientNumber,
}));

vi.mock("@/lib/audit", () => ({
  writeAudit,
}));

const rateLimit = vi.fn(() => ({ ok: true as const, remaining: 1 }));

vi.mock("@/lib/rate-limit", () => ({
  LIMITS: {
    scan: { limit: 40, windowMs: 60_000 },
    clientNumberLookup: { limit: 20, windowMs: 60_000 },
  },
  rateLimit: (...args: unknown[]) => rateLimit(...(args as [string, number, number])),
}));

function makePost(body: unknown) {
  return new NextRequest("http://localhost:3000/api/caisse/scan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      origin: "http://localhost:3000",
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/caisse/scan", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    rateLimit.mockImplementation(() => ({ ok: true as const, remaining: 1 }));
    requireMutatingRequest.mockResolvedValue({ error: null });
    requireCaisse.mockResolvedValue({
      error: null,
      user: { id: "staff_1" },
      membership: { merchantId: "merchant_demo", id: "membership_staff" },
    });
    processCaisseScanByClientNumber.mockResolvedValue({
      grantId: "grant_1",
      firstName: "Alice",
      points: 3,
      programMode: "VISITS",
    });
  });

  it("accepte le body CLIENT_NUMBER explicite", async () => {
    const { POST } = await import("../src/app/api/caisse/scan/route");
    const response = await POST(makePost({ inputType: "CLIENT_NUMBER", value: "482917" }));

    expect(response.status).toBe(200);
    expect(processCaisseScanByClientNumber).toHaveBeenCalledWith({
      clientNumber: "482917",
      merchantId: "merchant_demo",
      actorUserId: "staff_1",
    });
  });

  it("normalise un numéro formaté avant recherche", async () => {
    const { POST } = await import("../src/app/api/caisse/scan/route");
    const response = await POST(makePost({ inputType: "CLIENT_NUMBER", value: "482 917" }));

    expect(response.status).toBe(200);
    expect(processCaisseScanByClientNumber).toHaveBeenCalledWith(
      expect.objectContaining({ clientNumber: "482917" }),
    );
  });

  it("retourne 400 JSON pour un body legacy", async () => {
    const { POST } = await import("../src/app/api/caisse/scan/route");
    const response = await POST(makePost({ clientNumber: "482917" }));
    const payload = (await response.json()) as { error: string; code: string };

    expect(response.status).toBe(400);
    expect(payload.error).toBeTruthy();
    expect(payload.code).toBeTruthy();
    expect(processCaisseScanByClientNumber).not.toHaveBeenCalled();
  });

  it("retourne 404 JSON quand le client est absent", async () => {
    const { CaisseScanError } = await import("../src/lib/caisse-scan-errors");
    processCaisseScanByClientNumber.mockRejectedValueOnce(
      new CaisseScanError("Client introuvable.", "CLIENT_NOT_FOUND", 404),
    );

    const { POST } = await import("../src/app/api/caisse/scan/route");
    const response = await POST(makePost({ inputType: "CLIENT_NUMBER", value: "999999" }));
    const payload = (await response.json()) as { error: string; code: string };

    expect(response.status).toBe(404);
    expect(payload.error).toBe("Client introuvable.");
    expect(payload.code).toBe("CLIENT_NOT_FOUND");
  });

  describe("confirmation d'adhésion (2.1)", () => {
    it("renvoie 409 MEMBERSHIP_CONFIRMATION_REQUIRED sans créer l'adhésion quand le client n'a pas encore la carte", async () => {
      const { CaisseScanError } = await import("../src/lib/caisse-scan-errors");
      processCaisseScan.mockRejectedValueOnce(
        new CaisseScanError(
          "Ajouter Léa au programme de fidélité de ce commerce ?",
          "MEMBERSHIP_CONFIRMATION_REQUIRED",
          409,
          { firstName: "Léa", lastName: "Martin", merchantName: "Café Demo" },
        ),
      );

      const { POST } = await import("../src/app/api/caisse/scan/route");
      const response = await POST(makePost({ inputType: "QR", value: "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJhIn0.abcDEF123_-" }));
      const payload = (await response.json()) as Record<string, unknown>;

      expect(response.status).toBe(409);
      expect(payload.code).toBe("MEMBERSHIP_CONFIRMATION_REQUIRED");
      expect(payload.firstName).toBe("Léa");
      expect(payload.merchantName).toBe("Café Demo");
      // Ce n'est pas un refus : pas d'entrée CAISSE_SCAN_DENIED dans l'audit.
      expect(writeAudit).not.toHaveBeenCalledWith(expect.objectContaining({ action: "CAISSE_SCAN_DENIED" }));
    });

    it("crée l'adhésion seulement après confirmNewMembership=true", async () => {
      processCaisseScan.mockResolvedValueOnce({
        grantId: "grant_new",
        firstName: "Léa",
        points: 0,
        programMode: "VISITS",
        cardJustCreated: true,
      });

      const { POST } = await import("../src/app/api/caisse/scan/route");
      const response = await POST(
        makePost({ inputType: "QR", value: "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJhIn0.abcDEF123_-", confirmNewMembership: true }),
      );

      expect(response.status).toBe(200);
      expect(processCaisseScan).toHaveBeenCalledWith(
        expect.objectContaining({ confirmNewMembership: true }),
      );
    });

    it("n'applique pas la garde anti-double-scan à un renvoi de confirmation", async () => {
      const calls: string[] = [];
      rateLimit.mockImplementation((key: string) => {
        calls.push(key);
        return { ok: true as const, remaining: 1 };
      });
      processCaisseScan.mockResolvedValue({ grantId: "g", firstName: "Léa", points: 0, programMode: "VISITS" });

      const { POST } = await import("../src/app/api/caisse/scan/route");
      await POST(makePost({ inputType: "QR", value: "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJhIn0.abcDEF123_-", confirmNewMembership: true }));

      expect(calls.some((key) => key.startsWith("scan-token:"))).toBe(false);
    });

    it("isole strictement entre commerces : le merchantId vient toujours de la session caisse, jamais du body", async () => {
      processCaisseScan.mockResolvedValueOnce({ grantId: "g", firstName: "Léa", points: 0, programMode: "VISITS" });

      const { POST } = await import("../src/app/api/caisse/scan/route");
      await POST(
        makePost({
          inputType: "QR",
          value: "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJhIn0.abcDEF123_-",
          // Un merchantId injecté dans le body ne doit avoir aucun effet.
          merchantId: "merchant_attacker",
        } as unknown as Record<string, unknown>),
      );

      expect(processCaisseScan).toHaveBeenCalledWith(
        expect.objectContaining({ merchantId: "merchant_demo" }),
      );
    });
  });
});
