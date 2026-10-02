-- Facturation commerçant : client Stripe par commerce et par mode, lien d'abonnement Stripe et arrêt programmé.
ALTER TABLE "MerchantSubscription" ADD COLUMN "stripeSubscriptionId" TEXT;
ALTER TABLE "MerchantSubscription" ADD COLUMN "stripeMode" "StripeMode";
ALTER TABLE "MerchantSubscription" ADD COLUMN "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "MerchantSubscription" ADD COLUMN "cancelEffectiveAt" TIMESTAMP(3);
ALTER TABLE "MerchantSubscription" ADD COLUMN "cancelRequestedAt" TIMESTAMP(3);
CREATE UNIQUE INDEX "MerchantSubscription_stripeSubscriptionId_key" ON "MerchantSubscription"("stripeSubscriptionId");

CREATE TABLE "MerchantStripeCustomer" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "mode" "StripeMode" NOT NULL,
    "stripeCustomerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MerchantStripeCustomer_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "MerchantStripeCustomer_stripeCustomerId_key" ON "MerchantStripeCustomer"("stripeCustomerId");
CREATE UNIQUE INDEX "MerchantStripeCustomer_merchantId_mode_key" ON "MerchantStripeCustomer"("merchantId", "mode");
ALTER TABLE "MerchantStripeCustomer" ADD CONSTRAINT "MerchantStripeCustomer_merchantId_fkey"
  FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
