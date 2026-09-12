import { POST as merchantGoogleWalletPost } from "@/app/api/customer/google-wallet/merchant/[slug]/route";
import { jsonError, readJson } from "@/lib/http";
import { z } from "zod";

const schema = z.object({ slug: z.string().min(1) });

export async function POST(req: Request) {
  const parsed = schema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError("Commerce manquant.");
  return merchantGoogleWalletPost(req, { params: Promise.resolve({ slug: parsed.data.slug }) });
}
