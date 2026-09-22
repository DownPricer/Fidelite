-- DropIndex
DROP INDEX "CampaignDelivery_status_createdAt_idx";

-- AlterTable
ALTER TABLE "CampaignDelivery" ADD COLUMN     "nextAttemptAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "CampaignDelivery_status_nextAttemptAt_idx" ON "CampaignDelivery"("status", "nextAttemptAt");

