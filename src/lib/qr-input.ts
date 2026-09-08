import { env } from "./env";

const JWT_PATTERN = /^eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

const ALLOWED_QR_HOSTS = new Set(
  [
    env.customerHost,
    env.appHost,
    env.employeeHost,
    "localhost",
    "127.0.0.1",
    new URL(env.customerOrigin).hostname,
    new URL(env.appOrigin).hostname,
    new URL(env.employeeOrigin).hostname,
  ]
    .map((value) => value.toLowerCase())
    .filter(Boolean),
);

export class QrInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QrInputError";
  }
}

function extractJwtFromText(text: string) {
  const match = text.match(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/);
  return match?.[0] ?? null;
}

export function extractFifeLifeQrToken(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new QrInputError("Collez un lien ou un code QR Fife Life.");
  }

  if (JWT_PATTERN.test(trimmed)) {
    return trimmed;
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    const embedded = extractJwtFromText(trimmed);
    if (embedded) return embedded;
    throw new QrInputError("Ce lien n'est pas un QR Fife Life valide.");
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new QrInputError("Format de lien non autorisé.");
  }

  const host = parsed.hostname.toLowerCase();
  if (!ALLOWED_QR_HOSTS.has(host)) {
    throw new QrInputError("Domaine non autorisé pour un QR Fife Life.");
  }

  const fromQuery =
    parsed.searchParams.get("token") ??
    parsed.searchParams.get("qr") ??
    parsed.searchParams.get("t");
  if (fromQuery) {
    const token = fromQuery.trim();
    if (JWT_PATTERN.test(token)) {
      return token;
    }
    const embedded = extractJwtFromText(token);
    if (embedded) return embedded;
  }

  const pathToken = extractJwtFromText(parsed.pathname);
  if (pathToken) {
    return pathToken;
  }

  const embedded = extractJwtFromText(trimmed);
  if (embedded) {
    return embedded;
  }

  throw new QrInputError("Impossible d'extraire un QR Fife Life depuis ce lien.");
}
