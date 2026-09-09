import { redirect } from "next/navigation";
import { getSuperAdminSessionUser } from "@/lib/super-admin-session";
import { CardsIndexPage } from "./cards-index";

export default async function SuperAdminCardsPage() {
  const user = await getSuperAdminSessionUser();
  if (!user) redirect("/super-admin/connexion");
  return <CardsIndexPage firstName={user.firstName} />;
}
