import { NextResponse, type NextRequest } from "next/server";
import { hasEmployeeCookie } from "./lib/employee-cookie";
import { MERCHANT_DEMO_COOKIE } from "./lib/demo-mode";
import { env } from "./lib/env";
import { isAdminHost, isAppHost, isEmployeeHost } from "./lib/hosts";
import { hasSuperAdminEntryCookie, SUPER_ADMIN_ENTRY_COOKIE, superAdminEntryCookieOptions } from "./lib/super-admin-entry";

function superAdminPublicPrefix() {
  const path = env.superAdminPath.replace(/^\/+|\/+$/g, "");
  return path ? `/${path}` : "";
}

const MERCHANT_BLOCKED_PREFIXES = [
  "/app",
  "/api/merchant",
  "/api/admin",
  "/api/super-admin",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/me",
  "/api/auth/change-password",
];

function hasMerchantDemoCookie(req: NextRequest) {
  if (!env.publicDemoMode) return false;
  return req.cookies.get(MERCHANT_DEMO_COOKIE)?.value === "1";
}

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const { pathname } = req.nextUrl;
  const employeeCookiePresent = hasEmployeeCookie(req);
  const merchantDemoActive = hasMerchantDemoCookie(req);

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/icons") ||
    pathname === "/sw.js" ||
    pathname === "/manifest.webmanifest" ||
    pathname === "/favicon.ico"
  ) {
    if (
      employeeCookiePresent &&
      !merchantDemoActive &&
      MERCHANT_BLOCKED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
    ) {
      if (pathname.startsWith("/api/caisse") || pathname.startsWith("/api/employe")) {
        return NextResponse.next();
      }
      return NextResponse.json({ error: "Accès administrateur refusé." }, { status: 403 });
    }
    return NextResponse.next();
  }

  if (employeeCookiePresent && !merchantDemoActive && pathname.startsWith("/app")) {
    const url = req.nextUrl.clone();
    url.pathname = "/employe/scan";
    return NextResponse.redirect(url);
  }

  if (isEmployeeHost(host)) {
    if (
      pathname.startsWith("/employe") ||
      pathname.startsWith("/api/employe") ||
      pathname.startsWith("/api/caisse") ||
      pathname.startsWith("/api/health")
    ) {
      return NextResponse.next();
    }
    const url = req.nextUrl.clone();
    url.pathname = pathname === "/" ? "/employe/scan" : `/employe${pathname}`;
    return NextResponse.rewrite(url);
  }

  const secretPrefix = superAdminPublicPrefix();
  if (secretPrefix && (pathname === secretPrefix || pathname.startsWith(`${secretPrefix}/`))) {
    const suffix = pathname.slice(secretPrefix.length) || "";
    const url = req.nextUrl.clone();
    url.pathname = `/super-admin${suffix || ""}`;
    const response = NextResponse.rewrite(url);
    response.headers.set("x-robots-tag", "noindex, nofollow");
    response.cookies.set(SUPER_ADMIN_ENTRY_COOKIE, "1", superAdminEntryCookieOptions(env.superAdminSessionHours * 3600));
    return response;
  }

  if (pathname.startsWith("/super-admin")) {
    if (!hasSuperAdminEntryCookie(req)) {
      return new NextResponse(null, { status: 404 });
    }
    const response = NextResponse.next();
    response.headers.set("x-robots-tag", "noindex, nofollow");
    return response;
  }

  if (isAdminHost(host) && !pathname.startsWith("/admin") && !pathname.startsWith("/super-admin")) {
    const url = req.nextUrl.clone();
    url.pathname = `/super-admin${pathname === "/" ? "" : pathname}`;
    const response = NextResponse.rewrite(url);
    response.headers.set("x-robots-tag", "noindex, nofollow");
    response.cookies.set(SUPER_ADMIN_ENTRY_COOKIE, "1", superAdminEntryCookieOptions(env.superAdminSessionHours * 3600));
    return response;
  }

  if (pathname.startsWith("/admin")) {
    if (!secretPrefix) {
      return new NextResponse(null, { status: 404 });
    }
    const url = req.nextUrl.clone();
    url.pathname = `${secretPrefix}${pathname.replace(/^\/admin/, "") || ""}`;
    return NextResponse.redirect(url);
  }

  if (isAppHost(host) && !pathname.startsWith("/app")) {
    const url = req.nextUrl.clone();
    url.pathname = `/app${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
