import { readFile } from "fs/promises";
import { NextResponse } from "next/server";
import { requireMerchantAdmin, requireSuperAdmin } from "@/lib/api-guard";
import {
  fileUrlFromMediaPath,
  isGoogleWalletHeroFilename,
  isPublicGoogleWalletHeroMedia,
  isPublicTestBroadcastWalletHeroMedia,
} from "@/lib/ad-visual-public-access";
import { MIME_BY_EXT, adVisualFilePath, adVisualUrl } from "@/lib/ad-visuals";
import { prisma } from "@/lib/prisma";

/**
 * Fichiers de visuels de mises en avant (sources, originaux, versions du bandeau).
 * Accès : super-admin, ou administrateur du commerce propriétaire. Le public ne peut lire QUE le
 * fichier actuellement diffusé (finalImageUrl d'une mise en avant programmée/en cours, payée en
 * mode réel) — jamais une version en attente, une source ou un original.
 * `?telecharger=1` renvoie le fichier en pièce jointe (qualité complète).
 */
export async function GET(req: Request, context: { params: Promise<{ merchantId: string; filename: string }> }) {
  const { merchantId, filename } = await context.params;
  if (!/^[\w-]+$/.test(merchantId) || !/^[\w.-]+$/.test(filename) || filename.includes("..")) {
    return NextResponse.json({ error: "Fichier invalide." }, { status: 400 });
  }

  const superAdmin = await requireSuperAdmin(req);
  let privateAccess = !superAdmin.error;
  if (!privateAccess) {
    const merchant = await requireMerchantAdmin(req, merchantId);
    privateAccess = !merchant.error;
  }

  if (!privateAccess) {
    const fileUrl = adVisualUrl(merchantId, filename);
    const published = await prisma.adRequest.findFirst({
      where: {
        merchantId,
        finalImageUrl: fileUrl,
        status: { in: ["SCHEDULED", "LIVE"] },
        OR: [{ fundingMode: null }, { fundingMode: "LIVE" }],
      },
      select: { id: true },
    });
    let publicReadable = Boolean(published);
    if (!publicReadable) {
      const broadcast = await prisma.sponsoredAdTestBroadcast.findUnique({
        where: { id: "global" },
        include: {
          adRequest: {
            select: {
              merchantId: true,
              finalImageUrl: true,
              requestedImageUrl: true,
              versions: { orderBy: { number: "desc" }, take: 1, select: { url: true } },
            },
          },
        },
      });
      if (broadcast?.adRequest.merchantId === merchantId) {
        const { resolveAdTestBroadcastImageUrl } = await import("@/lib/sponsored-test-broadcast");
        const activeImage = resolveAdTestBroadcastImageUrl(broadcast.adRequest);
        if (activeImage === fileUrl) publicReadable = true;
      }
    }
    if (!publicReadable && isGoogleWalletHeroFilename(filename)) {
      const heroFileUrl = fileUrlFromMediaPath(merchantId, filename);
      publicReadable =
        (await isPublicTestBroadcastWalletHeroMedia(merchantId, heroFileUrl)) ||
        (await isPublicGoogleWalletHeroMedia(merchantId, heroFileUrl));
    }
    if (!publicReadable) return NextResponse.json({ error: "Fichier introuvable." }, { status: 404 });
  }

  try {
    const buffer = await readFile(adVisualFilePath(merchantId, filename));
    const ext = filename.split(".").pop()?.toLowerCase() ?? "";
    const download = new URL(req.url).searchParams.get("telecharger") === "1" && privateAccess;
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": MIME_BY_EXT[ext] ?? "application/octet-stream",
        "Cache-Control": privateAccess ? "private, no-store" : "public, max-age=300",
        "X-Content-Type-Options": "nosniff",
        ...(download ? { "Content-Disposition": `attachment; filename="fideto-${filename}"` } : {}),
      },
    });
  } catch {
    return NextResponse.json({ error: "Fichier introuvable." }, { status: 404 });
  }
}
