import { env, isProduction } from "./env";

export type EmailSendResult = { ok: true } | { ok: false; error: string };

export type EmployeeInvitationEmailInput = {
  to: string;
  firstName: string;
  merchantName: string;
  invitationUrl: string;
  expiresAt: Date;
  message?: string | null;
};

function mailFrom() {
  return env.mailFrom || `Fideto <noreply@${new URL(env.employeeAppUrl).hostname}>`;
}

export function isEmailConfigured() {
  if (env.resendApiKey) return true;
  if (env.smtpHost && env.smtpUser && env.smtpPass) return true;
  return false;
}

export function emailConfigHint() {
  if (isEmailConfigured()) return null;
  return "Configurez RESEND_API_KEY ou SMTP_HOST, SMTP_USER, SMTP_PASS et MAIL_FROM pour envoyer les invitations.";
}

async function sendViaResend(input: { to: string; subject: string; html: string; text: string }) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: mailFrom(),
      to: [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    return { ok: false as const, error: `Resend a refusé l'envoi (${response.status})${body ? `: ${body.slice(0, 200)}` : ""}.` };
  }

  return { ok: true as const };
}

async function sendViaSmtp(input: { to: string; subject: string; html: string; text: string }) {
  const nodemailer = await import("nodemailer");
  const transport = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  });

  try {
    await transport.sendMail({
      from: mailFrom(),
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    });
    return { ok: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur SMTP inconnue.";
    return { ok: false as const, error: message };
  }
}

function formatExpiry(expiresAt: Date) {
  return expiresAt.toLocaleString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildInvitationContent(input: EmployeeInvitationEmailInput) {
  const subject = `${input.merchantName} — Activez votre accès employé`;
  const expiry = formatExpiry(input.expiresAt);
  const intro = input.message?.trim()
    ? `<p style="margin:0 0 16px;font-size:15px;line-height:1.5;color:#334155;">${escapeHtml(input.message)}</p>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="fr">
<body style="margin:0;padding:0;background:#0b0f19;font-family:Segoe UI,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0b0f19;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:16px;padding:32px;">
        <tr><td>
          <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#94a3b8;">Fideto Employé</p>
          <h1 style="margin:0 0 16px;font-size:24px;color:#f8fafc;">Bonjour ${escapeHtml(input.firstName)},</h1>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.5;color:#cbd5e1;">
            <strong style="color:#f8fafc;">${escapeHtml(input.merchantName)}</strong> vous invite à rejoindre son équipe sur l'application employé Fideto.
          </p>
          ${intro}
          <p style="margin:0 0 24px;font-size:15px;line-height:1.5;color:#cbd5e1;">
            Cliquez sur le bouton ci-dessous pour définir votre mot de passe et activer votre compte.
          </p>
          <p style="margin:0 0 24px;text-align:center;">
            <a href="${input.invitationUrl}" style="display:inline-block;padding:14px 24px;border-radius:999px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-weight:700;text-decoration:none;font-size:15px;">
              Activer mon compte employé
            </a>
          </p>
          <p style="margin:0 0 8px;font-size:13px;line-height:1.5;color:#94a3b8;">
            Ce lien expire le <strong style="color:#e2e8f0;">${escapeHtml(expiry)}</strong>.
          </p>
          <p style="margin:0;font-size:12px;line-height:1.5;color:#64748b;word-break:break-all;">
            Si le bouton ne fonctionne pas, copiez ce lien : ${input.invitationUrl}
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = [
    `Bonjour ${input.firstName},`,
    "",
    `${input.merchantName} vous invite à rejoindre son équipe sur Fideto Employé.`,
    input.message?.trim() ? `\n${input.message.trim()}\n` : "",
    "Activez votre compte :",
    input.invitationUrl,
    "",
    `Ce lien expire le ${expiry}.`,
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, html, text };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function sendEmployeeInvitationEmail(input: EmployeeInvitationEmailInput): Promise<EmailSendResult> {
  if (!isEmailConfigured()) {
    return { ok: false, error: emailConfigHint() ?? "Service e-mail non configuré." };
  }

  const content = buildInvitationContent(input);

  if (env.resendApiKey) {
    return sendViaResend({ to: input.to, ...content });
  }

  return sendViaSmtp({ to: input.to, ...content });
}

export function canExposeInvitationLinkInAdmin() {
  return !isProduction() || env.publicDemoMode;
}

// ───────────────────────── E-mails de campagne (Partie 10) ─────────────────────────

export type CampaignEmailInput = {
  to: string;
  merchantName: string;
  merchantLogoUrl?: string | null;
  merchantAddress?: string | null;
  imageUrl?: string | null;
  subject: string;
  title: string;
  message: string;
  actionLabel?: string | null;
  actionUrl?: string | null;
  /** Explique pourquoi la personne reçoit ce message (Partie 10 — obligatoire). */
  reasonLabel: string;
  unsubscribeUrl: string;
  preferencesUrl: string;
};

function buildCampaignEmailContent(input: CampaignEmailInput) {
  const logo = input.merchantLogoUrl
    ? `<img src="${escapeHtml(input.merchantLogoUrl)}" alt="${escapeHtml(input.merchantName)}" width="40" height="40" style="border-radius:10px;object-fit:cover;vertical-align:middle;" />`
    : "";
  const image = input.imageUrl
    ? `<tr><td style="padding:0 0 16px;"><img src="${escapeHtml(input.imageUrl)}" alt="" width="100%" style="border-radius:12px;display:block;max-width:100%;" /></td></tr>`
    : "";
  const action =
    input.actionLabel && input.actionUrl
      ? `<p style="margin:0 0 24px;text-align:center;">
          <a href="${escapeHtml(input.actionUrl)}" style="display:inline-block;padding:14px 24px;border-radius:999px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-weight:700;text-decoration:none;font-size:15px;">
            ${escapeHtml(input.actionLabel)}
          </a>
        </p>`
      : "";

  const html = `<!DOCTYPE html>
<html lang="fr">
<body style="margin:0;padding:0;background:#0b0f19;font-family:Segoe UI,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0b0f19;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:16px;padding:32px;">
        <tr><td>
          <p style="margin:0 0 16px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#94a3b8;">
            ${logo} <span style="vertical-align:middle;margin-left:8px;">Fideto · ${escapeHtml(input.merchantName)}</span>
          </p>
        </td></tr>
        ${image}
        <tr><td>
          <h1 style="margin:0 0 16px;font-size:22px;color:#f8fafc;">${escapeHtml(input.title)}</h1>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#cbd5e1;white-space:pre-line;">${escapeHtml(input.message)}</p>
          ${action}
          <p style="margin:0 0 8px;font-size:12px;line-height:1.5;color:#64748b;">${escapeHtml(input.reasonLabel)}</p>
          ${input.merchantAddress ? `<p style="margin:0 0 16px;font-size:11px;color:#475569;">${escapeHtml(input.merchantAddress)}</p>` : ""}
          <p style="margin:16px 0 0;font-size:11px;color:#475569;">
            <a href="${escapeHtml(input.preferencesUrl)}" style="color:#94a3b8;">Gérer mes préférences</a>
            &nbsp;·&nbsp;
            <a href="${escapeHtml(input.unsubscribeUrl)}" style="color:#94a3b8;">Se désinscrire</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = [
    `Fideto · ${input.merchantName}`,
    "",
    input.title,
    "",
    input.message,
    "",
    input.actionLabel && input.actionUrl ? `${input.actionLabel} : ${input.actionUrl}` : "",
    "",
    input.reasonLabel,
    `Préférences : ${input.preferencesUrl}`,
    `Se désinscrire : ${input.unsubscribeUrl}`,
  ]
    .filter(Boolean)
    .join("\n");

  return { subject: input.subject, html, text };
}

export async function sendCampaignEmail(input: CampaignEmailInput): Promise<EmailSendResult> {
  if (!isEmailConfigured()) {
    return { ok: false, error: emailConfigHint() ?? "Service e-mail non configuré." };
  }

  const content = buildCampaignEmailContent(input);

  if (env.resendApiKey) {
    return sendViaResend({ to: input.to, ...content });
  }

  return sendViaSmtp({ to: input.to, ...content });
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmailAddress(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}
