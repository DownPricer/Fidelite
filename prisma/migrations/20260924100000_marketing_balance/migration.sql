-- CreateEnum
CREATE TYPE "MarketingLedgerType" AS ENUM ('TOPUP', 'DEBIT', 'REFUND');

-- CreateEnum
CREATE TYPE "MarketingLedgerStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "MarketingBalance" (
    "merchantId" TEXT NOT NULL,
    "balanceCents" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketingBalance_pkey" PRIMARY KEY ("merchantId"),
    CONSTRAINT "MarketingBalance_balanceCents_nonnegative" CHECK ("balanceCents" >= 0)
);

-- CreateTable
CREATE TABLE "MarketingLedgerEntry" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "type" "MarketingLedgerType" NOT NULL,
    "status" "MarketingLedgerStatus" NOT NULL DEFAULT 'PAID',
    "amountCents" INTEGER NOT NULL,
    "balanceAfterCents" INTEGER,
    "campaignId" TEXT,
    "reversalOfId" TEXT,
    "stripeCheckoutSessionId" TEXT,
    "stripePaymentIntentId" TEXT,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketingLedgerEntry_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "MarketingLedgerEntry_amountCents_positive" CHECK ("amountCents" > 0)
);

-- CreateIndex
CREATE UNIQUE INDEX "MarketingLedgerEntry_campaignId_key" ON "MarketingLedgerEntry"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "MarketingLedgerEntry_reversalOfId_key" ON "MarketingLedgerEntry"("reversalOfId");

-- CreateIndex
CREATE UNIQUE INDEX "MarketingLedgerEntry_stripeCheckoutSessionId_key" ON "MarketingLedgerEntry"("stripeCheckoutSessionId");

-- CreateIndex
CREATE INDEX "MarketingLedgerEntry_merchantId_createdAt_idx" ON "MarketingLedgerEntry"("merchantId", "createdAt");

-- AddForeignKey
ALTER TABLE "MarketingBalance" ADD CONSTRAINT "MarketingBalance_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketingLedgerEntry" ADD CONSTRAINT "MarketingLedgerEntry_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketingLedgerEntry" ADD CONSTRAINT "MarketingLedgerEntry_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;
