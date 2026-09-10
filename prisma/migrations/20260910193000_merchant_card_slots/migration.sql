-- Emplacement « carte générale » distinct des modes de fidélité.
CREATE TYPE "MerchantCardSlot" AS ENUM (
  'GENERAL',
  'VISITS',
  'POINTS_BY_AMOUNT',
  'FIXED_POINTS',
  'AMOUNT_TIERS'
);

ALTER TABLE "MerchantCardTemplate" ADD COLUMN "cardSlot" "MerchantCardSlot";

UPDATE "MerchantCardTemplate"
SET "cardSlot" = "loyaltyMode"::text::"MerchantCardSlot"
WHERE "cardSlot" IS NULL;

ALTER TABLE "MerchantCardTemplate" ALTER COLUMN "cardSlot" SET NOT NULL;
ALTER TABLE "MerchantCardTemplate" ALTER COLUMN "cardSlot" SET DEFAULT 'VISITS';

ALTER TABLE "MerchantCardTemplate" ALTER COLUMN "loyaltyMode" DROP NOT NULL;

CREATE INDEX "MerchantCardTemplate_merchantId_cardSlot_idx"
  ON "MerchantCardTemplate"("merchantId", "cardSlot");

-- Crée l’emplacement général manquant (brouillon) sans toucher aux gabarits existants.
DO $$
DECLARE
  merchant_row RECORD;
  primary_tpl RECORD;
  new_id TEXT;
BEGIN
  FOR merchant_row IN SELECT id FROM "Merchant" LOOP
    IF EXISTS (
      SELECT 1 FROM "MerchantCardTemplate"
      WHERE "merchantId" = merchant_row.id AND "cardSlot" = 'GENERAL'
    ) THEN
      CONTINUE;
    END IF;

    SELECT t.*
    INTO primary_tpl
    FROM "MerchantCardTemplate" t
    WHERE t."merchantId" = merchant_row.id
    ORDER BY
      CASE t.status WHEN 'PUBLISHED' THEN 3 WHEN 'DRAFT' THEN 2 ELSE 1 END DESC,
      t."isDefault" DESC,
      t."updatedAt" DESC
    LIMIT 1;

    new_id := 'cm' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 23);

    IF primary_tpl IS NULL THEN
      INSERT INTO "MerchantCardTemplate" (
        id, "merchantId", "cardSlot", "loyaltyMode", name, "backgroundUrl", config,
        "schemaVersion", status, version, "isDefault", "createdAt", "updatedAt"
      ) VALUES (
        new_id,
        merchant_row.id,
        'GENERAL',
        NULL,
        'Carte générale du commerce',
        NULL,
        '{"schemaVersion":1,"aspectRatio":1.586,"background":{"url":"","fit":"cover","position":{"x":0.5,"y":0.5},"scale":1},"safeZone":{"top":0.04,"right":0.04,"bottom":0.04,"left":0.04},"elements":[]}'::jsonb,
        1,
        'DRAFT',
        1,
        false,
        NOW(),
        NOW()
      );
    ELSE
      INSERT INTO "MerchantCardTemplate" (
        id, "merchantId", "cardSlot", "loyaltyMode", name, "backgroundUrl", config,
        "schemaVersion", status, version, "isDefault", "authorId", "createdAt", "updatedAt"
      ) VALUES (
        new_id,
        merchant_row.id,
        'GENERAL',
        NULL,
        'Carte générale du commerce',
        primary_tpl."backgroundUrl",
        primary_tpl.config,
        primary_tpl."schemaVersion",
        'DRAFT',
        1,
        false,
        primary_tpl."authorId",
        NOW(),
        NOW()
      );
    END IF;
  END LOOP;
END $$;
