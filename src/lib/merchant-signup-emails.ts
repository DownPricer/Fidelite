import { env } from "./env";
import { emailConfigHint, isEmailConfigured, isValidEmailAddress } from "./email";
import type { EmailSendResult } from "./email";
import { publicAppUrl, customerOriginForPublicLinks } from "./hosts";
import { isSuperAdminEmailAllowed } from "./super-admin-session";
import { prisma } from "./prisma";
import { formatEurosFromCents, MERCHANT_PLANS, type MerchantPlanId } from "./merchant-plans";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function mailFrom() {
  return env.mailFrom || `Fideto <noreply@${new URL(customerOriginForPublicLinks()).hostname}>`;
}

async function sendEmail(input: { to: string | string[]; subject: string; html: string; text: string }) {
  if (!isEmailConfigured()) {
    return { ok: false as const, error: emailConfigHint() ?? "Service e-mail non configuré." };
  }
  const to = Array.isArray(input.to) ? input.to : [input.to];
  if (env.resendApiKey) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.resendApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: mailFrom(), to, subject: input.subject, html: input.html, text: input.text }),
    });
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      return { ok: false as const, error: `Envoi refusé (${response.status})${body ? `: ${body.slice(0, 120)}` : ""}.` };
    }
    return { ok: true as const };
  }
  const nodemailer = await import("nodemailer");
  const transport = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    auth: { user: env.smtpUser, pass: env.smtpPass },
  });
  try {
    await transport.sendMail({ from: mailFrom(), to, subject: input.subject, html: input.html, text: input.text });
    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, error: error instanceof Error ? error.message : "Erreur SMTP." };
  }
}

function violetTemplate(title: string, bodyHtml: string) {
  return `<!DOCTYPE html><html lang="fr"><body style="margin:0;padding:0;background:#0b0f19;font-family:Segoe UI,sans-serif;">
<table role="presentation" width="100%" style="background:#0b0f19;padding:32px 16px;"><tr><td align="center">
<table role="presentation" width="100%" style="max-width:520px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:16px;padding:32px;">
<tr><td><h1 style="margin:0 0 16px;font-size:22px;color:#f8fafc;">${escapeHtml(title)}</h1>${bodyHtml}</td></tr>
</table></td></tr></table></body></html>`;
}

export async function sendMerchantSignupAckEmail(input: {
  to: string;
  firstName: string;
  businessName: string;
  planId: MerchantPlanId;
}): Promise<EmailSendResult> {
  const plan = MERCHANT_PLANS[input.planId];
  const body = `<p style="color:#cbd5e1;line-height:1.6;">Bonjour ${escapeHtml(input.firstName)},</p>
<p style="color:#cbd5e1;line-height:1.6;">Nous avons bien reçu votre demande d'accès à Fideto pour <strong style="color:#f8fafc;">${escapeHtml(input.businessName)}</strong> (formule ${escapeHtml(plan.name)}).</p>
<p style="color:#cbd5e1;line-height:1.6;">Un conseiller étudiera votre dossier et vous recontactera rapidement. Aucun paiement n'est demandé à cette étape.</p>`;
  const text = `Bonjour ${input.firstName},\n\nDemande reçue pour ${input.businessName} (${plan.name}).\nUn conseiller vous recontactera.`;
  return sendEmail({ to: input.to, subject: "Fideto — accusé de réception de votre demande", html: violetTemplate("Demande reçue", body), text });
}

async function superAdminEmails() {
  const users = await prisma.user.findMany({
    where: { platformRole: "SUPER_ADMIN", isActive: true },
    select: { email: true },
  });
  return users.map((u) => u.email).filter((e) => e && isValidEmailAddress(e) && isSuperAdminEmailAllowed(e));
}

export async function sendMerchantSignupAdminNotifyEmail(input: {
  businessName: string;
  email: string;
  planId: MerchantPlanId;
  requestId: string;
}): Promise<EmailSendResult> {
  const admins = await superAdminEmails();
  if (admins.length === 0) return { ok: true };
  const href = publicAppUrl(`/super-admin/demandes-inscription/${input.requestId}`);
  const plan = MERCHANT_PLANS[input.planId];
  const body = `<p style="color:#cbd5e1;line-height:1.6;">Nouvelle demande d'inscription commerçant.</p>
<ul style="color:#cbd5e1;line-height:1.8;"><li><strong>Commerce :</strong> ${escapeHtml(input.businessName)}</li>
<li><strong>E-mail :</strong> ${escapeHtml(input.email)}</li><li><strong>Formule :</strong> ${escapeHtml(plan.name)}</li></ul>
<p style="text-align:center;margin:24px 0;"><a href="${escapeHtml(href)}" style="display:inline-block;padding:14px 24px;border-radius:999px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-weight:700;text-decoration:none;">Ouvrir la demande</a></p>`;
  return sendEmail({
    to: admins,
    subject: `Fideto — nouvelle demande d'inscription (${input.businessName})`,
    html: violetTemplate("Nouvelle demande", body),
    text: `Nouvelle demande : ${input.businessName} / ${input.email} / ${plan.name}\n${href}`,
  });
}

export async function sendMerchantSignupCodeEmail(input: {
  to: string;
  firstName: string;
  code: string;
  expiresAt: Date;
  planId: MerchantPlanId;
}): Promise<EmailSendResult> {
  const plan = MERCHANT_PLANS[input.planId];
  const expiry = input.expiresAt.toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" });
  const entryUrl = publicAppUrl("/demarrer");
  const body = `<p style="color:#cbd5e1;line-height:1.6;">Bonjour ${escapeHtml(input.firstName)},</p>
<p style="color:#cbd5e1;line-height:1.6;">Votre demande d'accès à Fideto a été acceptée pour la formule <strong style="color:#f8fafc;">${escapeHtml(plan.name)}</strong>.</p>
<p style="margin:24px 0;text-align:center;font-size:32px;letter-spacing:0.35em;font-weight:800;color:#e9d5ff;">${escapeHtml(input.code)}</p>
<p style="color:#94a3b8;font-size:13px;">Ce code expire le ${escapeHtml(expiry)}. Il est à usage unique pour créer ou rattacher votre compte commerçant.</p>
<p style="text-align:center;margin:24px 0;"><a href="${escapeHtml(entryUrl)}" style="display:inline-block;padding:14px 24px;border-radius:999px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-weight:700;text-decoration:none;">Saisir mon code</a></p>`;
  return sendEmail({
    to: input.to,
    subject: "Fideto — votre code d'inscription commerçant",
    html: violetTemplate("Votre code d'inscription", body),
    text: `Bonjour ${input.firstName},\n\nCode : ${input.code}\nFormule : ${plan.name}\nExpire le ${expiry}\n${entryUrl}`,
  });
}

export async function sendMerchantSignupRejectionEmail(input: {
  to: string;
  firstName: string;
  reason?: string | null;
}): Promise<EmailSendResult> {
  const extra = input.reason?.trim()
    ? `<p style="color:#cbd5e1;line-height:1.6;">${escapeHtml(input.reason.trim())}</p>`
    : "";
  const body = `<p style="color:#cbd5e1;line-height:1.6;">Bonjour ${escapeHtml(input.firstName)},</p>
<p style="color:#cbd5e1;line-height:1.6;">Après étude de votre demande, nous ne sommes pas en mesure de vous donner accès à Fideto pour le moment.</p>${extra}
<p style="color:#cbd5e1;line-height:1.6;">Pour toute question, contactez-nous à <a href="mailto:contact@fideto.fr" style="color:#c4b5fd;">contact@fideto.fr</a>.</p>`;
  return sendEmail({
    to: input.to,
    subject: "Fideto — suite à votre demande d'accès",
    html: violetTemplate("Demande non retenue", body),
    text: `Bonjour ${input.firstName},\n\nVotre demande n'a pas été retenue.\ncontact@fideto.fr`,
  });
}

export async function sendMerchantSubscriptionActivatedEmail(input: {
  to: string;
  firstName: string;
  merchantName: string;
  planId: MerchantPlanId;
}): Promise<EmailSendResult> {
  const plan = MERCHANT_PLANS[input.planId];
  const monthly = formatEurosFromCents(plan.monthlyPriceCents);
  const appUrl = publicAppUrl("/app");
  const body = `<p style="color:#cbd5e1;line-height:1.6;">Bonjour ${escapeHtml(input.firstName)},</p>
<p style="color:#cbd5e1;line-height:1.6;">Le paiement de votre abonnement Fideto pour <strong style="color:#f8fafc;">${escapeHtml(input.merchantName)}</strong> est confirmé (formule ${escapeHtml(plan.name)}, ${escapeHtml(monthly)} TTC / mois).</p>
<p style="text-align:center;margin:24px 0;"><a href="${escapeHtml(appUrl)}" style="display:inline-block;padding:14px 24px;border-radius:999px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-weight:700;text-decoration:none;">Accéder à mon espace</a></p>`;
  return sendEmail({
    to: input.to,
    subject: "Fideto — abonnement activé",
    html: violetTemplate("Abonnement activé", body),
    text: `Bonjour ${input.firstName},\n\nPaiement confirmé pour ${input.merchantName} (${plan.name}).\n${appUrl}`,
  });
}
