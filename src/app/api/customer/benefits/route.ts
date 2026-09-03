import { requireUser } from "@/lib/api-guard";
import { formatBenefitEntry } from "@/lib/customer-history";
import { jsonError, jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const auth = await requireUser(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Connexion requise.", 401);

  const url = new URL(req.url);
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 20), 50);

  const memberships = await prisma.customerMembership.findMany({
    where: { userId: auth.user.id },
    select: { id: true },
  });

  if (memberships.length === 0) {
    return jsonOk({ items: [], total: 0 });
  }

  const rows = await prisma.loyaltyTransaction.findMany({
    where: {
      customerMembershipId: { in: memberships.map((m) => m.id) },
      type: "REDEEM_REWARD",
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      merchant: { select: { id: true, name: true, logoUrl: true, program: true } },
    },
  });

  const items = rows.map((row) =>
    formatBenefitEntry({
      id: row.id,
      createdAt: row.createdAt,
      pointsDelta: row.pointsDelta,
      reason: row.reason,
      merchant: row.merchant,
      rewardLabel: row.merchant.program?.rewardLabel ?? "Récompense",
      visitsRequired: row.merchant.program?.visitsRequired ?? Math.abs(row.pointsDelta),
    }),
  );

  const total = await prisma.loyaltyTransaction.count({
    where: {
      customerMembershipId: { in: memberships.map((m) => m.id) },
      type: "REDEEM_REWARD",
    },
  });

  return jsonOk({ items, total });
}
