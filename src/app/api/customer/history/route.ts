import { requireUser } from "@/lib/api-guard";
import {
  formatFifeLifeEntry,
  formatLoyaltyEntry,
  type HistoryCategory,
} from "@/lib/customer-history";
import { jsonError, jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { historyFilterSchema } from "@/lib/validation";

const FILTER_MAP: Record<string, HistoryCategory | null> = {
  all: null,
  earned: "earned",
  used: "used",
  expired: "expired",
  correction: "correction",
};

export async function GET(req: Request) {
  const auth = await requireUser(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Connexion requise.", 401);

  const url = new URL(req.url);
  const filterParam = url.searchParams.get("filter") ?? "all";
  const cursor = url.searchParams.get("cursor");
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 20), 50);

  const filterParsed = historyFilterSchema.safeParse(filterParam);
  if (!filterParsed.success) return jsonError("Filtre invalide.");

  const categoryFilter = FILTER_MAP[filterParsed.data];

  const memberships = await prisma.customerMembership.findMany({
    where: { userId: auth.user.id },
    select: { id: true },
  });
  const membershipIds = memberships.map((m) => m.id);

  const [loyaltyRows, fifeRows] = await Promise.all([
    membershipIds.length
      ? prisma.loyaltyTransaction.findMany({
          where: { customerMembershipId: { in: membershipIds } },
          orderBy: { createdAt: "desc" },
          take: 200,
          include: {
            merchant: { select: { id: true, name: true, logoUrl: true } },
          },
        })
      : [],
    prisma.fifeLifePointsLedger.findMany({
      where: { userId: auth.user.id },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        loyaltyTransaction: {
          include: { merchant: { select: { id: true, name: true, logoUrl: true } } },
        },
      },
    }),
  ]);

  const loyaltyEntries = loyaltyRows.map((row) =>
    formatLoyaltyEntry({
      id: row.id,
      type: row.type,
      pointsDelta: row.pointsDelta,
      reason: row.reason,
      createdAt: row.createdAt,
      merchant: row.merchant,
    }),
  );

  const fifeEntries = fifeRows.map((row) =>
    formatFifeLifeEntry({
      id: row.id,
      delta: row.delta,
      reason: row.reason,
      createdAt: row.createdAt,
      merchantName: row.loyaltyTransaction?.merchant.name,
      merchantLogoUrl: row.loyaltyTransaction?.merchant.logoUrl,
    }),
  );

  let merged = [...loyaltyEntries, ...fifeEntries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const seen = new Set<string>();
  merged = merged.filter((entry) => {
    if (seen.has(entry.id)) return false;
    seen.add(entry.id);
    return true;
  });

  if (categoryFilter) {
    merged = merged.filter((entry) => entry.category === categoryFilter);
  }

  let startIndex = 0;
  if (cursor) {
    const idx = merged.findIndex((e) => e.id === cursor);
    startIndex = idx >= 0 ? idx + 1 : 0;
  }

  const page = merged.slice(startIndex, startIndex + limit);
  const nextCursor = startIndex + limit < merged.length ? page[page.length - 1]?.id ?? null : null;

  return jsonOk({
    items: page,
    nextCursor,
    total: merged.length,
  });
}
