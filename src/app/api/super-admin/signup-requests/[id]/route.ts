import { z } from "zod";
import { requireMutatingRequest, requireSuperAdmin } from "@/lib/api-guard";
import { jsonError, jsonOk, jsonOkPrivate, readJson } from "@/lib/http";
import { SIGNUP_STATUS_LABELS } from "@/lib/merchant-signup-service";
import {
  acceptMerchantSignupRequest,
  rejectMerchantSignupRequest,
  resendMerchantSignupCode,
  revokeMerchantSignupCode,
} from "@/lib/merchant-signup-service";
import { MERCHANT_PLANS, isMerchantPlanId } from "@/lib/merchant-plans";
import { prisma } from "@/lib/prisma";
import { zodErrorMessage } from "@/lib/validation";
import { canExposeInvitationLinkInAdmin } from "@/lib/email";

const patchSchema = z.object({
  action: z.enum(["accept", "reject", "resend_code", "revoke_code", "note"]),
  internalNote: z.string().max(4000).optional(),
  rejectionReason: z.string().max(2000).optional(),
});

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireSuperAdmin(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Accès refusé.", 403);

  const { id } = await ctx.params;
  const row = await prisma.merchantSignupRequest.findUnique({ where: { id } });
  if (!row) return jsonError("Demande introuvable.", 404);

  return jsonOkPrivate({
    request: {
      ...row,
      statusLabel: SIGNUP_STATUS_LABELS[row.status],
      planLabel: isMerchantPlanId(row.planId) ? MERCHANT_PLANS[row.planId].name : row.planId,
      planPricing: isMerchantPlanId(row.planId) ? MERCHANT_PLANS[row.planId] : null,
      codeActive: Boolean(row.codeHash && !row.codeRevokedAt && !row.codeUsedAt && row.codeExpiresAt && row.codeExpiresAt > new Date()),
    },
  });
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const auth = await requireSuperAdmin(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Accès refusé.", 403);

  const { id } = await ctx.params;
  const parsed = patchSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  try {
    if (parsed.data.action === "note") {
      await prisma.merchantSignupRequest.update({
        where: { id },
        data: { internalNote: parsed.data.internalNote?.trim() || null },
      });
      return jsonOk({ ok: true });
    }

    if (parsed.data.action === "accept") {
      const { code, emailResult } = await acceptMerchantSignupRequest(id, parsed.data.internalNote);
      return jsonOk({
        ok: true,
        emailSent: emailResult.ok,
        emailError: emailResult.ok ? null : emailResult.error,
        devCode: canExposeInvitationLinkInAdmin() ? code : undefined,
      });
    }

    if (parsed.data.action === "reject") {
      await rejectMerchantSignupRequest(id, parsed.data.rejectionReason, parsed.data.internalNote);
      return jsonOk({ ok: true });
    }

    if (parsed.data.action === "resend_code") {
      const { code, emailResult } = await resendMerchantSignupCode(id);
      return jsonOk({
        ok: true,
        emailSent: emailResult.ok,
        emailError: emailResult.ok ? null : emailResult.error,
        devCode: canExposeInvitationLinkInAdmin() ? code : undefined,
      });
    }

    if (parsed.data.action === "revoke_code") {
      await revokeMerchantSignupCode(id);
      return jsonOk({ ok: true });
    }

    return jsonError("Action inconnue.", 400);
  } catch {
    return jsonError("Action impossible dans l'état actuel de la demande.", 409);
  }
}
