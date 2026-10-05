import { redirect } from "next/navigation";
import { getSuperAdminSessionUser } from "@/lib/super-admin-session";
import { SignupRequestDetail } from "../signup-request-detail";

export default async function SignupRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSuperAdminSessionUser();
  if (!user) redirect(`/super-admin/connexion?next=${encodeURIComponent(`/super-admin/demandes-inscription/${id}`)}`);
  return <SignupRequestDetail firstName={user.firstName} requestId={id} />;
}
