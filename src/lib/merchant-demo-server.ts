import { cookies } from "next/headers";
import { isMerchantDemoCookie, isMerchantDevDemo } from "@/lib/merchant-demo";
import { getSessionUser } from "@/lib/session";

export async function resolveMerchantDemo() {
  const user = await getSessionUser();
  const jar = await cookies();
  const cookieDemo = isMerchantDemoCookie(jar.get("fife_merchant_demo")?.value);
  const demo = isMerchantDevDemo(user) || cookieDemo;
  return { user, demo };
}
