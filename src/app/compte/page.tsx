import { redirect } from "next/navigation";
import { ProfilePage } from "@/components/fife-life/profile/profile-page";
import { PREVIEW_BENEFITS, PREVIEW_PROFILE_HISTORY } from "@/components/fife-life/preview-data";
import { demoProfileProps, isDevVisualDemo } from "@/lib/demo-visual";
import { getProfileUser, serializeProfile } from "@/lib/customer-profile";
import { getSessionUser } from "@/lib/session";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ demo?: string }>;
}) {
  const params = await searchParams;
  const user = await getSessionUser();

  if (!user) {
    if (isDevVisualDemo(params)) {
      const demo = demoProfileProps();
      return (
        <ProfilePage
          initialProfile={demo.profile}
          preview
          initialHistory={PREVIEW_PROFILE_HISTORY}
          initialBenefits={PREVIEW_BENEFITS}
        />
      );
    }
    redirect("/connexion");
  }

  const fullUser = await getProfileUser(user.id);
  if (!fullUser) redirect("/connexion");

  return <ProfilePage initialProfile={serializeProfile(fullUser)} />;
}
