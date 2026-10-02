-- CreateEnum
CREATE TYPE "CustomerAccessTokenKind" AS ENUM ('EMAIL_VERIFICATION', 'ACCOUNT_RECOVERY', 'PHONE_VERIFICATION');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "onboardingStartedAt" TIMESTAMP(3),
ADD COLUMN "emailConfirmedAt" TIMESTAMP(3),
ADD COLUMN "profileFinalizedAt" TIMESTAMP(3),
ADD COLUMN "finalizationReminderSentAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "CustomerAccessToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" "CustomerAccessTokenKind" NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerAccessToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerAccessToken_tokenHash_key" ON "CustomerAccessToken"("tokenHash");

-- CreateIndex
CREATE INDEX "CustomerAccessToken_userId_kind_idx" ON "CustomerAccessToken"("userId", "kind");

-- CreateIndex
CREATE INDEX "CustomerAccessToken_expiresAt_idx" ON "CustomerAccessToken"("expiresAt");

-- AddForeignKey
ALTER TABLE "CustomerAccessToken" ADD CONSTRAINT "CustomerAccessToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
