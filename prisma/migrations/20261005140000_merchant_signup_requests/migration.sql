-- CreateEnum
CREATE TYPE "MerchantSignupRequestStatus" AS ENUM ('PENDING_REVIEW', 'REJECTED', 'CODE_SENT', 'CODE_REVOKED', 'ACCOUNT_LINKED');

-- CreateTable
CREATE TABLE "MerchantSignupRequest" (
    "id" TEXT NOT NULL,
    "status" "MerchantSignupRequestStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "planId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "businessActivity" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobilePhone" TEXT NOT NULL,
    "landlinePhone" TEXT,
    "website" TEXT,
    "siret" TEXT,
    "message" TEXT,
    "addressLine1" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'FR',
    "contactConsentAt" TIMESTAMP(3) NOT NULL,
    "internalNote" TEXT,
    "codeHash" TEXT,
    "codeExpiresAt" TIMESTAMP(3),
    "codeSentAt" TIMESTAMP(3),
    "codeUsedAt" TIMESTAMP(3),
    "codeRevokedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "merchantId" TEXT,
    "userId" TEXT,
    "stripeCheckoutSessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MerchantSignupRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MerchantSignupRequest_merchantId_key" ON "MerchantSignupRequest"("merchantId");

-- CreateIndex
CREATE INDEX "MerchantSignupRequest_email_idx" ON "MerchantSignupRequest"("email");

-- CreateIndex
CREATE INDEX "MerchantSignupRequest_status_createdAt_idx" ON "MerchantSignupRequest"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "MerchantSignupRequest" ADD CONSTRAINT "MerchantSignupRequest_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerchantSignupRequest" ADD CONSTRAINT "MerchantSignupRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
