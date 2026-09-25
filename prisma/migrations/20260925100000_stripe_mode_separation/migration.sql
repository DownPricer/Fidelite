-- Séparation TEST / LIVE des paiements, soldes marketing et campagnes financées.
-- Les données existantes sont conservées et classées TEST : aucun paiement réel n'a pu être
-- encaissé avant l'introduction de STRIPE_MODE, donc rien de réel n'est reclassé par erreur
-- et aucun ancien solde ne peut financer une campagne en mode réel.

CREATE TYPE "StripeMode" AS ENUM ('TEST', 'LIVE');

-- CampaignPayment
ALTER TABLE "CampaignPayment" ADD COLUMN "mode" "StripeMode" NOT NULL DEFAULT 'TEST';
ALTER TABLE "CampaignPayment" ALTER COLUMN "mode" DROP DEFAULT;

-- MarketingBalance : clé primaire (merchantId, mode)
ALTER TABLE "MarketingBalance" ADD COLUMN "mode" "StripeMode" NOT NULL DEFAULT 'TEST';
ALTER TABLE "MarketingBalance" ALTER COLUMN "mode" DROP DEFAULT;
ALTER TABLE "MarketingBalance" DROP CONSTRAINT "MarketingBalance_pkey";
ALTER TABLE "MarketingBalance" ADD CONSTRAINT "MarketingBalance_pkey" PRIMARY KEY ("merchantId", "mode");

-- MarketingLedgerEntry
ALTER TABLE "MarketingLedgerEntry" ADD COLUMN "mode" "StripeMode" NOT NULL DEFAULT 'TEST';
ALTER TABLE "MarketingLedgerEntry" ALTER COLUMN "mode" DROP DEFAULT;
DROP INDEX "MarketingLedgerEntry_merchantId_createdAt_idx";
CREATE INDEX "MarketingLedgerEntry_merchantId_mode_createdAt_idx" ON "MarketingLedgerEntry"("merchantId", "mode", "createdAt");

-- Campagnes et publicités : mode de financement (NULL = quota gratuit / réel)
ALTER TABLE "Campaign" ADD COLUMN "fundingMode" "StripeMode";
ALTER TABLE "AdRequest" ADD COLUMN "fundingMode" "StripeMode";

-- Les campagnes/publicités déjà financées par un paiement existant sont des paiements TEST.
UPDATE "Campaign" SET "fundingMode" = 'TEST' WHERE "requiresPayment" = true;
UPDATE "AdRequest" SET "fundingMode" = 'TEST'
  WHERE "campaignId" IN (SELECT "id" FROM "Campaign" WHERE "requiresPayment" = true);
