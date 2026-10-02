-- CreateTable
CREATE TABLE "GoogleWalletGlobalAdPreview" (
    "userId" TEXT NOT NULL,
    "adRequestId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "startedById" TEXT,
    "lastGoogleSyncOk" BOOLEAN,
    "lastGoogleSyncError" TEXT,
    "lastGoogleSyncAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoogleWalletGlobalAdPreview_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE INDEX "GoogleWalletGlobalAdPreview_adRequestId_idx" ON "GoogleWalletGlobalAdPreview"("adRequestId");

-- CreateIndex
CREATE INDEX "GoogleWalletGlobalAdPreview_expiresAt_idx" ON "GoogleWalletGlobalAdPreview"("expiresAt");

-- AddForeignKey
ALTER TABLE "GoogleWalletGlobalAdPreview" ADD CONSTRAINT "GoogleWalletGlobalAdPreview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoogleWalletGlobalAdPreview" ADD CONSTRAINT "GoogleWalletGlobalAdPreview_adRequestId_fkey" FOREIGN KEY ("adRequestId") REFERENCES "AdRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
