-- Visuel Google Wallet campagne + idempotence des envois staff
CREATE TYPE "AdGoogleWalletVisualStatus" AS ENUM ('NOT_PREPARED', 'SENT_TO_MERCHANT', 'CHANGES_REQUESTED', 'APPROVED');

ALTER TABLE "AdRequest" ADD COLUMN "googleWalletHeroUrl" TEXT;
ALTER TABLE "AdRequest" ADD COLUMN "googleWalletHeroOriginalUrl" TEXT;
ALTER TABLE "AdRequest" ADD COLUMN "googleWalletVisualStatus" "AdGoogleWalletVisualStatus" NOT NULL DEFAULT 'NOT_PREPARED';
ALTER TABLE "AdRequest" ADD COLUMN "googleWalletVisualComment" TEXT;
ALTER TABLE "AdRequest" ADD COLUMN "googleWalletFinalVersionId" TEXT;

CREATE TABLE "AdGoogleWalletVisualVersion" (
    "id" TEXT NOT NULL,
    "adRequestId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "author" "AdVisualAuthor" NOT NULL,
    "status" "AdVisualVersionStatus" NOT NULL,
    "url" TEXT NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "reframed" BOOLEAN NOT NULL DEFAULT false,
    "comment" TEXT,
    "decidedBy" TEXT,
    "decidedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdGoogleWalletVisualVersion_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AdGoogleWalletVisualVersion_adRequestId_number_key" ON "AdGoogleWalletVisualVersion"("adRequestId", "number");
CREATE INDEX "AdGoogleWalletVisualVersion_adRequestId_status_idx" ON "AdGoogleWalletVisualVersion"("adRequestId", "status");

ALTER TABLE "AdGoogleWalletVisualVersion" ADD CONSTRAINT "AdGoogleWalletVisualVersion_adRequestId_fkey" FOREIGN KEY ("adRequestId") REFERENCES "AdRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "StaffNotificationDispatch" (
    "id" TEXT NOT NULL,
    "dedupeKey" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StaffNotificationDispatch_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "StaffNotificationDispatch_dedupeKey_key" ON "StaffNotificationDispatch"("dedupeKey");
