import { redirect } from "next/navigation";
import { getSuperAdminSessionUser } from "@/lib/super-admin-session";
import { CampaignModerationHome } from "./campaign-moderation-home";

export default async function SuperAdminCampagnesPage() {
  const user = await getSuperAdminSessionUser();
  if (!user) redirect("/super-admin/connexion");
  return <CampaignModerationHome firstName={user.firstName} />;
}
