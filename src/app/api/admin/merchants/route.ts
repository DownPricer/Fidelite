import { jsonError } from "@/lib/http";

/** @deprecated Utiliser /api/super-admin/merchants — conservé pour éviter les appels silencieux. */
export async function GET() {
  return jsonError("Route obsolète. Utilisez /api/super-admin/merchants.", 410);
}

export async function POST() {
  return jsonError("Route obsolète. Utilisez /api/super-admin/merchants.", 410);
}
