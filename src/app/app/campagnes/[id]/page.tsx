import { notFound, redirect } from "next/navigation";
import { MerchantPageHeader, MerchantPageShell } from "@/components/merchant/merchant-ui";
import { prisma } from "@/lib/prisma";
import { resolveMerchantDemo } from "@/lib/merchant-demo-server";
import { canManageMerchantSettings, firstActiveStaffMembership } from "@/lib/rbac";
import { MerchantCampaignFiche } from "./fiche";

/**
 * Fiche d'une campagne côté commerçant (adresse neutre /app/campagnes/[id], sans segment « ads »).
 * Le paramètre est l'identifiant de la campagne — celui utilisé par les notifications et le retour Stripe.
 */
export default async function CampagneFichePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ paid?: string; cancelled?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const { user, demo } = await resolveMerchantDemo();
  if (demo) redirect("/app/campagnes");
  if (!user) redirect("/app/connexion");
  const membership = firstActiveStaffMembership(user.merchantMemberships);
  if (!membership || !canManageMerchantSettings(membership.role)) redirect("/app");

  // Une campagne d'un autre commerce est indiscernable d'une campagne inexistante (404).
  const ad = await prisma.adRequest.findFirst({
    where: { campaignId: id, merchantId: membership.merchantId },
    select: { id: true },
  });
  if (!ad) notFound();

  return (
    <MerchantPageShell>
      <MerchantPageHeader eyebrow="Campagnes · Mise en avant" title="Ma mise en avant" backHref="/app/campagnes" />
      <MerchantCampaignFiche adId={ad.id} paid={query.paid === "1"} cancelled={query.cancelled === "1"} />
    </MerchantPageShell>
  );
}
