import { requireMutatingRequest, requireSuperAdmin } from "@/lib/api-guard";
import { jsonError, jsonOk, readJson } from "@/lib/http";
import { saveCardBackground } from "@/lib/media-storage";
import { z } from "zod";

const schema = z.object({
  merchantId: z.string().min(1),
  dataUrl: z.string().min(30).max(7_000_000),
});

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const admin = await requireSuperAdmin(req);
  if (admin.error) return admin.error;

  const parsed = schema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError("Données invalides.");

  try {
    const url = await saveCardBackground(parsed.data.merchantId, parsed.data.dataUrl);
    return jsonOk({ url });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Upload impossible.", 400);
  }
}
