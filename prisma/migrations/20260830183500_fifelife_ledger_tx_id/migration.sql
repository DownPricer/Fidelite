-- Ajout d'une référence facultative vers LoyaltyTransaction pour garantir
-- l'idempotence des points Fife Life par transaction.

ALTER TABLE "FifeLifePointsLedger"
ADD COLUMN "loyaltyTransactionId" TEXT;

ALTER TABLE "FifeLifePointsLedger"
ADD CONSTRAINT "FifeLifePointsLedger_loyaltyTransactionId_fkey"
FOREIGN KEY ("loyaltyTransactionId") REFERENCES "LoyaltyTransaction"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

CREATE UNIQUE INDEX "FifeLifePointsLedger_loyaltyTransactionId_key"
ON "FifeLifePointsLedger"("loyaltyTransactionId");

