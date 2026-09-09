-- CreateEnum
CREATE TYPE "MerchantStatus" AS ENUM ('DRAFT', 'TRIAL', 'ACTIVE', 'SUSPENDED', 'ARCHIVED');
CREATE TYPE "CardTemplateStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE "SubscriptionPlan" AS ENUM ('STARTER', 'PRO', 'ENTERPRISE');
CREATE TYPE "SubscriptionStatus" AS ENUM ('DRAFT', 'TRIAL', 'ACTIVE', 'PAST_DUE', 'CANCELLED', 'EXPIRED');
CREATE TYPE "SubscriptionFrequency" AS ENUM ('MONTHLY', 'YEARLY');
CREATE TYPE "ContractStatus" AS ENUM ('DRAFT', 'ACTIVE', 'EXPIRED', 'TERMINATED');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- AlterEnum
ALTER TYPE "SessionKind" ADD VALUE 'SUPER_ADMIN';

-- AlterTable Merchant
ALTER TABLE "Merchant" ADD COLUMN "status" "MerchantStatus" NOT NULL DEFAULT 'ACTIVE';
ALTER TABLE "Merchant" ADD COLUMN "category" TEXT;
ALTER TABLE "Merchant" ADD COLUMN "shortDescription" TEXT;
ALTER TABLE "Merchant" ADD COLUMN "description" TEXT;
ALTER TABLE "Merchant" ADD COLUMN "coverUrl" TEXT;
ALTER TABLE "Merchant" ADD COLUMN "website" TEXT;
ALTER TABLE "Merchant" ADD COLUMN "socialLinks" JSONB;
ALTER TABLE "Merchant" ADD COLUMN "publicPhone" TEXT;
ALTER TABLE "Merchant" ADD COLUMN "publicEmail" TEXT;
ALTER TABLE "Merchant" ADD COLUMN "legalName" TEXT;
ALTER TABLE "Merchant" ADD COLUMN "ownerName" TEXT;
ALTER TABLE "Merchant" ADD COLUMN "ownerPhone" TEXT;
ALTER TABLE "Merchant" ADD COLUMN "adminEmail" TEXT;
ALTER TABLE "Merchant" ADD COLUMN "addressLine1" TEXT;
ALTER TABLE "Merchant" ADD COLUMN "addressLine2" TEXT;
ALTER TABLE "Merchant" ADD COLUMN "postalCode" TEXT;
ALTER TABLE "Merchant" ADD COLUMN "city" TEXT;
ALTER TABLE "Merchant" ADD COLUMN "country" TEXT DEFAULT 'FR';
ALTER TABLE "Merchant" ADD COLUMN "siret" TEXT;
ALTER TABLE "Merchant" ADD COLUMN "vatNumber" TEXT;
ALTER TABLE "Merchant" ADD COLUMN "billingAddressLine1" TEXT;
ALTER TABLE "Merchant" ADD COLUMN "billingAddressLine2" TEXT;
ALTER TABLE "Merchant" ADD COLUMN "billingPostalCode" TEXT;
ALTER TABLE "Merchant" ADD COLUMN "billingCity" TEXT;
ALTER TABLE "Merchant" ADD COLUMN "billingCountry" TEXT;
ALTER TABLE "Merchant" ADD COLUMN "timezone" TEXT NOT NULL DEFAULT 'Europe/Paris';
ALTER TABLE "Merchant" ADD COLUMN "openingHours" JSONB;
ALTER TABLE "Merchant" ADD COLUMN "closedDays" JSONB;
ALTER TABLE "Merchant" ADD COLUMN "exceptionalClosures" JSONB;
ALTER TABLE "Merchant" ADD COLUMN "visibleInSearch" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Merchant" ADD COLUMN "slugLocked" BOOLEAN NOT NULL DEFAULT false;

-- Sync status from isActive for existing rows
UPDATE "Merchant" SET "status" = CASE WHEN "isActive" = true THEN 'ACTIVE'::"MerchantStatus" ELSE 'SUSPENDED'::"MerchantStatus" END;

-- CreateTable MerchantCardTemplate
CREATE TABLE "MerchantCardTemplate" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "loyaltyMode" "LoyaltyMode" NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Gabarit principal',
    "backgroundUrl" TEXT,
    "config" JSONB NOT NULL,
    "schemaVersion" INTEGER NOT NULL DEFAULT 1,
    "status" "CardTemplateStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "authorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MerchantCardTemplate_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MerchantCardTemplateVersion" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "config" JSONB NOT NULL,
    "backgroundUrl" TEXT,
    "authorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MerchantCardTemplateVersion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MerchantSubscription" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL DEFAULT 'STARTER',
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "frequency" "SubscriptionFrequency" NOT NULL DEFAULT 'MONTHLY',
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'DRAFT',
    "trialEndsAt" TIMESTAMP(3),
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "nextBillingAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "autoRenew" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MerchantSubscription_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MerchantContract" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "contractType" TEXT NOT NULL DEFAULT 'subscription',
    "status" "ContractStatus" NOT NULL DEFAULT 'DRAFT',
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "documentUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MerchantContract_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MerchantPayment" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paidAt" TIMESTAMP(3),
    "dueAt" TIMESTAMP(3),
    "reference" TEXT,
    "notes" TEXT,
    "isManual" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MerchantPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MerchantCardTemplate_merchantId_status_idx" ON "MerchantCardTemplate"("merchantId", "status");
CREATE INDEX "MerchantCardTemplate_merchantId_loyaltyMode_idx" ON "MerchantCardTemplate"("merchantId", "loyaltyMode");
CREATE UNIQUE INDEX "MerchantCardTemplateVersion_templateId_version_key" ON "MerchantCardTemplateVersion"("templateId", "version");
CREATE INDEX "MerchantCardTemplateVersion_templateId_createdAt_idx" ON "MerchantCardTemplateVersion"("templateId", "createdAt");
CREATE UNIQUE INDEX "MerchantSubscription_merchantId_key" ON "MerchantSubscription"("merchantId");
CREATE INDEX "MerchantContract_merchantId_status_idx" ON "MerchantContract"("merchantId", "status");
CREATE INDEX "MerchantPayment_merchantId_status_idx" ON "MerchantPayment"("merchantId", "status");
CREATE INDEX "MerchantPayment_paidAt_idx" ON "MerchantPayment"("paidAt");
CREATE INDEX "AuditLog_action_createdAt_idx" ON "AuditLog"("action", "createdAt");

-- AddForeignKey
ALTER TABLE "MerchantCardTemplate" ADD CONSTRAINT "MerchantCardTemplate_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MerchantCardTemplateVersion" ADD CONSTRAINT "MerchantCardTemplateVersion_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "MerchantCardTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MerchantSubscription" ADD CONSTRAINT "MerchantSubscription_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MerchantContract" ADD CONSTRAINT "MerchantContract_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MerchantPayment" ADD CONSTRAINT "MerchantPayment_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
