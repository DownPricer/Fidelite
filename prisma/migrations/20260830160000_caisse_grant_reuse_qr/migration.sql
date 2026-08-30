-- Un même QR fixe peut être scanné à chaque visite : un CaisseGrant par scan.
DROP INDEX IF EXISTS "CaisseGrant_qrTokenId_key";

CREATE INDEX IF NOT EXISTS "CaisseGrant_qrTokenId_idx" ON "CaisseGrant"("qrTokenId");
