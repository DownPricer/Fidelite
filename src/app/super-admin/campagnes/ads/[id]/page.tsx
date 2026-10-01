import { redirect } from "next/navigation";

/** Ancienne adresse (segment « ads » filtré par les bloqueurs de publicités) : redirige vers la fiche neutre. */
export default async function LegacyAdDetailRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/super-admin/campagnes/fiche/${id}`);
}
