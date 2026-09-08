import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { EMPLOYEE_DEMO_COOKIE } from "@/lib/employee-demo";

export async function GET() {
  const jar = await cookies();
  jar.delete(EMPLOYEE_DEMO_COOKIE);
  redirect("/employe/connexion");
}
