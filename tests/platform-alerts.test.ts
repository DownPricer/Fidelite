/**
 * Tests d'intégration des alertes et de l'activité récente super-admin (nécessite PostgreSQL,
 * comme employee-create.integration.test.ts).
 */
import { randomUUID } from "crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "../src/lib/prisma";
import { getPlatformAlerts, getPlatformRecentActivity } from "../src/lib/platform-stats";

describe("Alertes et activité récente plateforme (PostgreSQL)", () => {
  let dbReady = false;
  const suffix = randomUUID().slice(0, 8);
  let merchantId = "";
  let merchantId2 = "";

  beforeAll(async () => {
    if (!process.env.DATABASE_URL) return;
    try {
      await prisma.$queryRaw`SELECT 1`;

      const merchant = await prisma.merchant.create({
        data: { name: `Alertes Test ${suffix}`, slug: `alertes-test-${suffix}` },
      });
      merchantId = merchant.id;

      await prisma.merchantSubscription.create({
        data: {
          merchantId,
          insightEnabled: false,
          insightRequestedAt: new Date(),
        },
      });

      await prisma.auditLog.create({
        data: { merchantId, action: "MERCHANT_CREATE", metadata: { suffix } },
      });

      dbReady = true;
    } catch {
      // PostgreSQL indisponible — les tests seront ignorés individuellement.
    }
  });

  afterAll(async () => {
    if (!dbReady) return;
    const ids = [merchantId, merchantId2].filter(Boolean);
    await prisma.auditLog.deleteMany({ where: { merchantId: { in: ids } } });
    await prisma.merchantSubscription.deleteMany({ where: { merchantId: { in: ids } } });
    await prisma.merchant.deleteMany({ where: { id: { in: ids } } });
    await prisma.$disconnect();
  });

  it("compte au moins une demande Fidelo Insight en attente après une nouvelle demande", async (ctx) => {
    if (!dbReady) ctx.skip();
    const before = await getPlatformAlerts();
    const merchant2 = await prisma.merchant.create({ data: { name: `Alertes Test 2 ${suffix}`, slug: `alertes-test-2-${suffix}` } });
    merchantId2 = merchant2.id;
    await prisma.merchantSubscription.create({
      data: { merchantId: merchant2.id, insightEnabled: false, insightRequestedAt: new Date() },
    });
    const after = await getPlatformAlerts();
    expect(after.insightPending).toBeGreaterThanOrEqual(before.insightPending);
    expect(after.insightPending).toBeGreaterThan(0);
  });

  it("n'expose que des actions à portée plateforme dans l'activité récente", async (ctx) => {
    if (!dbReady) ctx.skip();
    // Un événement client bruyant (non filtré) ne doit jamais apparaître.
    await prisma.auditLog.create({ data: { merchantId, action: "EARN_VISIT" } });

    const activity = await getPlatformRecentActivity(20);
    expect(activity.some((entry) => entry.action === "EARN_VISIT")).toBe(false);
    expect(activity.some((entry) => entry.action === "MERCHANT_CREATE" && entry.merchantName?.startsWith("Alertes Test"))).toBe(true);
  });
});
