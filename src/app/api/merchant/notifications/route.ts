import { z } from "zod";
import { requireMerchantAdmin, requireMutatingRequest } from "@/lib/api-guard";
import { jsonError, jsonOk, jsonOkPrivate, readJson } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { zodErrorMessage } from "@/lib/validation";

/** Cloche commerçant : nombre de non lues + derniers messages (persistants, liés à la campagne). */
export async function GET(req: Request) {
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const where = { audience: "MERCHANT" as const, merchantId: staff.membership.merchantId };
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
      href: n.campaignId ? `/app/campagnes/${n.campaignId}` : "/app/campagnes",
    })),
  });
}

const markSchema = z.object({ ids: z.array(z.string().min(1)).max(100).optional(), all: z.boolean().optional() });

/** Marque comme lues (ids précis, ou toutes) — toujours limité aux notifications du commerce de l'utilisateur. */
export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const parsed = markSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));
  const { ids, all } = parsed.data;
  if (!all && !ids?.length) return jsonError("Aucune notification indiquée.");

  await prisma.staffNotification.updateMany({
    where: {
      audience: "MERCHANT",
      merchantId: staff.membership.merchantId,
      readAt: null,
      ...(all ? {} : { id: { in: ids } }),
    },
    data: { readAt: new Date() },
  });
  return jsonOk({ ok: true });
}
