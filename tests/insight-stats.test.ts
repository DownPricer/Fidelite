/**
 * Tests d'intégration Fideto Insight (nécessite PostgreSQL, comme employee-create.integration.test.ts).
 */
import { randomUUID } from "crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "../src/lib/prisma";
import { getFreeMerchantStats, getHomeStats, getInsightPremium, hasAnyRecordedRevenue } from "../src/lib/insight-stats";
import { resolvePeriod } from "../src/lib/insight-period";

describe("Fideto Insight — agrégations (PostgreSQL)", () => {
  let dbReady = false;
  const suffix = randomUUID().slice(0, 8);
  let merchantAId = "";
  let merchantBId = "";
  let userAId = "";
  let membershipAId = "";
  let staffUserId = "";

  beforeAll(async () => {
    if (!process.env.DATABASE_URL) return;
    try {
      await prisma.$queryRaw`SELECT 1`;

      const [merchantA, merchantB, customer, staff] = await Promise.all([
        prisma.merchant.create({ data: { name: `Insight Test A ${suffix}`, slug: `insight-test-a-${suffix}` } }),
        prisma.merchant.create({ data: { name: `Insight Test B ${suffix}`, slug: `insight-test-b-${suffix}` } }),
        prisma.user.create({
          data: {
            email: `insight-client-${suffix}@test.local`,
            passwordHash: "x",
            firstName: "Client",
          },
        }),
        prisma.user.create({
          data: {
            email: `insight-staff-${suffix}@test.local`,
            passwordHash: "x",
            firstName: "Staff",
          },
        }),
      ]);
      merchantAId = merchantA.id;
      merchantBId = merchantB.id;
      userAId = customer.id;
      staffUserId = staff.id;

      const membershipA = await prisma.customerMembership.create({
        data: { userId: customer.id, merchantId: merchantAId },
      });
      membershipAId = membershipA.id;

      const now = new Date();
      const daysAgo = (n: number) => new Date(now.getTime() - n * 86_400_000);

      // Merchant A : passages avec montant réel (finance dispo), sur plusieurs jours.
      await prisma.loyaltyTransaction.createMany({
        data: [
          {
            customerMembershipId: membershipAId,
            merchantId: merchantAId,
            type: "EARN_VISIT",
            pointsDelta: 1,
            purchaseAmountCents: 1200,
            performedByUserId: staff.id,
            createdAt: daysAgo(1),
          },
          {
            customerMembershipId: membershipAId,
            merchantId: merchantAId,
            type: "EARN_VISIT",
            pointsDelta: 1,
            purchaseAmountCents: 1800,
            performedByUserId: staff.id,
            createdAt: daysAgo(3),
          },
        ],
      });

      // Merchant B : un client, un passage, jamais de montant renseigné.
      const membershipB = await prisma.customerMembership.create({
        data: { userId: customer.id, merchantId: merchantBId },
      });
      await prisma.loyaltyTransaction.create({
        data: {
          customerMembershipId: membershipB.id,
          merchantId: merchantBId,
          type: "EARN_VISIT",
          pointsDelta: 1,
          performedByUserId: staff.id,
          createdAt: daysAgo(1),
        },
      });

      dbReady = true;
    } catch {
      // PostgreSQL indisponible — les tests seront ignorés individuellement.
    }
  });

  afterAll(async () => {
    if (!dbReady) return;
    await prisma.loyaltyTransaction.deleteMany({ where: { merchantId: { in: [merchantAId, merchantBId] } } });
    await prisma.customerMembership.deleteMany({ where: { merchantId: { in: [merchantAId, merchantBId] } } });
    await prisma.merchant.deleteMany({ where: { id: { in: [merchantAId, merchantBId] } } });
    await prisma.user.deleteMany({ where: { id: { in: [userAId, staffUserId] } } });
    await prisma.$disconnect();
  });

  it("n'affiche la section financière que si un montant réel a été enregistré", async (ctx) => {
    if (!dbReady) ctx.skip();
    expect(await hasAnyRecordedRevenue(merchantAId)).toBe(true);
    expect(await hasAnyRecordedRevenue(merchantBId)).toBe(false);
  });

  it("isole les statistiques entre deux commerces", async (ctx) => {
    if (!dbReady) ctx.skip();
    const range = resolvePeriod("30d");
    const [statsA, statsB] = await Promise.all([
      getFreeMerchantStats(merchantAId, range),
      getFreeMerchantStats(merchantBId, range),
    ]);

    expect(statsA.totalClients).toBe(1);
    expect(statsB.totalClients).toBe(1);
    expect(statsA.revenue).not.toBeNull();
    expect(statsB.revenue).toBeNull();
  });

  it("calcule le tableau de bord premium sans NaN/Infinity et avec la finance conditionnelle", async (ctx) => {
    if (!dbReady) ctx.skip();
    const range = resolvePeriod("30d");
    const [premiumA, premiumB] = await Promise.all([
      getInsightPremium(merchantAId, range),
      getInsightPremium(merchantBId, range),
    ]);

    expect(premiumA.financial).not.toBeNull();
    expect(premiumA.financial?.revenue.current).toBe(3000);
    expect(premiumB.financial).toBeNull();

    for (const metric of Object.values(premiumA.overview)) {
      expect(Number.isNaN(metric.changePct)).toBe(false);
      if (metric.changePct !== null) expect(Number.isFinite(metric.changePct)).toBe(true);
    }
  });

  it("calcule les KPIs de l'accueil commerçant avec des évolutions réelles, isolées par commerce", async (ctx) => {
    if (!dbReady) ctx.skip();
    const [homeA, homeB] = await Promise.all([getHomeStats(merchantAId), getHomeStats(merchantBId)]);

    // Merchant A a 2 passages sur les 7 derniers jours (fixtures daysAgo(1) et daysAgo(3)).
    expect(homeA.passagesThisWeek.current).toBe(2);
    // Merchant B a 1 passage sur les 7 derniers jours (fixture daysAgo(1)).
    expect(homeB.passagesThisWeek.current).toBe(1);

    for (const metric of Object.values(homeA)) {
      expect(Number.isNaN(metric.changePct)).toBe(false);
      if (metric.changePct !== null) expect(Number.isFinite(metric.changePct)).toBe(true);
    }
  });
});
