import { requireSuperAdmin } from "@/lib/api-guard";
import { jsonError, jsonOk } from "@/lib/http";
import { getPlatformBreakdowns, getPlatformTimeSeries, type PeriodKey } from "@/lib/platform-stats";

const PERIODS = new Set<PeriodKey>(["7d", "30d", "90d", "12m"]);

export async function GET(req: Request) {
  const admin = await requireSuperAdmin(req);
  if (admin.error) return admin.error;

  const url = new URL(req.url);
  const period = (url.searchParams.get("period") ?? "30d") as PeriodKey;
  if (!PERIODS.has(period)) return jsonError("Période invalide.", 400);

  const [series, breakdowns] = await Promise.all([
    getPlatformTimeSeries(period),
    getPlatformBreakdowns(),
  ]);

  return jsonOk({ series, breakdowns });
}
