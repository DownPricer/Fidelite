import { requireSuperAdmin } from "@/lib/api-guard";
import { jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const admin = await requireSuperAdmin(req);
  if (admin.error) return admin.error;

  const contracts = await prisma.merchantContract.findMany({
    include: {
      merchant: { select: { id: true, name: true, slug: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return jsonOk({ contracts });
}
