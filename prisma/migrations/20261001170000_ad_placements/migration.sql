-- Emplacements clients des mises en avant (accueil Wallet, recherche, notifications) :
-- placement d'origine des impressions/clics et fréquence d'affichage par client.
CREATE TYPE "AdPlacement" AS ENUM ('WALLET_HOME', 'SEARCH', 'NOTIFICATIONS');

ALTER TABLE "AdEvent" ADD COLUMN "placement" "AdPlacement";

CREATE TABLE "AdCustomerView" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "adRequestId" TEXT NOT NULL,
    "lastShownAt" TIMESTAMP(3) NOT NULL,
    "impressions" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "AdCustomerView_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AdCustomerView_userId_adRequestId_key" ON "AdCustomerView"("userId", "adRequestId");
CREATE INDEX "AdCustomerView_userId_lastShownAt_idx" ON "AdCustomerView"("userId", "lastShownAt");
ALTER TABLE "AdCustomerView" ADD CONSTRAINT "AdCustomerView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AdCustomerView" ADD CONSTRAINT "AdCustomerView_adRequestId_fkey" FOREIGN KEY ("adRequestId") REFERENCES "AdRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
