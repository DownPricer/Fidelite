import { cookies } from "next/headers";
import { CLIENT_DEMO_COOKIE, isDevVisualDemo } from "@/lib/demo-visual";

export async function isClientDemoPage(searchParams?: {
  demo?: string;
  sheet?: string;
  toast?: string;
}) {
  const jar = await cookies();
  return isDevVisualDemo(searchParams, jar.get(CLIENT_DEMO_COOKIE)?.value);
}
