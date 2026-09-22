import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const requireMutatingRequest = vi.fn();
const requireUser = vi.fn();
const inAppNotificationFindMany = vi.fn();
const inAppNotificationCount = vi.fn();
const inAppNotificationUpdateMany = vi.fn();

vi.mock("@/lib/api-guard", () => ({ requireMutatingRequest, requireUser }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    inAppNotification: {
      findMany: (...args: unknown[]) => inAppNotificationFindMany(...args),
      count: (...args: unknown[]) => inAppNotificationCount(...args),
      updateMany: (...args: unknown[]) => inAppNotificationUpdateMany(...args),
    },
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  requireMutatingRequest.mockResolvedValue({ error: null });
  requireUser.mockResolvedValue({ error: null, user: { id: "user_1" } });
  inAppNotificationFindMany.mockResolvedValue([]);
  inAppNotificationCount.mockResolvedValue(0);
});

describe("GET /api/customer/notifications", () => {
  it("scope toujours la requête à l'utilisateur connecté", async () => {
    const { GET } = await import("../src/app/api/customer/notifications/route");
    await GET(new NextRequest("http://localhost:3000/api/customer/notifications"));
    expect(inAppNotificationFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ userId: "user_1" }) }),
    );
    expect(inAppNotificationCount).toHaveBeenCalledWith({ where: { userId: "user_1", readAt: null } });
  });

  it("filtre sur les offres quand demandé", async () => {
    const { GET } = await import("../src/app/api/customer/notifications/route");
    await GET(new NextRequest("http://localhost:3000/api/customer/notifications?filter=offers"));
    expect(inAppNotificationFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ kind: { in: ["MERCHANT_OFFER", "NETWORK_DEAL"] } }),
      }),
    );
  });
});

describe("PATCH /api/customer/notifications", () => {
  it("marque tout comme lu, scopé à l'utilisateur", async () => {
    const { PATCH } = await import("../src/app/api/customer/notifications/route");
    await PATCH(
      new NextRequest("http://localhost:3000/api/customer/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", origin: "http://localhost:3000" },
        body: JSON.stringify({ all: true }),
      }),
    );
    expect(inAppNotificationUpdateMany).toHaveBeenCalledWith({
      where: { userId: "user_1", readAt: null },
      data: { readAt: expect.any(Date) },
    });
  });

  it("marque une seule notification, jamais celle d'un autre utilisateur", async () => {
    const { PATCH } = await import("../src/app/api/customer/notifications/route");
    await PATCH(
      new NextRequest("http://localhost:3000/api/customer/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", origin: "http://localhost:3000" },
        body: JSON.stringify({ id: "notif_1" }),
      }),
    );
    expect(inAppNotificationUpdateMany).toHaveBeenCalledWith({
      where: { id: "notif_1", userId: "user_1" },
      data: { readAt: expect.any(Date) },
    });
  });
});
