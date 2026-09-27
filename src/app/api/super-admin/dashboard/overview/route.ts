import { requireSuperAdmin } from "@/lib/api-guard";
import { jsonOk } from "@/lib/http";
import { getPlatformAlerts, getPlatformOverview, getPlatformRecentActivity, getSponsoredAdsStats } from "@/lib/platform-stats";

export async function GET(req: Request) {
  const admin = await requireSuperAdmin(req);
  if (admin.error) return admin.error;
  const [overview, alerts, recentActivity, sponsoredAds] = await Promise.all([
    getPlatformOverview(),
    getPlatformAlerts(),
    getPlatformRecentActivity(),
    getSponsoredAdsStats(),
  ]);
  return jsonOk({ ...overview, alerts, recentActivity, sponsoredAds });
}
