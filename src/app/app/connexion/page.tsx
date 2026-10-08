import { StaffLogin } from "@/components/staff-login";
import { isGoogleSignInEnabled } from "@/lib/google-auth";
import { publicCustomerUrl, publicEmployeeUrl } from "@/lib/hosts";
import { sanitizeMerchantNextPath } from "@/lib/merchant-auth-path";
import { isMerchantPlanId, MERCHANT_PLANS } from "@/lib/merchant-plans";

export default async function AppLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; next?: string }>;
}) {
  const params = await searchParams;
  const plan = isMerchantPlanId(params.plan) ? MERCHANT_PLANS[params.plan] : null;
  const nextPath = sanitizeMerchantNextPath(params.next);

  return (
    <StaffLogin
      title="Espace commerçant"
      nextPath={nextPath}
      demoHref={publicCustomerUrl("/demo")}
      googleEnabled={isGoogleSignInEnabled()}
      googleReturnTo={nextPath}
      selectedPlan={plan ? { id: plan.id, label: plan.name } : null}
      otherSpaces={[
        { label: "Client", href: publicCustomerUrl("/connexion") },
        { label: "Employé", href: publicEmployeeUrl("/employe/connexion") },
      ]}
    />
  );
}
