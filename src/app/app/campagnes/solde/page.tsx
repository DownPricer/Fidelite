import { redirect } from "next/navigation";
import { resolveMerchantDemo } from "@/lib/merchant-demo-server";
import { canManageMerchantSettings, firstActiveStaffMembership } from "@/lib/rbac";
import { MerchantPageHeader, MerchantPageShell } from "@/components/merchant/merchant-ui";
import { SoldeMarketingPanel } from "./ui";

export default async function SoldeMarketingPage() {
  const { user, demo } = await resolveMerchantDemo();

  if (demo) {
    return (
      <MerchantPageShell>
        <MerchantPageHeader
          eyebrow="Outils · Communication"
          title="Solde marketing"
          subtitle="Rechargez votre solde prépayé et suivez son historique."
          backHref="/app/campagnes"
        />
        <SoldeMarketingPanel demo />
      </MerchantPageShell>
    );
  }

  if (!user) redirect("/app/connexion");
  const membership = firstActiveStaffMembership(user.merchantMemberships);
  if (!membership || !canManageMerchantSettings(membership.role)) redirect("/app");

  return (
    <MerchantPageShell>
      <MerchantPageHeader
        eyebrow="Outils · Communication"
        title="Solde marketing"
        subtitle="Rechargez votre solde prépayé et suivez son historique."
        backHref="/app/campagnes"
      />
      <SoldeMarketingPanel />
    </MerchantPageShell>
  );
}
