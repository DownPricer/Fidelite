import { Suspense } from "react";
import { EmployeeInvitationScreen } from "./ui";

export default function EmployeeInvitationPage() {
  return (
    <Suspense fallback={<main className="obsidian-scene flex min-h-dvh items-center justify-center">Chargement...</main>}>
      <EmployeeInvitationScreen />
    </Suspense>
  );
}
