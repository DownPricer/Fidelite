-- Audit et idempotence des validations caisse.
ALTER TABLE "LoyaltyTransaction" ADD COLUMN IF NOT EXISTS "purchaseAmountCents" INTEGER;
ALTER TABLE "LoyaltyTransaction" ADD COLUMN IF NOT EXISTS "balanceBefore" INTEGER;
ALTER TABLE "LoyaltyTransaction" ADD COLUMN IF NOT EXISTS "balanceAfter" INTEGER;
ALTER TABLE "LoyaltyTransaction" ADD COLUMN IF NOT EXISTS "ruleApplied" TEXT;
ALTER TABLE "LoyaltyTransaction" ADD COLUMN IF NOT EXISTS "idempotencyKey" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "LoyaltyTransaction_idempotencyKey_key"
  ON "LoyaltyTransaction"("idempotencyKey");

ALTER TABLE "CaisseGrant" ADD COLUMN IF NOT EXISTS "earnCommittedAt" TIMESTAMP(3);
ALTER TABLE "CaisseGrant" ADD COLUMN IF NOT EXISTS "earnTransactionId" TEXT;
