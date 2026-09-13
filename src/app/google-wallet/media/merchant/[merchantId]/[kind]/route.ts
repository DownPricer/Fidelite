import { readFile, stat } from "fs/promises";
import { join, normalize } from "path";
import { getUploadsRoot } from "@/lib/media-storage";
import { parseGoogleWalletConfig } from "@/lib/google-wallet-appearance";
import { prisma } from "@/lib/prisma";

const KINDS = new Set(["hero", "logo", "wideLogo"]);

function contentTypeFor(path: string) {
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
  if (path.endsWith(".webp")) return "image/webp";
  return "application/octet-stream";
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ merchantId: string; kind: string }> },
) {
  const { merchantId, kind } = await context.params;
  if (!/^[\w-]+$/.test(merchantId) || !KINDS.has(kind)) {
    return new Response("Not found", { status: 404 });
  }

  const walletClass = await prisma.googleWalletClass.findUnique({
    where: { kind_merchantId: { kind: "MERCHANT", merchantId } },
    select: { configByMode: true },
  });
  const config = parseGoogleWalletConfig(walletClass?.configByMode);
  const url = config.publishedAppearance?.[kind === "wideLogo" ? "wideLogoUrl" : kind === "logo" ? "logoUrl" : "heroImageUrl"];
  if (!url) return new Response("Not found", { status: 404 });

  const marker = `/google-wallet/media/merchant/${merchantId}/${kind}`;
  if (!url.startsWith(marker)) return new Response("Not found", { status: 404 });

  const galleryItem = (config.mediaGallery ?? []).find((item) => item.kind === kind && item.publicUrl === url);
  if (!galleryItem || !galleryItem.path.startsWith(`google-wallet/merchant/${merchantId}/`)) {
    return new Response("Not found", { status: 404 });
  }

  const root = getUploadsRoot();
  const filepath = normalize(join(root, galleryItem.path));
  const allowedRoot = normalize(join(root, "google-wallet", "merchant", merchantId));
  if (!filepath.startsWith(allowedRoot)) return new Response("Not found", { status: 404 });

  try {
    const [buffer, info] = await Promise.all([readFile(filepath), stat(filepath)]);
    const etag = `"${galleryItem.version}-${info.size}"`;
    return new Response(buffer, {
      headers: {
        "Content-Type": galleryItem.mime || contentTypeFor(filepath),
        "Cache-Control": "public, max-age=31536000, immutable",
        ETag: etag,
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
