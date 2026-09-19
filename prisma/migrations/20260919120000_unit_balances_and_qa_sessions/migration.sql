-- Separate loyalty balances by canonical unit while keeping the legacy
-- CustomerMembership.points column for backward compatibility.
ALTER TABLE "CustomerMembership"
  ADD COLUMN IF NOT EXISTS "pointsBalance" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "visitsBalance" INTEGER NOT NULL DEFAULT 0;

UPDATE "CustomerMembership" cm
SET
  "pointsBalance" = CASE
    WHEN lp."mode" IN ('POINTS_BY_AMOUNT', 'FIXED_POINTS') THEN cm."points"
    ELSE cm."pointsBalance"
  END,
  "visitsBalance" = CASE
    WHEN lp."mode" IN ('VISITS', 'AMOUNT_TIERS') THEN cm."points"
    ELSE cm."visitsBalance"
  END
FROM "LoyaltyProgram" lp
WHERE lp."merchantId" = cm."merchantId"
  AND cm."points" <> 0
  AND (
    (lp."mode" IN ('POINTS_BY_AMOUNT', 'FIXED_POINTS') AND cm."pointsBalance" = 0)
    OR
    (lp."mode" IN ('VISITS', 'AMOUNT_TIERS') AND cm."visitsBalance" = 0)
  );

ALTER TABLE "Session"
  ADD COLUMN IF NOT EXISTS "isQaMagicLogin" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "qaMagicLoginTokenId" TEXT;

CREATE INDEX IF NOT EXISTS "Session_isQaMagicLogin_idx" ON "Session"("isQaMagicLogin");
CREATE INDEX IF NOT EXISTS "Session_qaMagicLoginTokenId_idx" ON "Session"("qaMagicLoginTokenId");
