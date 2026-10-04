import { z } from "zod";
import { proposeWalletVisual } from "@/lib/ad-google-wallet-visual-workflow";
import { requireMutatingRequest, requireSuperAdmin } from "@/lib/api-guard";
import { validateStagedAdFile } from "@/lib/ad-visuals";
import { writeAudit } from "@/lib/audit";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { zodErrorMessage } from "@/lib/validation";

const schema = z.object({
  url: z.string().min(1).max(500),
  originalUrl: z.string().min(1).max(500),
  reframed: z.boolean(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

const PROPOSABLE = new Set(["PENDING_REVIEW", "NEEDS_CHANGES", "AWAITING_MERCHANT", "APPROVED", "SCHEDULED", "LIVE", "SUSPENDED"]);

/** Super-admin : envoie au commerçant un visuel Google Wallet (1032×812) pour validation. */
export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const auth = await requireSuperAdmin(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Accès refusé.", 403);

  const { id } = await context.params;
  const parsed = schema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const ad = await prisma.adRequest.findUnique({ where: { id }, select: { id: true, merchantId: true, campaignId: true, status: true } });
  if (!ad) return jsonError("Demande introuvable.", 404);
  if (!PROPOSABLE.has(ad.status)) return jsonError("Cette demande n'accepte plus de proposition de visuel Wallet.", 409);

  const display = await validateStagedAdFile(parsed.data.url, ad.merchantId, { requireExactFormat: false });
  if (!display.ok) return jsonError(display.error, 400);
  if (display.image.width !== 1032 || display.image.height !== 812) {
    return jsonError("Le visuel Google Wallet doit faire 1032 × 812 px.", 400);
  }
  const original = await validateStagedAdFile(parsed.data.originalUrl, ad.merchantId);
  if (!original.ok) return jsonError(original.error, 400);

  const version = await prisma.$transaction((tx) =>
    proposeWalletVisual(
      tx,
      ad,
      {
        url: parsed.data.url,
        originalUrl: parsed.data.originalUrl,
        width: parsed.data.width,
        height: parsed.data.height,
        reframed: parsed.data.reframed,
      },
      auth.user!.id,
    ),
  );

  await writeAudit({
    actorId: auth.user.id,
    merchantId: ad.merchantId,
    action: "AD_WALLET_VISUAL_PROPOSED",
    metadata: { adRequestId: id, versionId: version.id, number: version.number },
    ip: clientIp(req),
    userAgent: userAgent(req),
  });
  return jsonOk({ ok: true, version });
}
