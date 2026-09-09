import { readFile } from "fs/promises";
import { NextResponse } from "next/server";
import { resolveMediaFilePath } from "@/lib/media-storage";

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export async function GET(
  _req: Request,
  context: { params: Promise<{ merchantId: string; filename: string }> },
) {
  const { merchantId, filename } = await context.params;
  if (!/^[\w.-]+$/.test(filename) || !/^[\w-]+$/.test(merchantId)) {
    return NextResponse.json({ error: "Fichier invalide." }, { status: 400 });
  }

  try {
    const filepath = resolveMediaFilePath("card-backgrounds", merchantId, filename);
    const buffer = await readFile(filepath);
    const ext = filename.split(".").pop()?.toLowerCase() ?? "png";
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": MIME[ext] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "Fichier introuvable." }, { status: 404 });
  }
}
