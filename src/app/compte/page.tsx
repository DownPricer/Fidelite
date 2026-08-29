import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { AccountPanel } from "./ui";

export default async function AccountPage() {
  const user = await getSessionUser();
  if (!user) redirect("/connexion");
  return <AccountPanel firstName={user.firstName} email={user.email} />;
}
