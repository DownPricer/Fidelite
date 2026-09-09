import { requireSuperAdmin } from "@/lib/api-guard";
import { jsonOk } from "@/lib/http";

export async function GET(req: Request) {
  const admin = await requireSuperAdmin(req);
  if (admin.error || !admin.user) return admin.error!;
  return jsonOk({
    user: {
      id: admin.user.id,
      firstName: admin.user.firstName,
      lastName: admin.user.lastName,
      email: admin.user.email,
    },
  });
}
