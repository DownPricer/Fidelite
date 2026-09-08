import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CLIENT_DEMO_COOKIE, isPublicDemoEnabled } from "@/lib/demo-mode";

export async function GET() {
  if (!isPublicDemoEnabled()) {
    redirect("/connexion");
  }
  const jar = await cookies();
  jar.set(CLIENT_DEMO_COOKIE, "1", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/carte?demo=1");
}
