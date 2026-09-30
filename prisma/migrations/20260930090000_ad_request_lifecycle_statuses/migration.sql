-- Ajoute les statuts manquants du cycle de vie des mises en avant (bandeaux sponsorisés) :
--   NEEDS_CHANGES : le super-admin demande une correction au commerçant (motif dans
--                   AdRequest.rejectionReason) ; le commerçant peut alors modifier sa demande
--                   via PATCH /api/merchant/ads/[id], ce qui la repasse en PENDING_REVIEW.
--   SUSPENDED     : suspendue par le super-admin (depuis SCHEDULED ou LIVE) — ne diffuse plus.
--   STOPPED       : arrêtée définitivement par le super-admin avant la fin naturelle de ses
--                   créneaux (distinct de ENDED, qui reste réservé à la fin normale).
--
-- ALTER TYPE ... ADD VALUE ne peut pas être exécuté dans le même bloc de transaction qu'une
-- requête qui utilise déjà cette valeur ; chaque ALTER TYPE est donc sa propre instruction,
-- exécutée par Prisma hors transaction implicite (comportement standard de `prisma migrate`).
ALTER TYPE "AdRequestStatus" ADD VALUE 'NEEDS_CHANGES';
ALTER TYPE "AdRequestStatus" ADD VALUE 'SUSPENDED';
ALTER TYPE "AdRequestStatus" ADD VALUE 'STOPPED';
