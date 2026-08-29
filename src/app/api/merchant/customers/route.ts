import { requireMerchantAdmin } from "@/lib/api-guard";
import { jsonError, jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const customers = await prisma.customerMembership.findMany({
    where: { merchantId: staff.membership.merchantId },
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      transactions: { orderBy: { createdAt: "desc" }, take: 3 },
    },
  });

  return jsonOk({
    customers: customers.map((item) => ({
      id: item.id,
      firstName: item.user.firstName,
      email: item.user.email,
      points: item.points,
      createdAt: item.createdAt,
      lastActivity: item.transactions[0]?.createdAt ?? item.createdAt,
    })),
  });
}
