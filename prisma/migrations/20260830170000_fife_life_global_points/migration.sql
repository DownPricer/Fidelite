-- Ajout des points globaux Fife Life et des événements de portefeuille.

-- Enum pour typer les événements de portefeuille côté client.
CREATE TYPE "WalletEventType" AS ENUM (
  'CARD_CREATED',
  'MERCHANT_POINTS_UPDATED',
  'REWARD_REDEEMED',
  'FIFE_LIFE_POINTS_UPDATED'
);

-- Solde global de points Fife Life sur l’utilisateur.
ALTER TABLE "User"
ADD COLUMN "fifeLifePoints" INTEGER NOT NULL DEFAULT 0;

-- Ledger des points Fife Life.
CREATE TABLE "FifeLifePointsLedger" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "delta" INTEGER NOT NULL,
  "reason" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "FifeLifePointsLedger_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "FifeLifePointsLedger_userId_createdAt_idx"
  ON "FifeLifePointsLedger"("userId", "createdAt");

ALTER TABLE "FifeLifePointsLedger"
ADD CONSTRAINT "FifeLifePointsLedger_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- Événements de portefeuille pour synchronisation (SSE / polling léger).
CREATE TABLE "WalletEvent" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "merchantId" TEXT,
  "customerMembershipId" TEXT,
  "type" "WalletEventType" NOT NULL,
  "payload" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "WalletEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "WalletEvent_userId_createdAt_idx"
  ON "WalletEvent"("userId", "createdAt");

ALTER TABLE "WalletEvent"
ADD CONSTRAINT "WalletEvent_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WalletEvent"
ADD CONSTRAINT "WalletEvent_merchantId_fkey"
FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "WalletEvent"
ADD CONSTRAINT "WalletEvent_customerMembershipId_fkey"
FOREIGN KEY ("customerMembershipId") REFERENCES "CustomerMembership"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

