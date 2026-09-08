import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MERCHANT_DEMO_COOKIE, isPublicDemoEnabled } from "@/lib/demo-mode";

export async function GET() {
  if (!isPublicDemoEnabled()) {
    redirect("/app/connexion");
  }
  const jar = await cookies();
  jar.set(MERCHANT_DEMO_COOKIE, "1", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/app");
}
