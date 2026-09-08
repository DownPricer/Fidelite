import { StaffLogin } from "@/components/staff-login";

export default function AppLoginPage() {
  return (
    <StaffLogin
      title="Espace commerçant"
      nextPath="/app"
      demoHref="/demo"
      otherSpaces={[
        { label: "Client", href: "/connexion" },
        { label: "Employé", href: "/employe/connexion" },
        { label: "Démos", href: "/demo" },
      ]}
    />
  );
}
