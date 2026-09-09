-- AlterEnum
ALTER TYPE "WalletEventType" ADD VALUE IF NOT EXISTS 'CARD_REMOVED';

-- AlterTable
ALTER TABLE "CustomerMembership" ADD COLUMN IF NOT EXISTS "removedAt" TIMESTAMP(3);
