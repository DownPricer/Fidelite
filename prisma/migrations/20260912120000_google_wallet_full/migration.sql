-- CreateEnum
CREATE TYPE "GoogleWalletClassKind" AS ENUM ('GLOBAL', 'MERCHANT');

-- CreateEnum
CREATE TYPE "GoogleWalletSyncStatus" AS ENUM ('NEVER_SYNCED', 'PENDING', 'SYNCED', 'ERROR', 'DISABLED');

-- CreateTable
CREATE TABLE "GoogleWalletClass" (
    "id" TEXT NOT NULL,
    "kind" "GoogleWalletClassKind" NOT NULL,
    "merchantId" TEXT,
    "googleClassId" TEXT NOT NULL,
    "activeProfile" "MerchantCardSlot" NOT NULL DEFAULT 'GENERAL',
    "configByMode" JSONB NOT NULL DEFAULT '{}',
    "syncStatus" "GoogleWalletSyncStatus" NOT NULL DEFAULT 'NEVER_SYNCED',
    "lastSyncedAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoogleWalletClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoogleWalletObject" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "merchantId" TEXT,
    "customerMembershipId" TEXT,
    "googleObjectId" TEXT NOT NULL,
    "googleClassId" TEXT NOT NULL,
    "classRecordId" TEXT,
    "syncStatus" "GoogleWalletSyncStatus" NOT NULL DEFAULT 'NEVER_SYNCED',
    "needsSync" BOOLEAN NOT NULL DEFAULT true,
    "lastSyncedAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoogleWalletObject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GoogleWalletClass_googleClassId_key" ON "GoogleWalletClass"("googleClassId");

-- CreateIndex
CREATE UNIQUE INDEX "GoogleWalletClass_kind_merchantId_key" ON "GoogleWalletClass"("kind", "merchantId");

-- CreateIndex
CREATE INDEX "GoogleWalletClass_merchantId_idx" ON "GoogleWalletClass"("merchantId");

-- CreateIndex
CREATE INDEX "GoogleWalletClass_syncStatus_idx" ON "GoogleWalletClass"("syncStatus");

-- CreateIndex
CREATE UNIQUE INDEX "GoogleWalletObject_customerMembershipId_key" ON "GoogleWalletObject"("customerMembershipId");

-- CreateIndex
CREATE UNIQUE INDEX "GoogleWalletObject_googleObjectId_key" ON "GoogleWalletObject"("googleObjectId");

-- CreateIndex
CREATE UNIQUE INDEX "GoogleWalletObject_userId_merchantId_key" ON "GoogleWalletObject"("userId", "merchantId");

-- CreateIndex
CREATE INDEX "GoogleWalletObject_userId_idx" ON "GoogleWalletObject"("userId");

-- CreateIndex
CREATE INDEX "GoogleWalletObject_merchantId_idx" ON "GoogleWalletObject"("merchantId");

-- CreateIndex
CREATE INDEX "GoogleWalletObject_syncStatus_needsSync_idx" ON "GoogleWalletObject"("syncStatus", "needsSync");

-- AddForeignKey
ALTER TABLE "GoogleWalletClass" ADD CONSTRAINT "GoogleWalletClass_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoogleWalletObject" ADD CONSTRAINT "GoogleWalletObject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoogleWalletObject" ADD CONSTRAINT "GoogleWalletObject_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoogleWalletObject" ADD CONSTRAINT "GoogleWalletObject_customerMembershipId_fkey" FOREIGN KEY ("customerMembershipId") REFERENCES "CustomerMembership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoogleWalletObject" ADD CONSTRAINT "GoogleWalletObject_classRecordId_fkey" FOREIGN KEY ("classRecordId") REFERENCES "GoogleWalletClass"("id") ON DELETE SET NULL ON UPDATE CASCADE;
