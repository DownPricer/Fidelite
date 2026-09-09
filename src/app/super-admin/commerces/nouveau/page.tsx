import { redirect } from "next/navigation";
import { getSuperAdminSessionUser } from "@/lib/super-admin-session";
import { CreateMerchantWizard } from "./wizard";

export default async function CreateMerchantPage() {
  const user = await getSuperAdminSessionUser();
  if (!user) redirect("/super-admin/connexion");
  return <CreateMerchantWizard firstName={user.firstName} />;
}
