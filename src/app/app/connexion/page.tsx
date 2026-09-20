import { StaffLogin } from "@/components/staff-login";
import { isGoogleSignInEnabled } from "@/lib/google-auth";

export default function AppLoginPage() {
  return (
    <StaffLogin
      title="Espace commerçant"
      nextPath="/app"
      demoHref="/demo"
      googleEnabled={isGoogleSignInEnabled()}
      googleReturnTo="/app"
      otherSpaces={[
        { label: "Client", href: "/connexion" },
        { label: "Employé", href: "/employe/connexion" },
        { label: "Démos", href: "/demo" },
      ]}
    />
  );
}
