import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { resolvePwaManifestForHost } from "@/lib/pwa-manifests";

export async function GET() {
  const host = (await headers()).get("host");
  const manifest = resolvePwaManifestForHost(host);
  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
