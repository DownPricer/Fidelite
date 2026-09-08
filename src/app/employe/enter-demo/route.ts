import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { EMPLOYEE_DEMO_COOKIE } from "@/lib/employee-demo";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    redirect("/employe/connexion");
  }
  const jar = await cookies();
  jar.set(EMPLOYEE_DEMO_COOKIE, "1", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/employe/scan");
}
