import { requireMerchantAdmin } from "@/lib/api-guard";
import { jsonError, jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import type { LoyaltyTxType, Prisma } from "@prisma/client";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const { id } = await context.params;
  const membership = await prisma.merchantMembership.findFirst({
    where: { id, merchantId: staff.membership.merchantId, role: "EMPLOYEE" },
  });
  if (!membership) return jsonError("Employé introuvable.", 404);

  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim().toLowerCase() ?? "";
  const type = url.searchParams.get("type") ?? "all";
  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
  const limit = Math.min(50, Math.max(10, Number(url.searchParams.get("limit") ?? 30)));
  const skip = (page - 1) * limit;

  const typeFilter: LoyaltyTxType[] | undefined =
    type === "earns"
      ? ["EARN_VISIT"]
      : type === "rewards"
        ? ["REDEEM_REWARD"]
        : type === "corrections"
          ? ["ADJUSTMENT"]
          : type === "cancels"
            ? ["CANCEL"]
            : undefined;

  const where: Prisma.LoyaltyTransactionWhereInput = {
    merchantId: staff.membership.merchantId,
    performedByUserId: membership.userId,
    ...(typeFilter ? { type: { in: typeFilter } } : {}),
    ...(q
      ? {
          membership: {
            user: {
              OR: [
                { firstName: { contains: q, mode: "insensitive" } },
                { lastName: { contains: q, mode: "insensitive" } },
              ],
            },
          },
        }
      : {}),
  };

  const [total, rows] = await Promise.all([
    prisma.loyaltyTransaction.count({ where }),
    prisma.loyaltyTransaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        membership: { include: { user: true } },
        reward: true,
      },
    }),
  ]);

  return jsonOk({
    total,
    page,
    hasMore: skip + rows.length < total,
    transactions: rows.map((tx) => ({
      id: tx.id,
      type: tx.type,
      status: tx.status,
      pointsDelta: tx.pointsDelta,
      purchaseAmount: tx.purchaseAmount,
      reason: tx.reason,
      rewardName: tx.reward?.name,
      customerFirstName: tx.membership.user.firstName,
      customerLastName: tx.membership.user.lastName,
      createdAt: tx.createdAt,
      metadata: tx.metadata,
    })),
  });
}
