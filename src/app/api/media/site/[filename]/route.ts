import { open } from "fs/promises";
import { NextResponse } from "next/server";
import { isAllowedSiteMediaFile, resolveSiteMediaFilePath } from "@/lib/site-media";

const MIME: Record<string, string> = {
  mp4: "video/mp4",
  webvtt: "text/vtt",
  vtt: "text/vtt",
};

async function serveFile(filepath: string, request: Request) {
  const file = await open(filepath, "r");
  const stat = await file.stat();
  const size = stat.size;
  const ext = filepath.split(".").pop()?.toLowerCase() ?? "";
  const contentType = MIME[ext] ?? "application/octet-stream";
  const range = request.headers.get("range");

  if (range) {
    const match = /^bytes=(\d+)-(\d*)$/.exec(range);
    if (!match) {
      await file.close();
      return NextResponse.json({ error: "Plage invalide." }, { status: 416 });
    }
    const start = Number(match[1]);
    const end = match[2] ? Number(match[2]) : size - 1;
    if (start >= size || end >= size || start > end) {
      await file.close();
      return new NextResponse(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${size}` },
      });
    }
    const chunkLength = end - start + 1;
    const buffer = Buffer.alloc(chunkLength);
    await file.read(buffer, 0, chunkLength, start);
    await file.close();
    return new NextResponse(buffer, {
      status: 206,
      headers: {
        "Accept-Ranges": "bytes",
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Content-Length": String(chunkLength),
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  const buffer = Buffer.alloc(size);
  await file.read(buffer, 0, size, 0);
  await file.close();
  return new NextResponse(buffer, {
    headers: {
      "Accept-Ranges": "bytes",
      "Content-Length": String(size),
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

export async function GET(
  request: Request,
  context: { params: Promise<{ filename: string }> },
) {
  const { filename } = await context.params;
  if (!/^[\w.-]+$/.test(filename) || !isAllowedSiteMediaFile(filename)) {
    return NextResponse.json({ error: "Fichier invalide." }, { status: 400 });
  }

  try {
    const filepath = resolveSiteMediaFilePath(filename);
    return await serveFile(filepath, request);
  } catch {
    return NextResponse.json({ error: "Fichier introuvable." }, { status: 404 });
  }
}
