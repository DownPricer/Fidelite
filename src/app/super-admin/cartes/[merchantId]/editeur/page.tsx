import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSuperAdminSessionUser } from "@/lib/super-admin-session";
import { CardEditorPage } from "./card-editor";

export default async function CardEditorRoute({
  params,
}: {
  params: Promise<{ merchantId: string }>;
}) {
  const user = await getSuperAdminSessionUser();
  if (!user) redirect("/super-admin/connexion");
  const { merchantId } = await params;
  return (
    <Suspense fallback={<p className="p-6 text-sm text-[var(--muted-text)]">Chargement de l’éditeur…</p>}>
      <CardEditorPage firstName={user.firstName} merchantId={merchantId} />
    </Suspense>
  );
}
