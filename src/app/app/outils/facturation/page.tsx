import { redirect } from "next/navigation";
import { MerchantPageHeader, MerchantPageShell } from "@/components/merchant/merchant-ui";
import { resolveMerchantDemo } from "@/lib/merchant-demo-server";
import { canManageMerchantSettings, firstActiveStaffMembership } from "@/lib/rbac";
import { BillingPanel } from "./ui";

/** Réglages et facturation (Outils) : abonnement, factures, transactions — réservé aux administrateurs du commerce. */
export default async function FacturationPage() {
  const { user, demo } = await resolveMerchantDemo();
  if (demo) redirect("/app/outils");
  if (!user) redirect("/app/connexion");
  const membership = firstActiveStaffMembership(user.merchantMemberships);
  if (!membership || !canManageMerchantSettings(membership.role)) redirect("/app");

  return (
    <MerchantPageShell>
      <MerchantPageHeader
        eyebrow="Outils · Réglages"
        title="Réglages et facturation"
        subtitle="Votre abonnement, vos factures et vos transactions."
        backHref="/app/outils"
      />
      <BillingPanel />
    </MerchantPageShell>
  );
}
