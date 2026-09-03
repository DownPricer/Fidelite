import { StaffLogin } from "@/components/staff-login";

export default function AppLoginPage() {
  return (
    <StaffLogin
      title="Espace commerçant"
      nextPath="/app"
      demoHref={process.env.NODE_ENV === "development" ? "/app/enter-demo" : undefined}
    />
  );
}
