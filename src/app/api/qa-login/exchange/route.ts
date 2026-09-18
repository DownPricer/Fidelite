import { requireMutatingRequest } from "@/lib/api-guard";
import { clientIp, readJson, userAgent } from "@/lib/http";
import { LIMITS, rateLimit } from "@/lib/rate-limit";
import { exchangeQaMagicLoginToken, isQaMagicLoginEnabled } from "@/lib/qa-login";

type QaExchangeBody = {
  token?: unknown;
};

function qaJson(data: Record<string, unknown>, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
    },
  });
}

function qaNotFound() {
  return new Response(null, {
    status: 404,
    headers: {
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
    },
  });
}

export async function POST(req: Request) {
  if (!isQaMagicLoginEnabled()) return qaNotFound();

  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return qaJson({ error: "Requête refusée." }, 403);

  const ip = clientIp(req);
  const limit = rateLimit(`qa-login:${ip}`, LIMITS.qaLoginExchange.limit, LIMITS.qaLoginExchange.windowMs);
  if (!limit.ok) return qaJson({ error: "Trop de tentatives. Réessayez plus tard." }, 429);

  const body = await readJson<QaExchangeBody>(req);
  const token = typeof body?.token === "string" ? body.token : undefined;
  const result = await exchangeQaMagicLoginToken(token, { ip, userAgent: userAgent(req) });

  if (!result.ok) {
    return qaJson({ error: "Lien QA invalide ou expiré." }, result.status);
  }

  return qaJson({ ok: true, redirectTo: result.redirectTo });
}

export async function GET() {
  return qaNotFound();
}
