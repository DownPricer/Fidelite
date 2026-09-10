import Link from "next/link";
import { redirect } from "next/navigation";

import { MerchantCardsGallery } from "@/components/super-admin/merchant-cards-gallery";
import { SuperAdminShell } from "@/components/super-admin/layout-shell";
import { Button } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { getSuperAdminSessionUser } from "@/lib/super-admin-session";

export default async function MerchantCardsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getSuperAdminSessionUser();
  if (!user) redirect("/super-admin/connexion");

  const { id: merchantId } = await params;
  const merchant = await prisma.merchant.findUnique({
    where: { id: merchantId },
    select: { id: true, name: true, slug: true },
  });
  if (!merchant) redirect("/super-admin/commerces");

  return (
    <SuperAdminShell firstName={user.firstName}>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-text)]">
              Super-admin · Commerces · Cartes
            </p>
            <h1 className="text-2xl font-black text-[var(--ink)]">{merchant.name}</h1>
          </div>
          <Link href={`/super-admin/commerces/${merchantId}`}>
            <Button variant="secondary">Retour à la fiche commerce</Button>
          </Link>
        </div>

        <MerchantCardsGallery
          merchantId={merchant.id}
          merchantName={merchant.name}
          merchantSlug={merchant.slug}
        />
      </div>
    </SuperAdminShell>
  );
}
