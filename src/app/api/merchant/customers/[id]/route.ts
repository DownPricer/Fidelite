import { requireMerchantAdmin } from "@/lib/api-guard";
import { jsonError, jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const { id } = await context.params;
  const membership = await prisma.customerMembership.findFirst({
    where: { id, merchantId: staff.membership.merchantId },
    include: {
      user: true,
      merchant: { include: { program: { include: { rewards: true } } } },
      transactions: {
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { performedBy: true, reward: true },
      },
    },
  });
  if (!membership) return jsonError("Client introuvable.", 404);

  return jsonOk({
    customer: {
      id: membership.id,
      firstName: membership.user.firstName,
      lastName: membership.user.lastName,
      email: membership.user.email,
      phone: membership.user.phone,
      points: membership.points,
      createdAt: membership.createdAt,
      program: membership.merchant.program,
    },
    transactions: membership.transactions.map((tx) => ({
      id: tx.id,
      type: tx.type,
      status: tx.status,
      pointsDelta: tx.pointsDelta,
      purchaseAmount: tx.purchaseAmount,
      reason: tx.reason,
      rewardName: tx.reward?.name,
      actor: tx.performedBy.firstName,
      createdAt: tx.createdAt,
    })),
  });
}
