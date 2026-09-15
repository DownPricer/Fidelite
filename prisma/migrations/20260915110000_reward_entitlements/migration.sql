CREATE TYPE "CustomerRewardEntitlementStatus" AS ENUM ('AVAILABLE', 'REDEEMED', 'EXPIRED', 'INELIGIBLE');

ALTER TABLE "LoyaltyReward" ADD COLUMN "archivedAt" TIMESTAMP(3);

CREATE TABLE "CustomerRewardEntitlement" (
    "id" TEXT NOT NULL,
    "customerMembershipId" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "originalRewardId" TEXT,
    "originalRewardName" TEXT NOT NULL,
    "originalDescription" TEXT,
    "originalMode" "LoyaltyMode" NOT NULL,
    "originalUnit" TEXT NOT NULL,
    "originalThreshold" INTEGER NOT NULL,
    "historicalBalance" INTEGER NOT NULL,
    "originalProgramId" TEXT NOT NULL,
    "originalProgramVersion" INTEGER NOT NULL,
    "acquiredAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "status" "CustomerRewardEntitlementStatus" NOT NULL DEFAULT 'AVAILABLE',
    "redeemedAt" TIMESTAMP(3),
    "ineligibleAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerRewardEntitlement_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CustomerRewardEntitlement_customerMembershipId_originalRewardId_originalProgramVersion_key"
ON "CustomerRewardEntitlement"("customerMembershipId", "originalRewardId", "originalProgramVersion");

CREATE INDEX "CustomerRewardEntitlement_merchantId_status_idx"
ON "CustomerRewardEntitlement"("merchantId", "status");

CREATE INDEX "CustomerRewardEntitlement_customerMembershipId_status_idx"
ON "CustomerRewardEntitlement"("customerMembershipId", "status");

CREATE INDEX "LoyaltyReward_programId_archivedAt_idx"
ON "LoyaltyReward"("programId", "archivedAt");

ALTER TABLE "CustomerRewardEntitlement"
ADD CONSTRAINT "CustomerRewardEntitlement_customerMembershipId_fkey"
FOREIGN KEY ("customerMembershipId") REFERENCES "CustomerMembership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CustomerRewardEntitlement"
ADD CONSTRAINT "CustomerRewardEntitlement_merchantId_fkey"
FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CustomerRewardEntitlement"
ADD CONSTRAINT "CustomerRewardEntitlement_originalRewardId_fkey"
FOREIGN KEY ("originalRewardId") REFERENCES "LoyaltyReward"("id") ON DELETE SET NULL ON UPDATE CASCADE;
