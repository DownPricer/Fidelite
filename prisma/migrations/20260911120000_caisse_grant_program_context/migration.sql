-- Contexte programme figé sur chaque grant caisse
ALTER TABLE "CaisseGrant" ADD COLUMN "programId" TEXT;
ALTER TABLE "CaisseGrant" ADD COLUMN "programVersion" INTEGER;
ALTER TABLE "CaisseGrant" ADD COLUMN "programMode" "LoyaltyMode";

CREATE INDEX "CaisseGrant_programId_idx" ON "CaisseGrant"("programId");
