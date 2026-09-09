import { requireSuperAdmin } from "@/lib/api-guard";
import { normalizeToMrr } from "@/lib/billing-stats";
import { jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const admin = await requireSuperAdmin(req);
  if (admin.error) return admin.error;

  const subscriptions = await prisma.merchantSubscription.findMany({
    include: {
      merchant: { select: { id: true, name: true, slug: true, status: true, logoUrl: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return jsonOk({
    subscriptions: subscriptions.map((sub) => ({
      ...sub,
      mrr: normalizeToMrr(sub.amount, sub.frequency),
      isManual: true,
    })),
  });
}
