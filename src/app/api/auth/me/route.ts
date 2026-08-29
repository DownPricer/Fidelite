import { jsonOk } from "@/lib/http";
import { getRequestUser } from "@/lib/session";

export async function GET(req: Request) {
  const user = await getRequestUser(req);
  if (!user) {
    return jsonOk({ user: null });
  }
  return jsonOk({
    user: {
      id: user.id,
      firstName: user.firstName,
      email: user.email,
      platformRole: user.platformRole,
      mustChangePassword: user.mustChangePassword,
      memberships: user.merchantMemberships.map((item) => ({
        merchantId: item.merchantId,
        role: item.role,
        merchantName: item.merchant.name,
        slug: item.merchant.slug,
      })),
    },
  });
}
