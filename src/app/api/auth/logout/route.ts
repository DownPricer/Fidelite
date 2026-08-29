import { requireMutatingRequest } from "@/lib/api-guard";
import { jsonOk } from "@/lib/http";
import { destroySession } from "@/lib/session";

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  await destroySession();
  return jsonOk({ ok: true });
}
