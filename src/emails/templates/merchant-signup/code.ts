import { emailPrimaryButton } from "@/emails/components/email-button";
import { escapeHtml } from "@/emails/components/escape-html";
import { violetEmailLayout } from "@/emails/components/email-layout";

export function renderMerchantSignupCodeEmail(input: {
  firstName: string;
  code: string;
  expiryLabel: string;
  planName: string;
  entryUrl: string;
}) {
  const subject = "Fideto — votre code d'inscription commerçant";
  const body = `<p style="color:#cbd5e1;line-height:1.6;">Bonjour ${escapeHtml(input.firstName)},</p>
<p style="color:#cbd5e1;line-height:1.6;">Votre demande d'accès à Fideto a été acceptée pour la formule <strong style="color:#f8fafc;">${escapeHtml(input.planName)}</strong>.</p>
<p style="margin:24px 0;text-align:center;font-size:32px;letter-spacing:0.35em;font-weight:800;color:#e9d5ff;">${escapeHtml(input.code)}</p>
<p style="color:#94a3b8;font-size:13px;">Ce code expire le ${escapeHtml(input.expiryLabel)}. Il est à usage unique pour créer ou rattacher votre compte commerçant.</p>
${emailPrimaryButton("Saisir mon code", input.entryUrl)}`;
  const html = violetEmailLayout("Votre code d'inscription", body);
  const text = `Bonjour ${input.firstName},\n\nCode : ${input.code}\nFormule : ${input.planName}\nExpire le ${input.expiryLabel}\n${input.entryUrl}`;
  return { subject, html, text };
}
