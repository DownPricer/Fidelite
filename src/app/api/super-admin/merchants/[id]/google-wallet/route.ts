import { requireMutatingRequest, requireSuperAdmin } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import {
  GoogleWalletApiError,
  GoogleWalletConfigError,
  isGoogleWalletConfigured,
  publicGoogleWalletError,
  syncGoogleWalletMembershipObject,
  testGoogleWalletMerchantConfig,
} from "@/lib/google-wallet";
import { clientIp, jsonError, jsonOkPrivate, readJson, userAgent } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  action: z.enum(["test", "sync", "preview"]),
});

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const admin = await requireSuperAdmin(req);
  if (admin.error || !admin.user) return admin.error ?? jsonError("Accès refusé.", 403);
  const { id } = await context.params;
  const parsed = schema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError("Action Google Wallet invalide.", 400);

  const merchant = await prisma.merchant.findUnique({
    where: { id },
    include: { program: true },
  });
  if (!merchant) return jsonError("Commerce introuvable.", 404);

  if (parsed.data.action === "preview") {
    return jsonOkPrivate({
      preview: {
        programName: `Fidélité ${merchant.name}`,
        profile: merchant.program?.mode ?? "GENERAL",
        backgroundColor: merchant.primaryColor,
        note: "Aperçu approximatif conforme aux contraintes Google Wallet, pas une reproduction pixel parfaite.",
      },
    });
  }

  if (!isGoogleWalletConfigured()) return jsonError("Google Wallet non configuré.", 503);

  try {
    await testGoogleWalletMerchantConfig(id);
    let syncedObjects = 0;
    if (parsed.data.action === "sync") {
      const memberships = await prisma.customerMembership.findMany({
        where: { merchantId: id, removedAt: null },
        select: { id: true },
      });
      for (const membership of memberships) {
        try {
          await syncGoogleWalletMembershipObject(membership.id);
          syncedObjects += 1;
        } catch {
          // Each object keeps its own ERROR state; keep syncing the rest.
        }
      }
    }

    await writeAudit({
      actorId: admin.user.id,
      merchantId: id,
      action: `GOOGLE_WALLET_${parsed.data.action.toUpperCase()}`,
      metadata: { syncedObjects },
      ip: clientIp(req),
      userAgent: userAgent(req),
    });

    return jsonOkPrivate({ ok: true, syncedObjects });
  } catch (error) {
    if (error instanceof GoogleWalletConfigError) {
      return jsonError(publicGoogleWalletError(error), 503);
    }
    if (error instanceof GoogleWalletApiError) {
      return jsonError("Google Wallet est temporairement indisponible.", 502);
    }
    return jsonError("Action Google Wallet impossible.", 502);
  }
}
