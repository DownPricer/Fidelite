import { redirect } from "next/navigation";
import { getSuperAdminSessionUser } from "@/lib/super-admin-session";
import { AdDetailPage } from "./ad-detail";

export default async function SuperAdminAdDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSuperAdminSessionUser();
  if (!user) redirect("/super-admin/connexion");
  return <AdDetailPage id={id} firstName={user.firstName} />;
}
