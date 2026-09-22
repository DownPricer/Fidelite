import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { NotificationsCenter } from "@/components/fife-life/notifications-center";

export const dynamic = "force-dynamic";

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ demo?: string }>;
}) {
  const params = await searchParams;
  const user = await getSessionUser();

  if (!user) {
    if (params.demo === "1") return <NotificationsCenter demo />;
    redirect("/connexion");
  }

  return <NotificationsCenter />;
}
