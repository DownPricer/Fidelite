import { redirect } from "next/navigation";
import { SettingsPage } from "@/components/fife-life/profile/settings-page";
import { demoProfileProps, isDevVisualDemo } from "@/lib/demo-visual";
import {
  ensureCustomerPreferences,
  getProfileUser,
  serializePreferences,
  serializeProfile,
} from "@/lib/customer-profile";
import { getSessionUser } from "@/lib/session";

export default async function ParametresPage({
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
        <SettingsPage
          initialProfile={demo.profile}
          initialPreferences={demo.preferences}
          preview
        />
      );
    }
    redirect("/connexion");
  }

  const fullUser = await getProfileUser(user.id);
  if (!fullUser) redirect("/connexion");

  let preferences;
  try {
    preferences = fullUser.preferences ?? (await ensureCustomerPreferences(fullUser.id));
  } catch (error) {
    console.error("[compte/parametres] preferences", error);
    throw new Error(
      "La table de préférences est absente. Exécutez npm run db:migrate pour activer les paramètres.",
    );
  }

  return (
    <SettingsPage
      initialProfile={serializeProfile(fullUser)}
      initialPreferences={serializePreferences(preferences)}
    />
  );
}
