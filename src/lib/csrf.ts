import { getAllowedOrigins } from "./env";

export function assertSameOrigin(req: Request) {
  const method = req.method.toUpperCase();
  if (["GET", "HEAD", "OPTIONS"].includes(method)) {
    return;
  }

  const origin = req.headers.get("origin");
  const allowed = getAllowedOrigins();
  if (origin) {
    const normalized = origin.replace(/\/$/, "");
    if (!allowed.includes(normalized)) {
      throw new CsrfError();
    }
    return;
  }

  const site = req.headers.get("sec-fetch-site");
  if (site === "same-origin" || site === "same-site" || site === "none") {
    return;
  }

  throw new CsrfError();
}

export class CsrfError extends Error {
  constructor() {
    super("Requête refusée.");
    this.name = "CsrfError";
  }
}
