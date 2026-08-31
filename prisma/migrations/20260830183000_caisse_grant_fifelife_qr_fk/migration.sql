-- Ajout d'une clé étrangère explicite vers FifeLifeQrToken pour les nouveaux CaisseGrant.
-- L'ancien champ qrTokenId reste en place pour les grants historiques.

ALTER TABLE "CaisseGrant"
ADD COLUMN "fifeLifeQrTokenId" TEXT;

ALTER TABLE "CaisseGrant"
ADD CONSTRAINT "CaisseGrant_fifeLifeQrTokenId_fkey"
FOREIGN KEY ("fifeLifeQrTokenId") REFERENCES "FifeLifeQrToken"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "CaisseGrant_fifeLifeQrTokenId_idx"
ON "CaisseGrant"("fifeLifeQrTokenId");

