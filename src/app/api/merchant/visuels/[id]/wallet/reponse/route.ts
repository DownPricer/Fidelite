import { z } from "zod";
import { merchantRespondWalletVisual } from "@/lib/ad-google-wallet-visual-workflow";
import { requireMerchantAdmin, requireMutatingRequest } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { zodErrorMessage } from "@/lib/validation";

const schema = z.object({
  action: z.enum(["accept", "request_changes"]),
  comment: z.string().trim().max(500).nullable().optional(),
});

/** Réponse du commerçant à la proposition de visuel Google Wallet. */
export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const { id } = await context.params;
  const merchantId = staff.membership.merchantId;
  const parsed = schema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));
  if (parsed.data.action === "request_changes" && (parsed.data.comment ?? "").trim().length < 3) {
    return jsonError("Indiquez ce que vous souhaitez modifier.", 400);
  }

  const ad = await prisma.adRequest.findFirst({ where: { id, merchantId }, select: { id: true, merchantId: true, campaignId: true } });
  if (!ad) return jsonError("Demande introuvable.", 404);

  const version = await prisma.$transaction((tx) => merchantRespondWalletVisual(tx, ad, parsed.data, staff.user!.id));
  if (!version) return jsonError("Aucune proposition de visuel Google Wallet en attente.", 409, { code: "NO_WALLET_PROPOSAL" });

  await writeAudit({
    actorId: staff.user.id,
    merchantId,
    action: parsed.data.action === "accept" ? "AD_WALLET_VISUAL_ACCEPTED" : "AD_WALLET_VISUAL_CHANGES_REQUESTED",
    metadata: { adRequestId: id, versionId: version.id, comment: parsed.data.comment ?? null },
    ip: clientIp(req),
    userAgent: userAgent(req),
  });
  return jsonOk({ ok: true });
}
