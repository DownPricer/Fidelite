import { env } from "./env";
import { emailConfigHint, isEmailConfigured, isValidEmailAddress } from "./email";
import type { EmailSendResult } from "./email";

export function getConfiguredSupportEmail() {
  const email = env.supportEmail.trim().toLowerCase();
  if (!email || !isValidEmailAddress(email)) return null;
  return email;
}

export function supportEmailConfigHint() {
  if (!getConfiguredSupportEmail()) {
    return "Définissez SUPPORT_EMAIL (adresse de réception du support, ex. support@fideto.fr).";
  }
  if (!isEmailConfigured()) {
    return emailConfigHint();
  }
  return null;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function sendPublicContactEmail(input: {
  name: string;
  email: string;
  message: string;
}): Promise<EmailSendResult> {
  const to = getConfiguredSupportEmail();
  if (!to) {
    return { ok: false, error: supportEmailConfigHint() ?? "Adresse de support non configurée." };
  }
  if (!isEmailConfigured()) {
    return { ok: false, error: emailConfigHint() ?? "Service e-mail non configuré." };
  }

  const subject = `Fideto — message de ${input.name}`;
  const html = `<!DOCTYPE html><html lang="fr"><body style="font-family:Segoe UI,sans-serif;line-height:1.6;color:#0f172a;">
<p><strong>Nom :</strong> ${escapeHtml(input.name)}</p>
<p><strong>E-mail :</strong> ${escapeHtml(input.email)}</p>
<p><strong>Message :</strong></p>
<p style="white-space:pre-wrap;">${escapeHtml(input.message)}</p>
</body></html>`;
  const text = [`Nom : ${input.name}`, `E-mail : ${input.email}`, "", input.message].join("\n");

  if (env.resendApiKey) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.mailFrom || `Fideto <noreply@${new URL(env.customerOrigin).hostname}>`,
        to: [to],
        reply_to: input.email,
        subject,
        html,
        text,
      }),
    });
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      return {
        ok: false,
        error: `Resend a refusé l'envoi (${response.status})${body ? `: ${body.slice(0, 200)}` : ""}.`,
      };
    }
    return { ok: true };
  }

  const nodemailer = await import("nodemailer");
  const transport = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    auth: { user: env.smtpUser, pass: env.smtpPass },
  });
  try {
    await transport.sendMail({
      from: env.mailFrom || `Fideto <noreply@${new URL(env.customerOrigin).hostname}>`,
      to,
      replyTo: input.email,
      subject,
      html,
      text,
    });
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur SMTP inconnue.";
    return { ok: false, error: message };
  }
}
