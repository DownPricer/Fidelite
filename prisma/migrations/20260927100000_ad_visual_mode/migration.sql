-- Parcours de visuel des publicités sponsorisées (Partie 14) : « Je crée mon visuel » (SELF,
-- une image déjà recadrée au bon format) vs « Fideto crée mon visuel » (FIDETO, 1 à 5 images
-- libres envoyées pour préparation par Fideto). Les demandes existantes restent NULL
-- (comportement historique inchangé : traitées comme FIDETO).

CREATE TYPE "AdVisualMode" AS ENUM ('SELF', 'FIDETO');

ALTER TABLE "AdRequest" ADD COLUMN "visualMode" "AdVisualMode";

CREATE TABLE "AdRequestImage" (
    "id" TEXT NOT NULL,
    "adRequestId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdRequestImage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AdRequestImage_adRequestId_position_idx" ON "AdRequestImage"("adRequestId", "position");

ALTER TABLE "AdRequestImage" ADD CONSTRAINT "AdRequestImage_adRequestId_fkey"
  FOREIGN KEY ("adRequestId") REFERENCES "AdRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
