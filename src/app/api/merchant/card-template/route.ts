import { requireMerchantAdmin } from "@/lib/api-guard";
import {
  normalizeResolvedPublishedTemplate,
  resolvePublishedMerchantCardTemplate,
} from "@/lib/merchant-card-template-service";
import { logMerchantCardSwitch } from "@/lib/merchant-card-switch-log";
import { jsonError, jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import type { LoyaltyMode } from "@prisma/client";

const LOYALTY_MODES = new Set<LoyaltyMode>([
  "VISITS",
  "POINTS_BY_AMOUNT",
  "FIXED_POINTS",
  "AMOUNT_TIERS",
]);

/** Gabarit publié du commerce connecté — aperçu configurateur commerçant. */
export async function GET(req: Request) {
  const admin = await requireMerchantAdmin(req);
  if (admin.error || !admin.membership) return admin.error ?? jsonError("Accès refusé.", 403);

  const merchant = await prisma.merchant.findUnique({
    where: { id: admin.membership.merchantId },
    include: { program: true },
  });
  if (!merchant?.program) return jsonError("Commerce introuvable.", 404);

  const url = new URL(req.url);
  const modeParam = url.searchParams.get("mode")?.trim();
  const draftRaw = merchant.program.draftConfig as { mode?: LoyaltyMode } | null;
  const activeMode = merchant.program.mode;

  let previewMode: LoyaltyMode = activeMode;
  if (modeParam && LOYALTY_MODES.has(modeParam as LoyaltyMode)) {
    previewMode = modeParam as LoyaltyMode;
  } else if (draftRaw?.mode) {
    previewMode = draftRaw.mode;
  }

  logMerchantCardSwitch("mode sélectionné", {
    merchantId: merchant.id,
    mode: previewMode,
  });
  logMerchantCardSwitch("mode actif en base", {
    merchantId: merchant.id,
    mode: activeMode,
  });

  const resolved = await resolvePublishedMerchantCardTemplate(merchant.id, previewMode);
  const template = normalizeResolvedPublishedTemplate(resolved);

  return jsonOk({
    template,
    previewMode,
    activeMode,
    templateId: resolved?.id ?? null,
    templateVersion: resolved?.version ?? null,
    usedFallback: resolved?.usedFallback ?? false,
    cardSlot: resolved?.cardSlot ?? null,
  });
}
