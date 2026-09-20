import { CustomerLoginForm } from "./ui";
import { isGoogleSignInEnabled } from "@/lib/google-auth";

export default async function CustomerLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ google?: string; returnTo?: string }>;
}) {
  const params = await searchParams;
  return (
    <CustomerLoginForm
      googleEnabled={isGoogleSignInEnabled()}
      googleStatus={params.google ?? null}
      returnTo={params.returnTo ?? null}
    />
  );
}
