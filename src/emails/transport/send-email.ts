import { env } from "@/lib/env";
import { customerOriginForPublicLinks } from "@/lib/hosts";
import { emailConfigHint, isEmailConfigured, type EmailSendResult } from "@/lib/email";

export function defaultMailFrom() {
  return env.mailFrom || `Fideto <noreply@${new URL(customerOriginForPublicLinks()).hostname}>`;
}

export async function deliverEmail(input: {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<EmailSendResult> {
  if (!isEmailConfigured()) {
    return { ok: false, error: emailConfigHint() ?? "Service e-mail non configuré." };
  }
  const to = Array.isArray(input.to) ? input.to : [input.to];
  if (env.resendApiKey) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.resendApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: defaultMailFrom(),
        to,
        subject: input.subject,
        html: input.html,
        text: input.text,
        reply_to: input.replyTo,
      }),
    });
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      return { ok: false, error: `Envoi refusé (${response.status})${body ? `: ${body.slice(0, 120)}` : ""}.` };
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
      from: defaultMailFrom(),
      to,
      replyTo: input.replyTo,
      subject: input.subject,
      html: input.html,
      text: input.text,
    });
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Erreur SMTP." };
  }
}
