import { NextResponse, type NextRequest } from "next/server";
import { hasEmployeeCookie } from "./lib/employee-cookie";
import { isAdminHost, isAppHost, isEmployeeHost } from "./lib/hosts";

const MERCHANT_BLOCKED_PREFIXES = [
  "/app",
  "/api/merchant",
  "/api/admin",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/me",
  "/api/auth/change-password",
];

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const { pathname } = req.nextUrl;
  const employeeCookiePresent = hasEmployeeCookie(req);

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/icons") ||
    pathname === "/sw.js" ||
    pathname === "/manifest.webmanifest" ||
    pathname === "/favicon.ico"
  ) {
    if (employeeCookiePresent && MERCHANT_BLOCKED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
      if (pathname.startsWith("/api/caisse") || pathname.startsWith("/api/employe")) {
        return NextResponse.next();
      }
      return NextResponse.json({ error: "Accès administrateur refusé." }, { status: 403 });
    }
    return NextResponse.next();
  }

  if (employeeCookiePresent && pathname.startsWith("/app")) {
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

  if (isAdminHost(host) && !pathname.startsWith("/admin")) {
    const url = req.nextUrl.clone();
    url.pathname = `/admin${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
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
