import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { MerchantPublic } from "./ui";

export default async function MerchantPublicPage({
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
      }}
      alreadyMember={alreadyMember}
      signedIn={Boolean(user)}
      firstName={user?.firstName ?? null}
    />
  );
}
