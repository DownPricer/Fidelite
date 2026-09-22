import { notFound, redirect } from "next/navigation";
import { getPublishedCardTemplate } from "@/lib/card-template-resolver";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { programToConfig } from "@/lib/loyalty-program";
import { MerchantProfile } from "@/components/fife-life/merchant-profile";

export const dynamic = "force-dynamic";

/** Fiche commerce publique (Découvrir/Recherche) — jamais le formulaire d'inscription. */
export default async function MerchantProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const merchant = await prisma.merchant.findUnique({
    where: { slug },
    include: { program: { include: { rewards: true } } },
  });
  if (!merchant || !merchant.isActive || !merchant.visibleInSearch || !merchant.program) notFound();

  const user = await getSessionUser();

  if (user) {
    const membership = await prisma.customerMembership.findUnique({
      where: { userId_merchantId: { userId: user.id, merchantId: merchant.id } },
    });
    // Déjà membre : on va directement sur la vraie carte (même style, activité réelle),
    // jamais sur une fiche de présentation dupliquée.
    if (membership) redirect(`/carte/${merchant.slug}`);
  }

  const cardTemplate = await getPublishedCardTemplate(merchant.id, merchant.program.mode);
  const { mode, rules, rewards } = programToConfig(merchant.program, { activeOnly: true });

  return (
    <MerchantProfile
      merchant={{
        name: merchant.name,
        slug: merchant.slug,
        logoUrl: merchant.logoUrl,
        primaryColor: merchant.primaryColor,
        category: merchant.category,
        shortDescription: merchant.shortDescription,
        description: merchant.description,
        website: merchant.website,
        addressLine1: merchant.addressLine1,
        addressLine2: merchant.addressLine2,
        postalCode: merchant.postalCode,
        city: merchant.city,
        cardTemplate: cardTemplate
          ? { backgroundUrl: cardTemplate.backgroundUrl, config: cardTemplate.config, loyaltyMode: cardTemplate.loyaltyMode }
          : null,
      }}
      mode={mode}
      rules={rules}
      rewards={rewards}
      signedIn={Boolean(user)}
    />
  );
}
