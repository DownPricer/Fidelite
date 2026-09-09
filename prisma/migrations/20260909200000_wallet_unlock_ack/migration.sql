-- AlterEnum
ALTER TYPE "WalletEventType" ADD VALUE 'CARD_UNLOCKED';

-- AlterTable
ALTER TABLE "WalletEvent" ADD COLUMN "acknowledgedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "WalletEvent_userId_acknowledgedAt_idx" ON "WalletEvent"("userId", "acknowledgedAt");
