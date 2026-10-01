import { z } from "zod";
import { requireMutatingRequest, requireSuperAdmin } from "@/lib/api-guard";
import { validateStagedAdFile } from "@/lib/ad-visuals";
import { proposeVersion } from "@/lib/ad-visual-workflow";
import { writeAudit } from "@/lib/audit";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { zodErrorMessage } from "@/lib/validation";

const schema = z.object({
  url: z.string().min(1).max(500),
  originalUrl: z.string().min(1).max(500).optional(),
});

const PROPOSABLE = new Set(["PENDING_REVIEW", "NEEDS_CHANGES", "AWAITING_MERCHANT", "APPROVED", "SCHEDULED", "LIVE", "SUSPENDED"]);

/**
 * Super-admin : envoie au commerçant un bandeau préparé hors Fideto (Photoshop) comme proposition.
 * Crée toujours une NOUVELLE version : l'image actuellement diffusée (finalImageUrl) n'est jamais
 * remplacée ici — seule l'acceptation du commerçant la change.
 */
export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const auth = await requireSuperAdmin(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Accès refusé.", 403);

  const { id } = await context.params;
  const parsed = schema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const ad = await prisma.adRequest.findUnique({ where: { id } });
  if (!ad) return jsonError("Demande introuvable.", 404);
  if (!PROPOSABLE.has(ad.status)) return jsonError("Cette demande n'accepte plus de proposition de visuel.", 409);

  // Anti-doublon : le même fichier déjà proposé et en attente ne repart pas une seconde fois (double clic).
  const duplicate = await prisma.adVisualVersion.findFirst({
    where: { adRequestId: id, status: "PROPOSED", url: parsed.data.url },
    select: { id: true },
  });
  if (duplicate) return jsonError("Cette version a déjà été envoyée au commerçant.", 409, { code: "ALREADY_PROPOSED" });

  const display = await validateStagedAdFile(parsed.data.url, ad.merchantId, { requireExactFormat: true });
  if (!display.ok) return jsonError(display.error, 400);
  const originalUrl = parsed.data.originalUrl ?? parsed.data.url;
  if (originalUrl !== parsed.data.url) {
    const original = await validateStagedAdFile(originalUrl, ad.merchantId);
    if (!original.ok) return jsonError(original.error, 400);
  }

  const version = await prisma.$transaction((tx) =>
    proposeVersion(
      tx,
      ad,
      { url: parsed.data.url, originalUrl, width: display.image.width, height: display.image.height, reframed: originalUrl !== parsed.data.url },
      auth.user!.id,
    ),
  );
  await writeAudit({
    actorId: auth.user.id,
    merchantId: ad.merchantId,
    action: "AD_VISUAL_PROPOSED",
    metadata: { adRequestId: id, versionId: version.id, number: version.number },
    ip: clientIp(req),
    userAgent: userAgent(req),
  });
  return jsonOk({ ok: true, version });
}
