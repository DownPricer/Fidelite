import { NextResponse } from "next/server";
import { createGoogleAuthUrl } from "@/lib/google-auth";
import { sanitizeInternalReturnTo } from "@/lib/oauth-redirect";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug")?.trim() || undefined;
  const flow = url.searchParams.get("flow") === "register" ? "register" : "login";
  const privacyConsent = url.searchParams.get("privacyConsent") === "true";
  const origin = url.origin;
  const fallback = slug ? `/carte/${slug}` : "/carte";
  const returnTo = sanitizeInternalReturnTo(url.searchParams.get("returnTo"), fallback);

  const result = await createGoogleAuthUrl(origin, {
    flow,
    slug,
    returnTo,
    privacyConsent,
  });

  if (!result.ok) {
    const target = new URL(slug ? `/rejoindre/${slug}` : "/connexion", origin);
    target.searchParams.set("google", result.reason);
    return NextResponse.redirect(target);
  }

  return NextResponse.redirect(result.url);
}
