import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { signUnsubscribeToken } from "../src/lib/unsubscribe-token";

const customerPreferencesUpdateMany = vi.fn();
const consentEventCreateMany = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: async (callback: (tx: unknown) => Promise<unknown>) =>
      callback({
        customerPreferences: { updateMany: (...args: unknown[]) => customerPreferencesUpdateMany(...args) },
        consentEvent: { createMany: (...args: unknown[]) => consentEventCreateMany(...args) },
      }),
  },
}));

function req(token: string) {
  return new NextRequest("http://localhost:3000/api/public/unsubscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/public/unsubscribe — aucune connexion requise", () => {
  it("retire uniquement le champ scopé par le jeton, pour cet utilisateur", async () => {
    const token = await signUnsubscribeToken({ userId: "user_1", scope: "adsMerchantEmail" });
    const { POST } = await import("../src/app/api/public/unsubscribe/route");
    const response = await POST(req(token));
    const payload = (await response.json()) as { ok: boolean; scope: string };

    expect(response.status).toBe(200);
    expect(payload.scope).toBe("adsMerchantEmail");
    expect(customerPreferencesUpdateMany).toHaveBeenCalledWith({
      where: { userId: "user_1" },
      data: { adsMerchantEmail: false },
    });
    expect(consentEventCreateMany).toHaveBeenCalledWith({
      data: [
        expect.objectContaining({
          userId: "user_1",
          field: "adsMerchantEmail",
          value: false,
          source: "email_unsubscribe_link",
        }),
      ],
    });
  });

  it("rejette un jeton invalide sans lever", async () => {
    const { POST } = await import("../src/app/api/public/unsubscribe/route");
    const response = await POST(req("garbage"));
    expect(response.status).toBe(400);
    expect(customerPreferencesUpdateMany).not.toHaveBeenCalled();
  });

  it("all_marketing retire tous les canaux de prospection en un seul geste", async () => {
    const token = await signUnsubscribeToken({ userId: "user_1", scope: "all_marketing" });
    const { POST } = await import("../src/app/api/public/unsubscribe/route");
    await POST(req(token));

    expect(customerPreferencesUpdateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          notifyMerchantOffers: false,
          notifyFifeLifeNews: false,
          adsMerchantPush: false,
          adsMerchantEmail: false,
          adsNetworkPush: false,
          adsNetworkEmail: false,
        }),
      }),
    );
  });
});
