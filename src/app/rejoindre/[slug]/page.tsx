import { notFound } from "next/navigation";
import { getPublishedCardTemplate } from "@/lib/card-template-resolver";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { MerchantPublic } from "@/app/c/[slug]/ui";

export default async function JoinMerchantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const merchant = await prisma.merchant.findUnique({
    where: { slug },
    include: { program: true },
  });
  if (!merchant || !merchant.isActive || !merchant.program) notFound();

  const cardTemplate = await getPublishedCardTemplate(merchant.id, merchant.program.mode);

  const user = await getSessionUser();
  const alreadyMember = user
    ? Boolean(
        await prisma.customerMembership.findUnique({
          where: { userId_merchantId: { userId: user.id, merchantId: merchant.id } },
        }),
      )
    : false;

  return (
    <MerchantPublic
      merchant={{
        name: merchant.name,
        slug: merchant.slug,
        logoUrl: merchant.logoUrl,
        primaryColor: merchant.primaryColor,
        rewardLabel: merchant.program.rewardLabel,
        visitsRequired: merchant.program.visitsRequired,
        cardTemplate: cardTemplate
          ? {
              backgroundUrl: cardTemplate.backgroundUrl,
              config: cardTemplate.config,
              loyaltyMode: cardTemplate.loyaltyMode,
            }
          : null,
      }}
      alreadyMember={alreadyMember}
      signedIn={Boolean(user)}
      firstName={user?.firstName ?? null}
    />
  );
}

