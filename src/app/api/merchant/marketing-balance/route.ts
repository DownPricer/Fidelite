import { z } from "zod";
import { requireMerchantAdmin, requireMutatingRequest } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { resolveAppOriginFromRequestHost } from "@/lib/hosts";
import {
  MAX_TOPUP_CENTS,
  MIN_TOPUP_CENTS,
  TOPUP_PRESETS_CENTS,
  getMarketingBalanceCents,
  isValidTopupAmountCents,
} from "@/lib/marketing-balance";
import { prisma } from "@/lib/prisma";
import { LIMITS, rateLimit } from "@/lib/rate-limit";
import { StripeNotConfiguredError, createMarketingTopupCheckoutSession } from "@/lib/stripe";
import { getActiveStripeMode, isPaymentAllowedForMerchant, isStripeConfigured } from "@/lib/stripe-mode";

/** Solde marketing prépayé + historique des recharges, débits et restitutions du commerce. */
export async function GET(req: Request) {
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const merchantId = staff.membership.merchantId;
  // Seuls le solde et l'historique du mode ACTIF sont visibles : le solde test disparaît en mode réel
  // (sans être transféré) et inversement.
  const mode = getActiveStripeMode();
  if (!mode) {
    return jsonOk({ stripeMode: null, testMode: false, paymentsAvailable: false, balanceCents: 0, history: [] });
  }
  const [balanceCents, entries] = await Promise.all([
    getMarketingBalanceCents(merchantId, mode),
    prisma.marketingLedgerEntry.findMany({
      where: { merchantId, mode },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { campaign: { select: { title: true, status: true } } },
    }),
  ]);

  return jsonOk({
    stripeMode: mode,
    testMode: mode === "TEST",
    paymentsAvailable: isStripeConfigured() && isPaymentAllowedForMerchant(merchantId),
    balanceCents,
    presetsCents: TOPUP_PRESETS_CENTS,
    minTopupCents: MIN_TOPUP_CENTS,
    maxTopupCents: MAX_TOPUP_CENTS,
    history: entries.map((e) => ({
      id: e.id,
      type: e.type,
      status: e.status,
      amountCents: e.amountCents,
      balanceAfterCents: e.balanceAfterCents,
      description: e.description,
      createdAt: e.createdAt,
      campaignTitle: e.campaign?.title ?? null,
      campaignStatus: e.campaign?.status ?? null,
    })),
  });
}

const topupSchema = z.object({ amountCents: z.number().int() });

/**
 * Démarre une recharge via Stripe Checkout. Le montant est validé côté serveur (entier en
 * centimes, 5 € minimum). Rien n'est crédité ici : uniquement par le webhook signé
 * `checkout.session.completed`.
 */
export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const limited = rateLimit(`marketing-topup:${staff.user.id}`, LIMITS.scan.limit, LIMITS.scan.windowMs);
  if (!limited.ok) {
    return jsonError("Trop de tentatives. Patientez un instant.", 429, {
      code: "RATE_LIMIT",
      retryAfterMs: limited.retryAfterMs,
    });
  }

  const parsed = topupSchema.safeParse(await readJson(req));
  if (!parsed.success || !isValidTopupAmountCents(parsed.data.amountCents)) {
    return jsonError(
      `Montant invalide : la recharge doit être d'au moins ${MIN_TOPUP_CENTS / 100} € (et ${MAX_TOPUP_CENTS / 100} € au plus).`,
      400,
      { code: "INVALID_AMOUNT" },
    );
  }
  const amountCents = parsed.data.amountCents;
  const merchantId = staff.membership.merchantId;

  const mode = getActiveStripeMode();
  if (!mode || !isStripeConfigured()) {
    return jsonError("Les recharges ne sont pas disponibles : Stripe n'est pas configuré sur cet environnement.", 503, {
      code: "STRIPE_NOT_CONFIGURED",
    });
  }
  if (!isPaymentAllowedForMerchant(merchantId)) {
    return jsonError("Les paiements de test sont réservés au commerce de test configuré.", 403, {
      code: "TEST_MODE_RESTRICTED",
    });
  }

  const appOrigin = resolveAppOriginFromRequestHost(req.headers.get("host") ?? "");

  const entry = await prisma.marketingLedgerEntry.create({
    data: {
      merchantId,
      mode,
      type: "TOPUP",
      status: "PENDING",
      amountCents,
      description: "Recharge du solde marketing",
    },
  });

  try {
    const session = await createMarketingTopupCheckoutSession({
      merchantId,
      ledgerEntryId: entry.id,
      amountCents,
      customer: staff.membership.merchant?.name ? { name: staff.membership.merchant.name, email: staff.user.email ?? null } : undefined,
      successUrl: `${appOrigin}/app/campagnes/solde?topup=success`,
      cancelUrl: `${appOrigin}/app/campagnes/solde?topup=cancelled`,
    });
    await prisma.marketingLedgerEntry.update({
      where: { id: entry.id },
      data: { stripeCheckoutSessionId: session.id },
    });

    await writeAudit({
      actorId: staff.user.id,
      merchantId,
      action: "MARKETING_TOPUP_CHECKOUT_CREATED",
      metadata: { ledgerEntryId: entry.id, mode, amountCents, stripeCheckoutSessionId: session.id },
      ip: clientIp(req),
      userAgent: userAgent(req),
    });

    return jsonOk({ ok: true, checkoutUrl: session.url, amountCents });
  } catch (error) {
    await prisma.marketingLedgerEntry.update({ where: { id: entry.id }, data: { status: "CANCELLED" } });
    if (error instanceof StripeNotConfiguredError) {
      return jsonError("Les recharges ne sont pas disponibles : Stripe n'est pas configuré sur cet environnement.", 503, {
        code: "STRIPE_NOT_CONFIGURED",
      });
    }
    console.error("[marketing-topup] échec de création de la session Stripe", error instanceof Error ? error.message : error);
    return jsonError("Impossible de démarrer le paiement.", 502);
  }
}
