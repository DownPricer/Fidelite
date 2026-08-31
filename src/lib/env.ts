function read(name: string, fallback = "") {
  return process.env[name] ?? fallback;
}

export const env = {
  nodeEnv: read("NODE_ENV", "development"),
  appName: read("APP_NAME", "Fife Life"),
  appUrl: read("APP_URL", "http://localhost:3000"),
  customerOrigin: read("CUSTOMER_ORIGIN", "https://fidelite.sitereadyshd.fr"),
  appOrigin: read("APP_ORIGIN", "https://app-fidelite.sitereadyshd.fr"),
  adminOrigin: read("ADMIN_ORIGIN", "https://admin-fidelite.sitereadyshd.fr"),
  extraOrigins: read("EXTRA_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000"),
  customerHost: read("CUSTOMER_HOST", "fidelite.sitereadyshd.fr"),
  appHost: read("APP_HOST", "app-fidelite.sitereadyshd.fr"),
  adminHost: read("ADMIN_HOST", "admin-fidelite.sitereadyshd.fr"),
  qrSecret: read("QR_SECRET", "dev-only-change-me-qr-secret-32chars"),
  qrTtlSeconds: Number(read("QR_TTL_SECONDS", "60")),
  sessionDays: Number(read("SESSION_DAYS", "30")),
  sessionCookie: read("SESSION_COOKIE_NAME", "fifelite_session"),
  // Nombre de points Fife Life attribués lorsqu'une récompense commerçant est validée.
  fifeLifePointsPerReward: Number(read("FIFE_LIFE_POINTS_PER_REWARD", "12")),
  googleWalletIssuerId: read("GOOGLE_WALLET_ISSUER_ID"),
  googleServiceAccountEmail: read("GOOGLE_SERVICE_ACCOUNT_EMAIL"),
  googleServiceAccountPrivateKey: read("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY"),
  googleCloudProjectId: read("GOOGLE_CLOUD_PROJECT_ID"),
  googleWalletOrigins: read("GOOGLE_WALLET_ORIGINS"),
  googleWalletClassPrefix: read("GOOGLE_WALLET_CLASS_PREFIX"),
};

export function isProduction() {
  return env.nodeEnv === "production";
}

export function getAllowedOrigins() {
  return [
    env.customerOrigin,
    env.appOrigin,
    env.adminOrigin,
    env.appUrl,
    ...env.extraOrigins.split(","),
  ]
    .map((value) => value.trim().replace(/\/$/, ""))
    .filter(Boolean);
}

export function isGoogleWalletConfigured() {
  return Boolean(
    env.googleWalletIssuerId &&
      env.googleServiceAccountEmail &&
      env.googleServiceAccountPrivateKey,
  );
}
