const DEFAULT_CUSTOMER_REDIRECT = "/carte";

const ALLOWED_RETURN_PREFIXES = [
  "/carte",
  "/connexion",
  "/c/",
  "/rejoindre/",
  "/app",
  "/employe",
  "/demo",
];

export function sanitizeInternalReturnTo(value: string | null | undefined, fallback = DEFAULT_CUSTOMER_REDIRECT) {
  if (!value) return fallback;
  let decoded = value.trim();
  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    return fallback;
  }
  if (!decoded.startsWith("/") || decoded.startsWith("//") || decoded.includes("\\") || decoded.includes("\n")) {
    return fallback;
  }
  if (/^\/[a-z][a-z0-9+.-]*:/i.test(decoded)) return fallback;
  if (!ALLOWED_RETURN_PREFIXES.some((prefix) => decoded === prefix || decoded.startsWith(prefix))) {
    return fallback;
  }
  return decoded;
}

export function appendQuery(path: string, key: string, value: string) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
}
