-- Numéro client saisissable en caisse (alternative au scan QR).
ALTER TABLE "User" ADD COLUMN "clientNumber" TEXT;

CREATE UNIQUE INDEX "User_clientNumber_key" ON "User"("clientNumber");
