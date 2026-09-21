import { requireMerchantAdmin } from "@/lib/api-guard";
import { jsonError, jsonOk } from "@/lib/http";
import { isGoogleWalletConfigured } from "@/lib/google-wallet";
import { getFreeMerchantStats, getHomeStats } from "@/lib/insight-stats";
import { resolvePeriod } from "@/lib/insight-period";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const merchantId = staff.membership.merchantId;
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [customers, visitsToday, rewards, employees, recent, merchant, statsPreview, homeStats] = await Promise.all([
    prisma.customerMembership.count({ where: { merchantId } }),
    prisma.loyaltyTransaction.count({
      where: { merchantId, type: "EARN_VISIT", createdAt: { gte: startOfDay } },
    }),
    prisma.loyaltyTransaction.count({ where: { merchantId, type: "REDEEM_REWARD" } }),
    prisma.merchantMembership.count({
      where: { merchantId, role: "EMPLOYEE", isActive: true },
    }),
    prisma.loyaltyTransaction.findMany({
      where: { merchantId },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        membership: { include: { user: true } },
        performedBy: true,
      },
    }),
    prisma.merchant.findUnique({
      where: { id: merchantId },
      include: { program: true },
    }),
    getFreeMerchantStats(merchantId, resolvePeriod("7d")),
    getHomeStats(merchantId),
  ]);

  return jsonOk({
    merchant: {
      name: merchant?.name,
      slug: merchant?.slug,
      logoUrl: merchant?.logoUrl,
      primaryColor: merchant?.primaryColor,
      visitsRequired: merchant?.program?.visitsRequired,
      rewardLabel: merchant?.program?.rewardLabel,
    },
    stats: { customers, visitsToday, rewards, employees },
    homeStats,
    statsPreview: {
      totalClients: statsPreview.totalClients,
      newClientsThisWeek: statsPreview.newClientsThisWeek,
      passagesThisWeek: statsPreview.passagesThisWeek,
      passagesSeries: statsPreview.passagesSeries,
    },
    walletStatus: isGoogleWalletConfigured() ? "ready" : "unavailable",
    recent: recent.map((item) => ({
      id: item.id,
      type: item.type,
      pointsDelta: item.pointsDelta,
      firstName: item.membership.user.firstName,
      actor: item.performedBy.firstName,
      createdAt: item.createdAt,
    })),
  });
}
