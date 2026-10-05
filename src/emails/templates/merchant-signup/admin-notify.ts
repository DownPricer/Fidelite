import { emailPrimaryButton } from "@/emails/components/email-button";
import { escapeHtml } from "@/emails/components/escape-html";
import { violetEmailLayout } from "@/emails/components/email-layout";

export type MerchantSignupAdminNotifyTemplateInput = {
  businessName: string;
  email: string;
  planName: string;
  openRequestUrl: string;
};

export function renderMerchantSignupAdminNotifyEmail(input: MerchantSignupAdminNotifyTemplateInput) {
  const subject = `Fideto — nouvelle demande d'inscription (${input.businessName})`;
  const body = `<p style="color:#cbd5e1;line-height:1.6;">Nouvelle demande d'inscription commerçant.</p>
<ul style="color:#cbd5e1;line-height:1.8;"><li><strong>Commerce :</strong> ${escapeHtml(input.businessName)}</li>
<li><strong>E-mail :</strong> ${escapeHtml(input.email)}</li><li><strong>Formule :</strong> ${escapeHtml(input.planName)}</li></ul>
${emailPrimaryButton("Ouvrir la demande", input.openRequestUrl)}`;
  const html = violetEmailLayout("Nouvelle demande", body);
  const text = `Nouvelle demande : ${input.businessName} / ${input.email} / ${input.planName}\n${input.openRequestUrl}`;
  return { subject, html, text };
}
