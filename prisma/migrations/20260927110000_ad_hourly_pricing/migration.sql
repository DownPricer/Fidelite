-- Tarification à l'heure de la mise en avant (remplace 5 €/jour pour les NOUVELLES demandes
-- uniquement). Les demandes existantes gardent hourlySchedule/hourlyIntervals = NULL : leur
-- priceCents déjà persisté n'est jamais recalculé (voir sponsored-hours-pricing.ts).

ALTER TABLE "AdRequest" ADD COLUMN "hourlySchedule" JSONB;
ALTER TABLE "AdRequest" ADD COLUMN "hourlyIntervals" JSONB;
