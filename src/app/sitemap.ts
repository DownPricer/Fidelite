import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = env.customerOrigin.replace(/\/$/, "");
  return ["/", "/connexion", "/demo", "/confidentialite", "/conditions"].map((path) => ({
    url: `${origin}${path}`,
  }));
}
