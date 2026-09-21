import { requireSuperAdmin } from "@/lib/api-guard";
import { jsonOk } from "@/lib/http";
import { getPlatformAlerts, getPlatformOverview, getPlatformRecentActivity } from "@/lib/platform-stats";

export async function GET(req: Request) {
  const admin = await requireSuperAdmin(req);
  if (admin.error) return admin.error;
  const [overview, alerts, recentActivity] = await Promise.all([
    getPlatformOverview(),
    getPlatformAlerts(),
    getPlatformRecentActivity(),
  ]);
  return jsonOk({ ...overview, alerts, recentActivity });
}
