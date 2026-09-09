import { jsonError } from "@/lib/http";

/** @deprecated Utiliser /api/super-admin/merchants/[id] */
export async function GET() {
  return jsonError("Route obsolète. Utilisez /api/super-admin/merchants/[id].", 410);
}

export async function PATCH() {
  return jsonError("Route obsolète. Utilisez /api/super-admin/merchants/[id].", 410);
}
