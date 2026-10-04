import { describe, expect, it, vi } from "vitest";
import { createFakeAdDb } from "./helpers/fake-ad-db";

vi.mock("@/lib/email", () => ({ isValidEmailAddress: () => true, sendCampaignEmail: vi.fn(async () => undefined) }));
vi.mock("@/lib/push", () => ({ sendPushToUser: vi.fn(async () => undefined) }));
vi.mock("@/lib/super-admin-session", () => ({ isSuperAdminEmailAllowed: () => true }));

const fake = createFakeAdDb();
vi.mock("@/lib/prisma", () => ({ prisma: fake.prisma }));

describe("deliverStaffNotificationSideEffects — idempotence", () => {
  it("n'envoie qu'une fois e-mail et push pour la même clé dedupe", async () => {
    const { deliverStaffNotificationSideEffects } = await import("@/lib/staff-notification-delivery");
    const { sendCampaignEmail } = await import("@/lib/email");
    const { sendPushToUser } = await import("@/lib/push");

    fake.tables.user.push({
      id: "u1",
      email: "admin@shop.test",
      firstName: "Jean",
      platformRole: null,
      isActive: true,
    });
    fake.tables.merchantMembership.push({
      id: "mm1",
      merchantId: "m1",
      userId: "u1",
      role: "MERCHANT_ADMIN",
      isActive: true,
    });

    const input = {
      audience: "MERCHANT" as const,
      kind: "BANNER_PROPOSED",
      message: "Votre visuel est prêt à valider.",
      merchantId: "m1",
      campaignId: "c1",
      adRequestId: "ad1",
    };

    await deliverStaffNotificationSideEffects(fake.prisma, input);
    await deliverStaffNotificationSideEffects(fake.prisma, input);

    expect(sendPushToUser).toHaveBeenCalledTimes(1);
    expect(sendCampaignEmail).toHaveBeenCalledTimes(1);
    expect(fake.tables.staffNotificationDispatch).toHaveLength(2);
  });
});
