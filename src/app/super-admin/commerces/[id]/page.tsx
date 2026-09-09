import { redirect } from "next/navigation";
import { getSuperAdminSessionUser } from "@/lib/super-admin-session";
import { MerchantDetailPage } from "./merchant-detail";

export default async function SuperAdminMerchantDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getSuperAdminSessionUser();
  if (!user) redirect("/super-admin/connexion");
  const { id } = await params;
  return <MerchantDetailPage firstName={user.firstName} merchantId={id} />;
}
