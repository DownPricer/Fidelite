import { requireMerchantAdmin } from "@/lib/api-guard";
import { getPublishedCardTemplate } from "@/lib/card-template-resolver";
import { jsonError, jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";

/** Gabarit publié du commerce connecté — aperçu configurateur commerçant. */
export async function GET(req: Request) {
  const admin = await requireMerchantAdmin(req);
  if (admin.error || !admin.membership) return admin.error ?? jsonError("Accès refusé.", 403);

  const merchant = await prisma.merchant.findUnique({
    where: { id: admin.membership.merchantId },
    include: { program: true },
  });
  if (!merchant?.program) return jsonError("Commerce introuvable.", 404);

  const template = await getPublishedCardTemplate(merchant.id, merchant.program.mode);
  return jsonOk({ template });
}
