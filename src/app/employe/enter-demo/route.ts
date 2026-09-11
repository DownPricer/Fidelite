import { redirect } from "next/navigation";
import { activateEmployeeDemoCookie } from "@/lib/demo-session";
import { isPublicDemoEnabled } from "@/lib/demo-mode";

export async function GET() {
  if (!isPublicDemoEnabled()) {
    redirect("/employe/connexion");
  }
  await activateEmployeeDemoCookie();
  redirect("/employe/scan");
}
