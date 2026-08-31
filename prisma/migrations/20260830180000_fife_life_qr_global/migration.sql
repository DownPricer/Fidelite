-- QR global Fife Life, propre à chaque utilisateur.

CREATE TABLE "FifeLifeQrToken" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "jti" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastScannedAt" TIMESTAMP(3),

  CONSTRAINT "FifeLifeQrToken_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "FifeLifeQrToken_userId_key" ON "FifeLifeQrToken"("userId");
CREATE UNIQUE INDEX "FifeLifeQrToken_jti_key" ON "FifeLifeQrToken"("jti");
CREATE INDEX "FifeLifeQrToken_userId_idx" ON "FifeLifeQrToken"("userId");

ALTER TABLE "FifeLifeQrToken"
ADD CONSTRAINT "FifeLifeQrToken_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill raisonnable pour les QR existants :
-- on prend pour chaque utilisateur le plus ancien QrToken disponible,
-- et on réutilise son id et son jti.
INSERT INTO "FifeLifeQrToken" ("id", "userId", "jti", "createdAt", "lastScannedAt")
SELECT DISTINCT ON (cm."userId")
  qt."id"              AS "id",
  cm."userId"          AS "userId",
  qt."jti"             AS "jti",
  qt."createdAt"       AS "createdAt",
  qt."usedAt"          AS "lastScannedAt"
FROM "QrToken" qt
JOIN "CustomerMembership" cm ON cm."id" = qt."customerMembershipId"
ORDER BY cm."userId", qt."createdAt" ASC;

