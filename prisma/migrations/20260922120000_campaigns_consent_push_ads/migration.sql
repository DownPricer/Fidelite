-- CreateEnum
CREATE TYPE "CampaignChannel" AS ENUM ('IN_APP_PUSH', 'EMAIL', 'SPONSORED_AD');

-- CreateEnum
CREATE TYPE "CampaignAudienceType" AS ENUM ('MERCHANT_MEMBERS', 'NETWORK_LOCAL');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'PAYMENT_REQUIRED', 'PAID', 'SCHEDULED', 'SENDING', 'SENT', 'PARTIALLY_SENT', 'FAILED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CampaignQuotaKind" AS ENUM ('MEMBER_NOTIFICATION', 'MEMBER_EMAIL', 'NETWORK_NOTIFICATION', 'NETWORK_EMAIL', 'SPONSORED_DAY');

-- CreateEnum
CREATE TYPE "CampaignPaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CampaignDeliveryChannel" AS ENUM ('IN_APP', 'PUSH', 'EMAIL');

-- CreateEnum
CREATE TYPE "CampaignDeliveryStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'FAILED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "InAppNotificationKind" AS ENUM ('SERVICE', 'MERCHANT_OFFER', 'NETWORK_DEAL');

-- CreateEnum
CREATE TYPE "AdRequestStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'SCHEDULED', 'LIVE', 'ENDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AdEventType" AS ENUM ('IMPRESSION', 'CLICK');

-- CreateEnum
CREATE TYPE "EmailSuppressionReason" AS ENUM ('UNSUBSCRIBED', 'BOUNCED', 'COMPLAINED', 'MANUAL');

-- AlterTable
ALTER TABLE "CustomerPreferences" ADD COLUMN     "adsMerchantEmail" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "adsMerchantPush" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "adsNetworkEmail" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "adsNetworkPush" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "consentUpdatedAt" TIMESTAMP(3),
ADD COLUMN     "consentVersion" TEXT,
ADD COLUMN     "marketingZoneCity" TEXT,
ADD COLUMN     "marketingZonePostalCode" TEXT;

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "channel" "CampaignChannel" NOT NULL,
    "audienceType" "CampaignAudienceType" NOT NULL,
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "imageUrl" TEXT,
    "actionLabel" TEXT,
    "actionUrl" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Paris',
    "scheduledAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "estimatedRecipients" INTEGER,
    "quotaKind" "CampaignQuotaKind",
    "quotaPeriodKey" TEXT,
    "quotaConsumedAt" TIMESTAMP(3),
    "priceCents" INTEGER,
    "requiresPayment" BOOLEAN NOT NULL DEFAULT false,
    "rejectionReason" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignQuotaUsage" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "kind" "CampaignQuotaKind" NOT NULL,
    "periodKey" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignQuotaUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignPayment" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'eur',
    "status" "CampaignPaymentStatus" NOT NULL DEFAULT 'PENDING',
    "stripeCheckoutSessionId" TEXT,
    "stripePaymentIntentId" TEXT,
    "stripeRefundId" TEXT,
    "failureReason" TEXT,
    "paidAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripeWebhookEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StripeWebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignDelivery" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "channel" "CampaignDeliveryChannel" NOT NULL,
    "status" "CampaignDeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "sentAt" TIMESTAMP(3),
    "clickedAt" TIMESTAMP(3),
    "unsubscribedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CampaignDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InAppNotification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "merchantId" TEXT,
    "campaignId" TEXT,
    "kind" "InAppNotificationKind" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "imageUrl" TEXT,
    "actionLabel" TEXT,
    "actionUrl" TEXT,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InAppNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PushSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PushSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "value" BOOLEAN NOT NULL,
    "source" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsentEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailSuppression" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "reason" "EmailSuppressionReason" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailSuppression_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdRequest" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "campaignId" TEXT,
    "status" "AdRequestStatus" NOT NULL DEFAULT 'DRAFT',
    "requestedText" TEXT NOT NULL,
    "requestedImageUrl" TEXT,
    "objective" TEXT,
    "ctaLabel" TEXT,
    "ctaUrl" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "finalImageUrl" TEXT,
    "rejectionReason" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdEvent" (
    "id" TEXT NOT NULL,
    "adRequestId" TEXT NOT NULL,
    "type" "AdEventType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Campaign_merchantId_status_idx" ON "Campaign"("merchantId", "status");

-- CreateIndex
CREATE INDEX "Campaign_status_scheduledAt_idx" ON "Campaign"("status", "scheduledAt");

-- CreateIndex
CREATE INDEX "Campaign_merchantId_quotaKind_quotaPeriodKey_idx" ON "Campaign"("merchantId", "quotaKind", "quotaPeriodKey");

-- CreateIndex
CREATE INDEX "CampaignQuotaUsage_merchantId_idx" ON "CampaignQuotaUsage"("merchantId");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignQuotaUsage_merchantId_kind_periodKey_key" ON "CampaignQuotaUsage"("merchantId", "kind", "periodKey");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignPayment_campaignId_key" ON "CampaignPayment"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignPayment_stripeCheckoutSessionId_key" ON "CampaignPayment"("stripeCheckoutSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignPayment_stripePaymentIntentId_key" ON "CampaignPayment"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "CampaignPayment_merchantId_status_idx" ON "CampaignPayment"("merchantId", "status");

-- CreateIndex
CREATE INDEX "CampaignDelivery_campaignId_status_idx" ON "CampaignDelivery"("campaignId", "status");

-- CreateIndex
CREATE INDEX "CampaignDelivery_status_createdAt_idx" ON "CampaignDelivery"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignDelivery_campaignId_userId_channel_key" ON "CampaignDelivery"("campaignId", "userId", "channel");

-- CreateIndex
CREATE INDEX "InAppNotification_userId_createdAt_idx" ON "InAppNotification"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "InAppNotification_userId_readAt_idx" ON "InAppNotification"("userId", "readAt");

-- CreateIndex
CREATE UNIQUE INDEX "PushSubscription_endpoint_key" ON "PushSubscription"("endpoint");

-- CreateIndex
CREATE INDEX "PushSubscription_userId_idx" ON "PushSubscription"("userId");

-- CreateIndex
CREATE INDEX "ConsentEvent_userId_field_createdAt_idx" ON "ConsentEvent"("userId", "field", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "EmailSuppression_email_key" ON "EmailSuppression"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AdRequest_campaignId_key" ON "AdRequest"("campaignId");

-- CreateIndex
CREATE INDEX "AdRequest_merchantId_status_idx" ON "AdRequest"("merchantId", "status");

-- CreateIndex
CREATE INDEX "AdRequest_status_startDate_endDate_idx" ON "AdRequest"("status", "startDate", "endDate");

-- CreateIndex
CREATE INDEX "AdEvent_adRequestId_type_createdAt_idx" ON "AdEvent"("adRequestId", "type", "createdAt");

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignPayment" ADD CONSTRAINT "CampaignPayment_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignDelivery" ADD CONSTRAINT "CampaignDelivery_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InAppNotification" ADD CONSTRAINT "InAppNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PushSubscription" ADD CONSTRAINT "PushSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentEvent" ADD CONSTRAINT "ConsentEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdRequest" ADD CONSTRAINT "AdRequest_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdRequest" ADD CONSTRAINT "AdRequest_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdEvent" ADD CONSTRAINT "AdEvent_adRequestId_fkey" FOREIGN KEY ("adRequestId") REFERENCES "AdRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

