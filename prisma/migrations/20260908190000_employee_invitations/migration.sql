-- CreateTable
CREATE TABLE "EmployeeInvitation" (
    "id" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "EmployeeInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeInvitation_tokenHash_key" ON "EmployeeInvitation"("tokenHash");

-- CreateIndex
CREATE INDEX "EmployeeInvitation_membershipId_createdAt_idx" ON "EmployeeInvitation"("membershipId", "createdAt");

-- AddForeignKey
ALTER TABLE "EmployeeInvitation" ADD CONSTRAINT "EmployeeInvitation_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "MerchantMembership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate existing pending invitations from MerchantMembership
INSERT INTO "EmployeeInvitation" ("id", "membershipId", "tokenHash", "createdAt", "expiresAt", "usedAt", "revokedAt")
SELECT
    'mig_' || "id",
    "id",
    "invitationTokenHash",
    COALESCE("invitedAt", "createdAt"),
    COALESCE("invitationExpiresAt", "createdAt" + INTERVAL '48 hours'),
    CASE WHEN "invitationStatus" = 'ACCEPTED' THEN "invitationAcceptedAt" ELSE NULL END,
    CASE WHEN "invitationStatus" = 'CANCELLED' THEN "updatedAt" ELSE NULL END
FROM "MerchantMembership"
WHERE "invitationTokenHash" IS NOT NULL;
