import { redirect } from "next/navigation";
import { FinalisationForm } from "./ui";
import { resolveCustomerAccessLevel } from "@/lib/customer-onboarding";
import { isSmsConfigured, smsConfigHint } from "@/lib/sms";
import { getSessionUser } from "@/lib/session";

export default async function FinalisationPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/connexion");

  const params = await searchParams;
  const access = resolveCustomerAccessLevel(user);

  return (
    <FinalisationForm
      initial={{
        firstName: user.firstName,
        lastName: user.lastName ?? "",
        email: user.email,
        emailConfirmed: Boolean(user.emailConfirmedAt),
        phoneVerified: user.phoneVerified,
        city: user.city ?? "",
        addressLine1: user.addressLine1 ?? "",
        addressLine2: user.addressLine2 ?? "",
        postalCode: user.postalCode ?? "",
        phone: user.phone ?? "",
        phoneCountryCode: user.phoneCountryCode ?? "+33",
      }}
      accessLevel={access}
      emailBanner={params.email ?? null}
      smsConfigured={isSmsConfigured()}
      smsConfigHint={smsConfigHint()}
    />
  );
}
