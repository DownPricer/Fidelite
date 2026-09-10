import { Suspense } from "react";
import { redirect } from "next/navigation";

import { parseCardSlotSlug, merchantCardsGalleryPath } from "@/lib/merchant-card-slots";
import { getSuperAdminSessionUser } from "@/lib/super-admin-session";
import { CardEditorPage } from "../../editeur/card-editor";

export default async function CardEditorVariantRoute({
  params,
}: {
  params: Promise<{ merchantId: string; variant: string }>;
}) {
  const user = await getSuperAdminSessionUser();
  if (!user) redirect("/super-admin/connexion");

  const { merchantId, variant } = await params;
  const cardSlot = parseCardSlotSlug(variant);
  if (!cardSlot) redirect(merchantCardsGalleryPath(merchantId));

  return (
    <Suspense fallback={<p className="p-6 text-sm text-[var(--muted-text)]">Chargement de l’éditeur…</p>}>
      <CardEditorPage
        firstName={user.firstName}
        merchantId={merchantId}
        cardSlot={cardSlot}
        galleryHref={merchantCardsGalleryPath(merchantId)}
      />
    </Suspense>
  );
}
