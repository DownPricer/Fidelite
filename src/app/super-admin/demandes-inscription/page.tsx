import { redirect } from "next/navigation";
import { getSuperAdminSessionUser } from "@/lib/super-admin-session";
import { SignupRequestsHome } from "./signup-requests-home";

export default async function SignupRequestsPage() {
  const user = await getSuperAdminSessionUser();
  if (!user) redirect("/super-admin/connexion");
  return <SignupRequestsHome firstName={user.firstName} />;
}
