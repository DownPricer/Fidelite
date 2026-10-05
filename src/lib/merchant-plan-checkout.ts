import type { MerchantPlanId } from "./merchant-plans";
import { MERCHANT_PLANS } from "./merchant-plans";
import { ensureStripeCustomer, getStripeClient, type BillingCustomerInput } from "./stripe";
import { getActiveStripeMode } from "./stripe-mode";

export type MerchantPlanCheckoutInput = {
  merchantId: string;
  signupRequestId: string;
  planId: MerchantPlanId;
  successUrl: string;
  cancelUrl: string;
  customer?: BillingCustomerInput;
};

function checkoutExpiry() {
  return Math.floor(Date.now() / 1000) + 30 * 60;
}

/**
 * Checkout Stripe pour l'abonnement commerçant : montants issus de MERCHANT_PLANS uniquement.
 */
export async function createMerchantPlanCheckoutSession(input: MerchantPlanCheckoutInput) {
  const plan = MERCHANT_PLANS[input.planId];
  const mode = getActiveStripeMode();
  if (!mode) throw new Error("STRIPE_NOT_CONFIGURED");

  const stripe = getStripeClient();
  const metadata = {
    kind: "MERCHANT_PLAN",
    merchantId: input.merchantId,
    signupRequestId: input.signupRequestId,
    planId: input.planId,
  };

  const customerId = input.customer
    ? await ensureStripeCustomer(input.merchantId, mode, input.customer)
    : null;

  const lineItems = [
    {
      price_data: {
        currency: "eur" as const,
        unit_amount: plan.monthlyPriceCents,
        recurring: { interval: "month" as const },
        product_data: { name: `Abonnement Fideto — ${plan.name}` },
      },
      quantity: 1,
    },
    ...(plan.setupPriceCents && plan.setupPriceCents > 0
      ? [
          {
            price_data: {
              currency: "eur" as const,
              unit_amount: plan.setupPriceCents,
              product_data: { name: `Pack matériel Fideto — ${plan.name}` },
            },
            quantity: 1,
          },
        ]
      : []),
  ];

  const subscriptionData: Record<string, unknown> = {
    metadata,
  };
  if (plan.firstMonthIncluded) {
    subscriptionData.trial_period_days = 30;
  }

  return stripe.checkout.sessions.create({
    mode: "subscription",
    ...(customerId ? { customer: customerId } : { customer_creation: "always" as const }),
    expires_at: checkoutExpiry(),
    line_items: lineItems,
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    metadata,
    subscription_data: subscriptionData,
  });
}
