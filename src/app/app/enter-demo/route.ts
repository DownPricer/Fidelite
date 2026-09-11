import { redirect } from "next/navigation";
import { activateMerchantDemoCookie } from "@/lib/demo-session";
import { isPublicDemoEnabled } from "@/lib/demo-mode";

export async function GET() {
  if (!isPublicDemoEnabled()) {
    redirect("/app/connexion");
  }
  await activateMerchantDemoCookie();
  redirect("/app");
}
