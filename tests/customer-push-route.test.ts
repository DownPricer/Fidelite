import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const requireMutatingRequest = vi.fn();
const requireUser = vi.fn();
const pushSubscriptionUpsert = vi.fn();
const pushSubscriptionDeleteMany = vi.fn();

vi.mock("@/lib/api-guard", () => ({ requireMutatingRequest, requireUser }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    pushSubscription: {
      upsert: (...args: unknown[]) => pushSubscriptionUpsert(...args),
      deleteMany: (...args: unknown[]) => pushSubscriptionDeleteMany(...args),
    },
  },
}));

function req(method: string, body: unknown) {
  return new NextRequest("http://localhost:3000/api/customer/push", {
    method,
    headers: { "Content-Type": "application/json", origin: "http://localhost:3000" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  requireMutatingRequest.mockResolvedValue({ error: null });
  requireUser.mockResolvedValue({ error: null, user: { id: "user_1" } });
});

describe("POST /api/customer/push", () => {
  it("enregistre un abonnement par appareil (upsert sur l'endpoint)", async () => {
    const { POST } = await import("../src/app/api/customer/push/route");
    const response = await POST(
      req("POST", { endpoint: "https://push.example.com/abc", keys: { p256dh: "p", auth: "a" } }),
    );
    expect(response.status).toBe(200);
    expect(pushSubscriptionUpsert).toHaveBeenCalledWith(
      expect.objectContaining({ where: { endpoint: "https://push.example.com/abc" } }),
    );
  });

  it("rejette un endpoint invalide", async () => {
    const { POST } = await import("../src/app/api/customer/push/route");
    const response = await POST(req("POST", { endpoint: "not-a-url", keys: { p256dh: "p", auth: "a" } }));
    expect(response.status).toBe(400);
    expect(pushSubscriptionUpsert).not.toHaveBeenCalled();
  });

  it("exige une connexion", async () => {
    requireUser.mockResolvedValueOnce({ error: new Response(null, { status: 401 }), user: null });
    const { POST } = await import("../src/app/api/customer/push/route");
    const response = await POST(
      req("POST", { endpoint: "https://push.example.com/abc", keys: { p256dh: "p", auth: "a" } }),
    );
    expect(response.status).toBe(401);
  });
});

describe("DELETE /api/customer/push", () => {
  it("supprime uniquement les abonnements de l'utilisateur courant", async () => {
    const { DELETE } = await import("../src/app/api/customer/push/route");
    await DELETE(req("DELETE", { endpoint: "https://push.example.com/abc" }));
    expect(pushSubscriptionDeleteMany).toHaveBeenCalledWith({
      where: { endpoint: "https://push.example.com/abc", userId: "user_1" },
    });
  });
});
