import { notFound } from "next/navigation";
import { isQaMagicLoginEnabled } from "@/lib/qa-login";
import { QaLoginClient } from "./qa-login-client";

export const dynamic = "force-dynamic";

export default function QaLoginPage() {
  if (!isQaMagicLoginEnabled()) notFound();
  return <QaLoginClient />;
}
