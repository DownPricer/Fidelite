import { CustomerSignupForm } from "./ui";
import { isGoogleSignInEnabled } from "@/lib/google-auth";

export default function CustomerSignupPage() {
  return <CustomerSignupForm googleEnabled={isGoogleSignInEnabled()} />;
}
