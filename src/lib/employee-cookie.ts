import { env } from "./env";

export function employeeCookieName() {
  return env.employeeSessionCookie;
}

export function employeeTokenFromRequest(req: Request) {
  const cookie = req.headers.get("cookie") ?? "";
  const name = employeeCookieName();
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]+)`));
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

export function hasEmployeeCookie(req: Request) {
  return Boolean(employeeTokenFromRequest(req));
}
