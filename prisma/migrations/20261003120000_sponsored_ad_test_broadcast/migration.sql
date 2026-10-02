-- Remplace l'aperçu QA mono-compte par une diffusion test globale super-admin.
DROP TABLE IF EXISTS "GoogleWalletGlobalAdPreview";

CREATE TABLE "SponsoredAdTestBroadcast" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "adRequestId" TEXT NOT NULL,
    "startedById" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastGoogleSyncOk" BOOLEAN,
    "lastGoogleSyncError" TEXT,
    "lastGoogleSyncAt" TIMESTAMP(3),
    "googleObjectsSynced" INTEGER NOT NULL DEFAULT 0,
    "googleObjectsFailed" INTEGER NOT NULL DEFAULT 0,
    "googleObjectsTotal" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SponsoredAdTestBroadcast_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SponsoredAdTestBroadcast_adRequestId_key" ON "SponsoredAdTestBroadcast"("adRequestId");

CREATE INDEX "SponsoredAdTestBroadcast_adRequestId_idx" ON "SponsoredAdTestBroadcast"("adRequestId");

ALTER TABLE "SponsoredAdTestBroadcast" ADD CONSTRAINT "SponsoredAdTestBroadcast_adRequestId_fkey" FOREIGN KEY ("adRequestId") REFERENCES "AdRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
