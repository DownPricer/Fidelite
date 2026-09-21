import { requireMerchantStatsAccess } from "@/lib/api-guard";
import { jsonError, jsonOk } from "@/lib/http";
import { getFreeMerchantStats, getInsightPremium, getLockedInsightPlaceholder } from "@/lib/insight-stats";
import { resolvePeriod, type InsightPeriodKey } from "@/lib/insight-period";
import { prisma } from "@/lib/prisma";

const PERIOD_KEYS: InsightPeriodKey[] = ["7d", "30d", "90d", "12m", "custom"];

export async function GET(req: Request) {
  const staff = await requireMerchantStatsAccess(req);
  if (staff.error || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const merchantId = staff.membership.merchantId;
  const url = new URL(req.url);
  const periodParam = url.searchParams.get("period") ?? "30d";
  const period = PERIOD_KEYS.includes(periodParam as InsightPeriodKey) ? (periodParam as InsightPeriodKey) : "30d";

  let custom: { from: Date; to: Date } | undefined;
  if (period === "custom") {
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;
    if (!fromDate || Number.isNaN(fromDate.getTime()) || !toDate || Number.isNaN(toDate.getTime())) {
      return jsonError("Période personnalisée invalide.", 400);
    }
    custom = { from: fromDate, to: toDate };
  }

  const range = resolvePeriod(period, new Date(), custom);

  const subscription = await prisma.merchantSubscription.findUnique({
    where: { merchantId },
    select: { insightEnabled: true },
  });
  const insightEnabled = subscription?.insightEnabled ?? false;

  const free = await getFreeMerchantStats(merchantId, range);

  if (!insightEnabled) {
    return jsonOk({
      period,
      free,
      locked: true,
      premium: null,
      previewPlaceholder: getLockedInsightPlaceholder(),
    });
  }

  const premium = await getInsightPremium(merchantId, range);
  return jsonOk({ period, free, locked: false, premium, previewPlaceholder: null });
}
