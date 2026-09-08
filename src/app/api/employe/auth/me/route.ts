import { requireEmployee } from "@/lib/api-guard";
import { jsonOk } from "@/lib/http";
import { resolvePermissions } from "@/lib/staff-permissions";

export async function GET(req: Request) {
  const auth = await requireEmployee(req);
  if (auth.error || !auth.user || !auth.membership) {
    return jsonOk({ user: null });
  }

  return jsonOk({
    user: {
      id: auth.user.id,
      firstName: auth.user.firstName,
      merchantId: auth.membership.merchantId,
      merchantName: auth.membership.merchant.name,
      merchantLogoUrl: auth.membership.merchant.logoUrl,
      permissions: resolvePermissions(auth.membership),
    },
  });
}
