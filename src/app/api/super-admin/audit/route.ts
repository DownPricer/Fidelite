import { requireSuperAdmin } from "@/lib/api-guard";
import { jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const admin = await requireSuperAdmin(req);
  if (admin.error) return admin.error;

  const url = new URL(req.url);
  const action = url.searchParams.get("action")?.trim();
  const merchantId = url.searchParams.get("merchantId")?.trim();
  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
  const pageSize = Math.min(100, Math.max(20, Number(url.searchParams.get("pageSize") ?? 50)));

  const where = {
    ...(action ? { action: { contains: action, mode: "insensitive" as const } } : {}),
    ...(merchantId ? { merchantId } : {}),
  };

  const [total, logs] = await Promise.all([
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        actor: { select: { id: true, firstName: true, email: true } },
        merchant: { select: { id: true, name: true, slug: true } },
      },
    }),
  ]);

  return jsonOk({
    logs: logs.map((log) => ({
      id: log.id,
      action: log.action,
      actor: log.actor,
      merchant: log.merchant,
      metadata: log.metadata,
      ip: log.ip,
      createdAt: log.createdAt.toISOString(),
    })),
    pagination: { page, pageSize, total, pages: Math.ceil(total / pageSize) },
  });
}
