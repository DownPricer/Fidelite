import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const requireMutatingRequest = vi.fn();
const requireUser = vi.fn();
const tryEnsureCustomerMembershipForSlug = vi.fn();
const generateCustomerQrDataUrl = vi.fn();
const isCustomerQrInfrastructureError = vi.fn();

vi.mock("@/lib/api-guard", () => ({
  requireMutatingRequest,
  requireUser,
}));

vi.mock("@/lib/customer-qr", () => ({
  tryEnsureCustomerMembershipForSlug,
  generateCustomerQrDataUrl,
  isCustomerQrInfrastructureError,
}));

vi.mock("@/lib/rate-limit", () => ({
  LIMITS: { qr: { limit: 10, windowMs: 60_000 } },
  rateLimit: () => ({ ok: true }),
}));

function makePost(body: unknown) {
  return new NextRequest("http://localhost:3000/api/customer/qr", {
    method: "POST",
    headers: { "Content-Type": "application/json", origin: "http://localhost:3000" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/customer/qr", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireMutatingRequest.mockResolvedValue({ error: null });
    isCustomerQrInfrastructureError.mockReturnValue(false);
  });

  it("expose la route dans le build source", () => {
    const routePath = resolve(process.cwd(), "src/app/api/customer/qr/route.ts");
    const source = readFileSync(routePath, "utf8");
    expect(source).toContain("export async function POST");
    expect(source).toContain('export const runtime = "nodejs"');
    expect(source).toContain("generateCustomerQrDataUrl");
    expect(source).not.toContain("jsonError(membership.error, 404)");
  });

  it("refuse sans session client", async () => {
    requireUser.mockResolvedValue({
      error: new Response(JSON.stringify({ error: "Connexion requise." }), { status: 401 }),
      user: null,
    });

    const { POST } = await import("../src/app/api/customer/qr/route");
    const response = await POST(makePost({ slug: "fife-life" }));
    expect(response.status).toBe(401);
  });

  it("retourne le QR même si le commerce du slug est introuvable", async () => {
    requireUser.mockResolvedValue({
      error: null,
      user: { id: "user-1", email: "lea@example.com" },
    });
    tryEnsureCustomerMembershipForSlug.mockResolvedValue({ ensured: false, merchant: null });
    generateCustomerQrDataUrl.mockResolvedValue({
      image: "data:image/png;base64,abc",
      jti: "jti-1",
    });

    const { POST } = await import("../src/app/api/customer/qr/route");
    const response = await POST(makePost({ slug: "fife-life" }));
    expect(response.status).toBe(200);

    const payload = (await response.json()) as { image: string };
    expect(payload.image).toBe("data:image/png;base64,abc");
    expect(generateCustomerQrDataUrl).toHaveBeenCalledWith("user-1");
  });

  it("retourne une erreur serveur explicite si la migration QR manque", async () => {
    requireUser.mockResolvedValue({
      error: null,
      user: { id: "user-1", email: "lea@example.com" },
    });
    tryEnsureCustomerMembershipForSlug.mockResolvedValue({ ensured: false, merchant: null });
    generateCustomerQrDataUrl.mockRejectedValue(new Error("table missing"));
    isCustomerQrInfrastructureError.mockReturnValue(true);

    const { POST } = await import("../src/app/api/customer/qr/route");
    const response = await POST(makePost({ slug: "fife-life" }));
    expect(response.status).toBe(503);
  });
});

describe("wallet — client QR", () => {
  it("vérifie response.ok et le content-type JSON", () => {
    const source = readFileSync(resolve(process.cwd(), "src/components/fife-life/qr-cache.ts"), "utf8");
    expect(source).toContain("if (!response.ok)");
    expect(source).toContain('includes("application/json")');
    expect(source).toContain("logWalletQrClient");
    expect(source).toContain("errorMessage");
  });

  it("réutilise signQrToken via customer-qr (compatible scanner caisse)", () => {
    const source = readFileSync(resolve(process.cwd(), "src/lib/customer-qr.ts"), "utf8");
    expect(source).toContain("signQrToken");
    expect(source).toContain("fifeLifeQrToken");
    expect(source).toContain("ensureCustomerQrToken");
  });
});
