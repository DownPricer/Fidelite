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
  employeeOrigin: read("EMPLOYEE_ORIGIN", "https://employe-fidelite.sitereadyshd.fr"),
  employeeAppUrl: read("EMPLOYEE_APP_URL") || read("EMPLOYEE_ORIGIN", "https://employe-fidelite.sitereadyshd.fr"),
  extraOrigins: read("EXTRA_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000"),
  customerHost: read("CUSTOMER_HOST", "fidelite.sitereadyshd.fr"),
  appHost: read("APP_HOST", "app-fidelite.sitereadyshd.fr"),
  adminHost: read("ADMIN_HOST", "admin-fidelite.sitereadyshd.fr"),
  employeeHost: read("EMPLOYEE_HOST", "employe-fidelite.sitereadyshd.fr"),
  qrSecret: read("QR_SECRET", "dev-only-change-me-qr-secret-32chars"),
  qrTtlSeconds: Number(read("QR_TTL_SECONDS", "60")),
  sessionDays: Number(read("SESSION_DAYS", "30")),
  sessionCookie: read("SESSION_COOKIE_NAME", "fifelite_session"),
  employeeSessionCookie: read("EMPLOYEE_SESSION_COOKIE_NAME", "fifelite_employee_session"),
  superAdminPath: read("SUPER_ADMIN_PATH", "fife-super-admin-dev-only-change-me"),
  superAdminSessionCookie: read("SUPER_ADMIN_SESSION_COOKIE", "fifelite_super_admin_session"),
  superAdminSessionHours: Number(read("SUPER_ADMIN_SESSION_HOURS", "8")),
  superAdminAllowedEmails: read("SUPER_ADMIN_ALLOWED_EMAILS", ""),
  uploadsDir: read("UPLOADS_DIR", ""),
  invitationDays: Number(read("EMPLOYEE_INVITATION_DAYS", "7")),
  invitationHours: Number(read("EMPLOYEE_INVITATION_HOURS", "48")),
  publicDemoMode: read("PUBLIC_DEMO_MODE", "true") !== "false",
  mailFrom: read("MAIL_FROM"),
  resendApiKey: read("RESEND_API_KEY"),
  smtpHost: read("SMTP_HOST"),
  smtpPort: Number(read("SMTP_PORT", "587")),
  smtpSecure: read("SMTP_SECURE", "false") === "true",
  smtpUser: read("SMTP_USER"),
  smtpPass: read("SMTP_PASS"),
  // Nombre de points Fife Life attribués lorsqu'une récompense commerçant est validée.
  fifeLifePointsPerReward: Number(read("FIFE_LIFE_POINTS_PER_REWARD", "12")),
  googleWalletEnabled: read("GOOGLE_WALLET_ENABLED", "false") === "true",
  googleWalletIssuerId: read("GOOGLE_WALLET_ISSUER_ID"),
  googleWalletGlobalClassId: read("GOOGLE_WALLET_GLOBAL_CLASS_ID"),
  googleServiceAccountEmail:
    read("GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL") || read("GOOGLE_SERVICE_ACCOUNT_EMAIL"),
  googleWalletServiceAccountFile: read("GOOGLE_WALLET_SERVICE_ACCOUNT_FILE"),
  googleCloudProjectId: read("GOOGLE_CLOUD_PROJECT_ID"),
  googleWalletOrigin: read("GOOGLE_WALLET_ORIGIN") || read("CUSTOMER_ORIGIN", "https://fidelite.sitereadyshd.fr"),
  googleWalletOrigins: read("GOOGLE_WALLET_ORIGINS"),
};

export function isProduction() {
  return env.nodeEnv === "production";
}

export function getAllowedOrigins() {
  return [
    env.customerOrigin,
    env.appOrigin,
    env.adminOrigin,
    env.employeeOrigin,
    env.appUrl,
    ...env.extraOrigins.split(","),
  ]
    .map((value) => value.trim().replace(/\/$/, ""))
    .filter(Boolean);
}

export function isGoogleWalletConfigured() {
  return Boolean(
    env.googleWalletEnabled &&
      env.googleWalletIssuerId &&
      env.googleWalletGlobalClassId &&
      env.googleServiceAccountEmail &&
      env.googleWalletServiceAccountFile,
  );
}
