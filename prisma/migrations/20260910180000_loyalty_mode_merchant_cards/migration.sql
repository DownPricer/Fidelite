-- Ajout du type d'événement wallet pour mise à jour de variante de carte (sans déblocage).
ALTER TYPE "WalletEventType" ADD VALUE IF NOT EXISTS 'MERCHANT_CARD_UPDATED';

-- Backfill : associer les gabarits existants au mode actif et créer les variantes manquantes.
DO $$
DECLARE
  merchant_row RECORD;
  primary_tpl RECORD;
  target_mode TEXT;
  new_id TEXT;
  mode_names JSONB := '{
    "VISITS": "Carte par passages",
    "POINTS_BY_AMOUNT": "Carte points selon le montant",
    "FIXED_POINTS": "Carte points fixes par achat",
    "AMOUNT_TIERS": "Carte par paliers de montant"
  }'::jsonb;
BEGIN
  FOR merchant_row IN
    SELECT m.id AS merchant_id, lp.mode::text AS active_mode
    FROM "Merchant" m
    INNER JOIN "LoyaltyProgram" lp ON lp."merchantId" = m.id
  LOOP
    SELECT t.*
    INTO primary_tpl
    FROM "MerchantCardTemplate" t
    WHERE t."merchantId" = merchant_row.merchant_id
    ORDER BY
      CASE t.status
        WHEN 'PUBLISHED' THEN 3
        WHEN 'DRAFT' THEN 2
        ELSE 1
      END DESC,
      CASE WHEN t."loyaltyMode"::text = merchant_row.active_mode THEN 1 ELSE 0 END DESC,
      t."isDefault" DESC,
      t."updatedAt" DESC
    LIMIT 1;

    IF primary_tpl IS NULL THEN
      CONTINUE;
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM "MerchantCardTemplate"
      WHERE "merchantId" = merchant_row.merchant_id
        AND "loyaltyMode"::text = merchant_row.active_mode
    ) THEN
      UPDATE "MerchantCardTemplate"
      SET "loyaltyMode" = merchant_row.active_mode::"LoyaltyMode",
          "name" = COALESCE(mode_names ->> merchant_row.active_mode, primary_tpl.name)
      WHERE id = primary_tpl.id;

      SELECT t.*
      INTO primary_tpl
      FROM "MerchantCardTemplate" t
      WHERE t.id = primary_tpl.id;
    END IF;

    FOREACH target_mode IN ARRAY ARRAY['VISITS', 'POINTS_BY_AMOUNT', 'FIXED_POINTS', 'AMOUNT_TIERS']
    LOOP
      IF EXISTS (
        SELECT 1
        FROM "MerchantCardTemplate"
        WHERE "merchantId" = merchant_row.merchant_id
          AND "loyaltyMode"::text = target_mode
      ) THEN
        CONTINUE;
      END IF;

      new_id := 'cm' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 23);

      INSERT INTO "MerchantCardTemplate" (
        id,
        "merchantId",
        "loyaltyMode",
        name,
        "backgroundUrl",
        config,
        "schemaVersion",
        status,
        version,
        "isDefault",
        "authorId",
        "createdAt",
        "updatedAt"
      )
      VALUES (
        new_id,
        merchant_row.merchant_id,
        target_mode::"LoyaltyMode",
        COALESCE(mode_names ->> target_mode, 'Gabarit principal'),
        primary_tpl."backgroundUrl",
        primary_tpl.config,
        primary_tpl."schemaVersion",
        'DRAFT',
        1,
        target_mode = merchant_row.active_mode,
        primary_tpl."authorId",
        NOW(),
        NOW()
      );
    END LOOP;
  END LOOP;
END $$;
