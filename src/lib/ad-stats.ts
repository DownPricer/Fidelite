import { parisDateKey } from "./insight-period";
import { prisma } from "./prisma";

export type AdDayStats = { date: string; impressions: number; clicks: number; ctr: number | null };
export type AdPlacementStats = { placement: string; impressions: number; clicks: number; ctr: number | null };
export type AdStats = {
  byDay: AdDayStats[];
  byPlacement: AdPlacementStats[];
  totalImpressions: number;
  totalClicks: number;
  ctr: number | null;
};

function ctrOf(impressions: number, clicks: number): number | null {
  return impressions > 0 ? (clicks / impressions) * 100 : null;
}

/** Impressions/clics réels par jour (Europe/Paris) pour une mise en avant — jamais les aperçus admin/commerçant. */
export async function getAdStats(adRequestId: string): Promise<AdStats> {
  const events = await prisma.adEvent.findMany({
    where: { adRequestId },
    select: { type: true, createdAt: true, placement: true },
  });

  const byDayMap = new Map<string, { impressions: number; clicks: number }>();
  const byPlacementMap = new Map<string, { impressions: number; clicks: number }>();
  let totalImpressions = 0;
  let totalClicks = 0;

  for (const event of events) {
    const key = parisDateKey(event.createdAt);
    const row = byDayMap.get(key) ?? { impressions: 0, clicks: 0 };
    if (event.type === "IMPRESSION") {
      row.impressions += 1;
      totalImpressions += 1;
    } else {
      row.clicks += 1;
      totalClicks += 1;
    }
    byDayMap.set(key, row);

    // Placement d'origine (accueil Wallet, recherche, notifications) ; « UNKNOWN » = événements antérieurs.
    const placementKey = event.placement ?? "UNKNOWN";
    const placementRow = byPlacementMap.get(placementKey) ?? { impressions: 0, clicks: 0 };
    if (event.type === "IMPRESSION") placementRow.impressions += 1;
    else placementRow.clicks += 1;
    byPlacementMap.set(placementKey, placementRow);
  }

  const byDay = [...byDayMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, row]) => ({ date, impressions: row.impressions, clicks: row.clicks, ctr: ctrOf(row.impressions, row.clicks) }));

  const byPlacement = [...byPlacementMap.entries()].map(([placement, row]) => ({
    placement,
    impressions: row.impressions,
    clicks: row.clicks,
    ctr: ctrOf(row.impressions, row.clicks),
  }));

  return { byDay, byPlacement, totalImpressions, totalClicks, ctr: ctrOf(totalImpressions, totalClicks) };
}
