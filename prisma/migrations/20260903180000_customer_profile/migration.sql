-- AlterTable
ALTER TABLE "User" ADD COLUMN "displayName" TEXT,
ADD COLUMN "avatarUrl" TEXT,
ADD COLUMN "phone" TEXT,
ADD COLUMN "phoneCountryCode" TEXT DEFAULT '+33',
ADD COLUMN "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "pendingEmail" TEXT,
ADD COLUMN "addressLine1" TEXT,
ADD COLUMN "addressLine2" TEXT,
ADD COLUMN "postalCode" TEXT,
ADD COLUMN "city" TEXT,
ADD COLUMN "country" TEXT DEFAULT 'FR';

-- CreateTable
CREATE TABLE "CustomerPreferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "notifyPointsMovements" BOOLEAN NOT NULL DEFAULT true,
    "notifyNewBenefit" BOOLEAN NOT NULL DEFAULT true,
    "notifyBenefitExpiring" BOOLEAN NOT NULL DEFAULT true,
    "notifyNewCard" BOOLEAN NOT NULL DEFAULT true,
    "notifyMerchantOffers" BOOLEAN NOT NULL DEFAULT false,
    "notifyFifeLifeNews" BOOLEAN NOT NULL DEFAULT false,
    "notifySecurity" BOOLEAN NOT NULL DEFAULT true,
    "notifyChannelPush" BOOLEAN NOT NULL DEFAULT true,
    "notifyChannelEmail" BOOLEAN NOT NULL DEFAULT true,
    "notifyChannelSms" BOOLEAN NOT NULL DEFAULT false,
    "consentPersonalizedOffers" BOOLEAN NOT NULL DEFAULT false,
    "consentMarketing" BOOLEAN NOT NULL DEFAULT false,
    "consentAnalytics" BOOLEAN NOT NULL DEFAULT false,
    "language" TEXT NOT NULL DEFAULT 'fr',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerPreferences_userId_key" ON "CustomerPreferences"("userId");

-- AddForeignKey
ALTER TABLE "CustomerPreferences" ADD CONSTRAINT "CustomerPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
