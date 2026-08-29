import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { LoyaltyCardScreen } from "./ui";

export default async function CardPage({ params }: { params: Promise<{ slug: string }> }) {
  const user = await getSessionUser();
  if (!user) redirect("/connexion");
  const { slug } = await params;

  const membership = await prisma.customerMembership.findFirst({
    where: { userId: user.id, merchant: { slug, isActive: true } },
    include: { merchant: { include: { program: true } } },
  });
  if (!membership || !membership.merchant.program) redirect(`/c/${slug}`);

  return (
    <LoyaltyCardScreen
      firstName={user.firstName}
      slug={slug}
      merchant={{
        name: membership.merchant.name,
        logoUrl: membership.merchant.logoUrl,
        primaryColor: membership.merchant.primaryColor,
        rewardLabel: membership.merchant.program.rewardLabel,
        visitsRequired: membership.merchant.program.visitsRequired,
        points: membership.points,
      }}
    />
  );
}
