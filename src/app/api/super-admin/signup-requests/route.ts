import { requireSuperAdmin } from "@/lib/api-guard";
import { jsonError, jsonOkPrivate } from "@/lib/http";
import { SIGNUP_STATUS_LABELS } from "@/lib/merchant-signup-service";
import { MERCHANT_PLANS, isMerchantPlanId } from "@/lib/merchant-plans";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const auth = await requireSuperAdmin(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Accès refusé.", 403);

  const rows = await prisma.merchantSignupRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true,
      status: true,
      planId: true,
      businessName: true,
      email: true,
      firstName: true,
      lastName: true,
      createdAt: true,
      codeSentAt: true,
      codeUsedAt: true,
      codeExpiresAt: true,
      merchantId: true,
    },
  });

  return jsonOkPrivate({
    items: rows.map((row) => ({
      ...row,
      statusLabel: SIGNUP_STATUS_LABELS[row.status],
      planLabel: isMerchantPlanId(row.planId) ? MERCHANT_PLANS[row.planId].name : row.planId,
    })),
  });
}
