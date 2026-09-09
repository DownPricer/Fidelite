import { requireSuperAdmin } from "@/lib/api-guard";
import { jsonOk } from "@/lib/http";
import { getPlatformOverview } from "@/lib/platform-stats";

export async function GET(req: Request) {
  const admin = await requireSuperAdmin(req);
  if (admin.error) return admin.error;
  const overview = await getPlatformOverview();
  return jsonOk(overview);
}
