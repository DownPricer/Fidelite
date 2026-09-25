import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  const origin = env.customerOrigin.replace(/\/$/, "");
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/app/", "/compte/", "/employe/", "/super-admin/", "/admin/"] }],
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}
