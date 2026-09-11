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

vi.mock("@/lib/rate-limit", () => ({
  LIMITS: {
    scan: { limit: 40, windowMs: 60_000 },
    clientNumberLookup: { limit: 20, windowMs: 60_000 },
  },
  rateLimit: () => ({ ok: true }),
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
});
