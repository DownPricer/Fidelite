import { requireMerchantAdmin } from "@/lib/api-guard";
import { jsonError, jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

const SORT_MAP: Record<string, Prisma.CustomerMembershipOrderByWithRelationInput> = {
  recent: { updatedAt: "desc" },
  active: { points: "desc" },
  points: { points: "desc" },
  alpha: { user: { firstName: "asc" } },
};

export async function GET(req: Request) {
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim().toLowerCase() ?? "";
  const sort = url.searchParams.get("sort") ?? "recent";
  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
  const limit = Math.min(50, Math.max(10, Number(url.searchParams.get("limit") ?? 30)));
  const skip = (page - 1) * limit;

  const where: Prisma.CustomerMembershipWhereInput = {
    merchantId: staff.membership.merchantId,
    ...(q
      ? {
          OR: [
            { user: { firstName: { contains: q, mode: "insensitive" } } },
            { user: { lastName: { contains: q, mode: "insensitive" } } },
            { user: { email: { contains: q, mode: "insensitive" } } },
            { user: { phone: { contains: q, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  const [total, customers] = await Promise.all([
    prisma.customerMembership.count({ where }),
    prisma.customerMembership.findMany({
      where,
      orderBy: SORT_MAP[sort] ?? SORT_MAP.recent,
      skip,
      take: limit,
      include: {
        user: true,
        transactions: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    }),
  ]);

  return jsonOk({
    total,
    page,
    hasMore: skip + customers.length < total,
    customers: customers.map((item) => ({
      id: item.id,
      firstName: item.user.firstName,
      lastName: item.user.lastName,
      email: item.user.email,
      phone: item.user.phone,
      points: item.points,
      createdAt: item.createdAt,
      lastActivity: item.transactions[0]?.createdAt ?? item.updatedAt,
    })),
  });
}
