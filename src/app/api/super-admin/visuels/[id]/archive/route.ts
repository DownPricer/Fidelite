import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/api-guard";
import { buildZip, parseAdVisualUrl, readAdVisualFileByUrl } from "@/lib/ad-visuals";
import { jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";

/** Archive ZIP de toutes les images sources envoyées par le commerçant (qualité d'origine). */
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireSuperAdmin(req);
  if (auth.error || !auth.user) return auth.error ?? jsonError("Accès refusé.", 403);

  const { id } = await context.params;
  const images = await prisma.adRequestImage.findMany({ where: { adRequestId: id }, orderBy: { position: "asc" } });
  if (images.length === 0) return jsonError("Aucune image source pour cette demande.", 404);

  const files: { name: string; data: Buffer }[] = [];
  for (const [index, image] of images.entries()) {
    const data = await readAdVisualFileByUrl(image.url);
    if (!data) continue;
    const ext = parseAdVisualUrl(image.url)?.filename.split(".").pop() ?? "jpg";
    files.push({ name: `source-${index + 1}.${ext}`, data });
  }
  if (files.length === 0) return jsonError("Fichiers sources introuvables.", 404);

  return new NextResponse(new Uint8Array(buildZip(files)), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="fideto-sources-${id}.zip"`,
      "Cache-Control": "private, no-store",
    },
  });
}
