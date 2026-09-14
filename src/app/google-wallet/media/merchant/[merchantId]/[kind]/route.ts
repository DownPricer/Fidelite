import { readFile, stat } from "fs/promises";
import { parseGoogleWalletConfig } from "@/lib/google-wallet-appearance";
import { resolvePublishedGoogleWalletMedia } from "@/lib/media-storage";
import { prisma } from "@/lib/prisma";

function notFound(reason: string) {
  console.warn("[google-wallet-media] 404", { reason });
  return new Response("Not found", { status: 404 });
}

export async function GET(
  req: Request,
  context: { params: Promise<{ merchantId: string; kind: string }> },
) {
  console.info("[google-wallet-media] requête reçue");
  const { merchantId, kind } = await context.params;
  const version = new URL(req.url).searchParams.get("v");

  const walletClass = await prisma.googleWalletClass.findUnique({
    where: { kind_merchantId: { kind: "MERCHANT", merchantId } },
    select: { configByMode: true },
  });
  if (!walletClass) return notFound("commerce absent");

  const config = parseGoogleWalletConfig(walletClass?.configByMode);
  const resolved = resolvePublishedGoogleWalletMedia({ merchantId, kind, version, config });
  if (!resolved.ok) return notFound(resolved.reason);
  console.info("[google-wallet-media] paramètres validés");
  console.info("[google-wallet-media] configuration publiée trouvée");
  console.info("[google-wallet-media] chemin résolu", { filepath: resolved.filepath });

  try {
    const [buffer, info] = await Promise.all([readFile(resolved.filepath), stat(resolved.filepath)]);
    console.info("[google-wallet-media] fichier trouvé");
    const etag = `"${resolved.version}-${info.size}"`;
    console.info("[google-wallet-media] réponse 200");
    return new Response(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
        ETag: etag,
      },
    });
  } catch {
    return notFound("fichier absent");
  }
}
