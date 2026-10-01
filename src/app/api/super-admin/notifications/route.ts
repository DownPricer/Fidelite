import { z } from "zod";
import { requireMutatingRequest, requireSuperAdmin } from "@/lib/api-guard";
import { jsonError, jsonOk, jsonOkPrivate, readJson } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { zodErrorMessage } from "@/lib/validation";

/** Cloche super-admin : demandes de visuel à traiter (persistantes, partagées par l'équipe). */
export async function GET(req: Request) {
  const auth = await requireSuperAdmin(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Accès refusé.", 403);

  const where = { audience: "SUPER_ADMIN" as const };
  const [unread, items] = await Promise.all([
    prisma.staffNotification.count({ where: { ...where, readAt: null } }),
    prisma.staffNotification.findMany({ where, orderBy: { createdAt: "desc" }, take: 20 }),
  ]);
  return jsonOkPrivate({
    unread,
    items: items.map((n) => ({
      id: n.id,
      message: n.message,
      kind: n.kind,
      createdAt: n.createdAt,
      readAt: n.readAt,
      href: n.adRequestId ? `/super-admin/campagnes/fiche/${n.adRequestId}` : "/super-admin/campagnes",
    })),
  });
}

const markSchema = z.object({ ids: z.array(z.string().min(1)).max(100).optional(), all: z.boolean().optional() });

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const auth = await requireSuperAdmin(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Accès refusé.", 403);

  const parsed = markSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));
  const { ids, all } = parsed.data;
  if (!all && !ids?.length) return jsonError("Aucune notification indiquée.");

  await prisma.staffNotification.updateMany({
    where: { audience: "SUPER_ADMIN", readAt: null, ...(all ? {} : { id: { in: ids } }) },
    data: { readAt: new Date() },
  });
  return jsonOk({ ok: true });
}
