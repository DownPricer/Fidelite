CREATE TYPE "QaLoginRole" AS ENUM ('merchant', 'employee', 'customer');

CREATE TABLE "QaMagicLoginToken" (
  "id" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "role" "QaLoginRole" NOT NULL,
  "subjectId" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "usedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "QaMagicLoginToken_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "QaMagicLoginToken_tokenHash_key" ON "QaMagicLoginToken"("tokenHash");
CREATE INDEX "QaMagicLoginToken_role_subjectId_idx" ON "QaMagicLoginToken"("role", "subjectId");
CREATE INDEX "QaMagicLoginToken_expiresAt_idx" ON "QaMagicLoginToken"("expiresAt");
CREATE INDEX "QaMagicLoginToken_usedAt_idx" ON "QaMagicLoginToken"("usedAt");
