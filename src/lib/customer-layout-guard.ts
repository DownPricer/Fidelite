import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { customerWalletGuardRedirect, runCustomerOnboardingSideEffects } from "./customer-onboarding";
import { getSessionUser } from "./session";

export async function enforceCustomerWalletAccess() {
  const user = await getSessionUser();
  if (!user) return null;

  await runCustomerOnboardingSideEffects(user.id);

  const pathname = (await headers()).get("x-pathname") ?? "";
  const target = customerWalletGuardRedirect(pathname || "/carte", user);
  if (target) redirect(target);

  return user;
}
