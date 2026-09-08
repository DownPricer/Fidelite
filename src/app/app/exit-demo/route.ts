import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MERCHANT_DEMO_COOKIE } from "@/lib/demo-mode";

export async function GET() {
  const jar = await cookies();
  jar.delete(MERCHANT_DEMO_COOKIE);
  redirect("/demo");
}
