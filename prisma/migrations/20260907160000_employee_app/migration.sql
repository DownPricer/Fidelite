-- CreateEnum
CREATE TYPE "SessionKind" AS ENUM ('STANDARD', 'EMPLOYEE');

-- AlterTable
ALTER TABLE "Session" ADD COLUMN "kind" "SessionKind" NOT NULL DEFAULT 'STANDARD';
ALTER TABLE "Session" ADD COLUMN "merchantMembershipId" TEXT;

-- AlterTable
ALTER TABLE "MerchantMembership" ADD COLUMN "invitationTokenHash" TEXT;
ALTER TABLE "MerchantMembership" ADD COLUMN "invitationExpiresAt" TIMESTAMP(3);
ALTER TABLE "MerchantMembership" ADD COLUMN "invitationAcceptedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "MerchantMembership_invitationTokenHash_key" ON "MerchantMembership"("invitationTokenHash");
CREATE INDEX "Session_merchantMembershipId_idx" ON "Session"("merchantMembershipId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_merchantMembershipId_fkey" FOREIGN KEY ("merchantMembershipId") REFERENCES "MerchantMembership"("id") ON DELETE CASCADE ON UPDATE CASCADE;
