-- Merchant admin v2: staff permissions, loyalty program configurator, rewards

CREATE TYPE "LoyaltyMode" AS ENUM ('VISITS', 'POINTS_BY_AMOUNT', 'FIXED_POINTS', 'AMOUNT_TIERS');
CREATE TYPE "ProgramStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED', 'SCHEDULED');
CREATE TYPE "StaffPreset" AS ENUM ('MANAGER', 'CASHIER', 'CUSTOM');
CREATE TYPE "InvitationStatus" AS ENUM ('NONE', 'PENDING', 'ACCEPTED', 'CANCELLED');
CREATE TYPE "RewardType" AS ENUM ('FREE_PRODUCT', 'FREE_SERVICE', 'PERCENT_DISCOUNT', 'FIXED_DISCOUNT', 'GIFT', 'UPGRADE', 'CUSTOM');
CREATE TYPE "LoyaltyTxStatus" AS ENUM ('COMPLETED', 'PENDING', 'CANCELLED', 'CORRECTED');

ALTER TYPE "LoyaltyTxType" ADD VALUE IF NOT EXISTS 'CANCEL';

ALTER TABLE "MerchantMembership" ADD COLUMN "staffPreset" "StaffPreset" NOT NULL DEFAULT 'CASHIER';
ALTER TABLE "MerchantMembership" ADD COLUMN "permissions" JSONB;
ALTER TABLE "MerchantMembership" ADD COLUMN "invitationStatus" "InvitationStatus" NOT NULL DEFAULT 'NONE';
ALTER TABLE "MerchantMembership" ADD COLUMN "inviteMessage" TEXT;
ALTER TABLE "MerchantMembership" ADD COLUMN "invitedAt" TIMESTAMP(3);
ALTER TABLE "MerchantMembership" ADD COLUMN "lastActivityAt" TIMESTAMP(3);

ALTER TABLE "LoyaltyProgram" ADD COLUMN "mode" "LoyaltyMode" NOT NULL DEFAULT 'VISITS';
ALTER TABLE "LoyaltyProgram" ADD COLUMN "status" "ProgramStatus" NOT NULL DEFAULT 'ACTIVE';
ALTER TABLE "LoyaltyProgram" ADD COLUMN "config" JSONB NOT NULL DEFAULT '{}';
ALTER TABLE "LoyaltyProgram" ADD COLUMN "draftConfig" JSONB;
ALTER TABLE "LoyaltyProgram" ADD COLUMN "version" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "LoyaltyProgram" ADD COLUMN "publishedAt" TIMESTAMP(3);
ALTER TABLE "LoyaltyProgram" ADD COLUMN "scheduledAt" TIMESTAMP(3);
ALTER TABLE "LoyaltyProgram" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "LoyaltyProgram" SET "publishedAt" = "updatedAt" WHERE "publishedAt" IS NULL;

CREATE TABLE "LoyaltyReward" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "iconUrl" TEXT,
    "rewardType" "RewardType" NOT NULL DEFAULT 'CUSTOM',
    "threshold" INTEGER NOT NULL,
    "thresholdUnit" TEXT NOT NULL DEFAULT 'visits',
    "value" DOUBLE PRECISION,
    "minPurchase" DOUBLE PRECISION,
    "maxDiscount" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "validFrom" TIMESTAMP(3),
    "validUntil" TIMESTAMP(3),
    "maxUsesPerCustomer" INTEGER,
    "reuseDelayDays" INTEGER,
    "globalLimit" INTEGER,
    "conditions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoyaltyReward_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LoyaltyProgramVersion" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "mode" "LoyaltyMode" NOT NULL,
    "config" JSONB NOT NULL,
    "rewards" JSONB NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedBy" TEXT,

    CONSTRAINT "LoyaltyProgramVersion_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "LoyaltyTransaction" ADD COLUMN "status" "LoyaltyTxStatus" NOT NULL DEFAULT 'COMPLETED';
ALTER TABLE "LoyaltyTransaction" ADD COLUMN "purchaseAmount" DOUBLE PRECISION;
ALTER TABLE "LoyaltyTransaction" ADD COLUMN "rewardId" TEXT;
ALTER TABLE "LoyaltyTransaction" ADD COLUMN "relatedTxId" TEXT;
ALTER TABLE "LoyaltyTransaction" ADD COLUMN "programVersion" INTEGER;
ALTER TABLE "LoyaltyTransaction" ADD COLUMN "metadata" JSONB;

CREATE INDEX "LoyaltyReward_programId_sortOrder_idx" ON "LoyaltyReward"("programId", "sortOrder");
CREATE INDEX "LoyaltyProgramVersion_programId_version_idx" ON "LoyaltyProgramVersion"("programId", "version");
CREATE INDEX "LoyaltyTransaction_performedByUserId_createdAt_idx" ON "LoyaltyTransaction"("performedByUserId", "createdAt");

ALTER TABLE "LoyaltyReward" ADD CONSTRAINT "LoyaltyReward_programId_fkey" FOREIGN KEY ("programId") REFERENCES "LoyaltyProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LoyaltyProgramVersion" ADD CONSTRAINT "LoyaltyProgramVersion_programId_fkey" FOREIGN KEY ("programId") REFERENCES "LoyaltyProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LoyaltyTransaction" ADD CONSTRAINT "LoyaltyTransaction_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "LoyaltyReward"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Migrate existing single reward into LoyaltyReward rows (skip if any exist)
INSERT INTO "LoyaltyReward" ("id", "programId", "name", "rewardType", "threshold", "thresholdUnit", "sortOrder", "updatedAt")
SELECT
  'migr_' || lp."id",
  lp."id",
  lp."rewardLabel",
  'CUSTOM'::"RewardType",
  lp."visitsRequired",
  'visits',
  0,
  NOW()
FROM "LoyaltyProgram" lp
WHERE NOT EXISTS (SELECT 1 FROM "LoyaltyReward" lr WHERE lr."programId" = lp."id");
