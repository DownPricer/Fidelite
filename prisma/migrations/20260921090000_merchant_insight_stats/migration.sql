-- Fidelo Insight: server-side entitlement flag on the existing (manually billed)
-- subscription record, plus indexes needed for the merchant statistics aggregates.
ALTER TABLE "MerchantSubscription" ADD COLUMN "insightEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "MerchantSubscription" ADD COLUMN "insightEnabledAt" TIMESTAMP(3);
ALTER TABLE "MerchantSubscription" ADD COLUMN "insightRequestedAt" TIMESTAMP(3);

CREATE INDEX "LoyaltyTransaction_merchantId_type_createdAt_idx" ON "LoyaltyTransaction"("merchantId", "type", "createdAt");

CREATE INDEX "CustomerMembership_merchantId_createdAt_idx" ON "CustomerMembership"("merchantId", "createdAt");

CREATE INDEX "AuditLog_merchantId_action_createdAt_idx" ON "AuditLog"("merchantId", "action", "createdAt");
