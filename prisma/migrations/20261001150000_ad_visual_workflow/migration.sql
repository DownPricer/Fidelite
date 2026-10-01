-- Parcours de validation du visuel des mises en avant : versions du bandeau (historique conservé),
-- statut « en attente du commerçant » et notifications persistantes (cloche commerçant / super-admin).
ALTER TYPE "AdRequestStatus" ADD VALUE 'AWAITING_MERCHANT';

CREATE TYPE "AdVisualAuthor" AS ENUM ('MERCHANT', 'FIDETO');
CREATE TYPE "AdVisualVersionStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'PROPOSED', 'APPROVED', 'CHANGES_REQUESTED', 'SUPERSEDED');
CREATE TYPE "StaffNotificationAudience" AS ENUM ('MERCHANT', 'SUPER_ADMIN');

ALTER TABLE "AdRequest" ADD COLUMN "finalVersionId" TEXT;
ALTER TABLE "AdRequest" ADD COLUMN "visualBrief" TEXT;
ALTER TABLE "AdRequestImage" ADD COLUMN "fileName" TEXT;
ALTER TABLE "AdRequestImage" ADD COLUMN "sizeBytes" INTEGER;

CREATE TABLE "AdVisualVersion" (
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

    CONSTRAINT "AdVisualVersion_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AdVisualVersion_adRequestId_number_key" ON "AdVisualVersion"("adRequestId", "number");
CREATE INDEX "AdVisualVersion_adRequestId_status_idx" ON "AdVisualVersion"("adRequestId", "status");
ALTER TABLE "AdVisualVersion" ADD CONSTRAINT "AdVisualVersion_adRequestId_fkey"
  FOREIGN KEY ("adRequestId") REFERENCES "AdRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "StaffNotification" (
    "id" TEXT NOT NULL,
    "audience" "StaffNotificationAudience" NOT NULL,
    "merchantId" TEXT,
    "campaignId" TEXT,
    "adRequestId" TEXT,
    "kind" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StaffNotification_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "StaffNotification_audience_merchantId_readAt_createdAt_idx" ON "StaffNotification"("audience", "merchantId", "readAt", "createdAt");
CREATE INDEX "StaffNotification_adRequestId_createdAt_idx" ON "StaffNotification"("adRequestId", "createdAt");
