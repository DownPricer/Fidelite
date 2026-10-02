import { StaffLogin } from "@/components/staff-login";
import { isGoogleSignInEnabled } from "@/lib/google-auth";
import { isMerchantPlanId, MERCHANT_PLANS } from "@/lib/merchant-plans";

export default async function AppLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const params = await searchParams;
  const plan = isMerchantPlanId(params.plan) ? MERCHANT_PLANS[params.plan] : null;

  return (
    <StaffLogin
      title="Espace commerçant"
      nextPath="/app"
      demoHref="/demo"
      googleEnabled={isGoogleSignInEnabled()}
      googleReturnTo="/app"
      selectedPlan={plan ? { id: plan.id, label: plan.name } : null}
      otherSpaces={[
        { label: "Client", href: "/connexion" },
        { label: "Employé", href: "/employe/connexion" },
      ]}
    />
  );
}
