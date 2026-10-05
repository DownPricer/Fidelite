import { redirect } from "next/navigation";
import { MerchantSignupAccountForm } from "./ui";
import { readMerchantSignupGrantCookie } from "@/lib/merchant-signup-grant";

export default async function CompteCommercantPage() {
  const grant = await readMerchantSignupGrantCookie();
  if (!grant) {
    redirect("/tarifs");
  }

  return <MerchantSignupAccountForm email={grant.email} />;
}
