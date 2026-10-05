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
  const body = `<p style="margin:0 0 22px;color:#d8d0e3;line-height:25px;">Une nouvelle demande d'inscription commerçant attend votre validation.</p>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;margin:0 0 22px;background-color:#21172d;border:1px solid #3b2b4b;border-radius:16px;">
  <tr>
    <td style="padding:20px 22px;border-bottom:1px solid #3b2b4b;color:#91849d;font-size:12px;font-weight:700;line-height:18px;text-transform:uppercase;letter-spacing:0.8px;">Commerce</td>
    <td align="right" style="padding:20px 22px;border-bottom:1px solid #3b2b4b;color:#ffffff;font-size:14px;font-weight:800;line-height:20px;">${escapeHtml(input.businessName)}</td>
  </tr>
  <tr>
    <td style="padding:16px 22px;border-bottom:1px solid #3b2b4b;color:#91849d;font-size:12px;font-weight:700;line-height:18px;text-transform:uppercase;letter-spacing:0.8px;">E-mail</td>
    <td align="right" style="padding:16px 22px;border-bottom:1px solid #3b2b4b;color:#e9ddf5;font-size:14px;line-height:20px;word-break:break-word;">${escapeHtml(input.email)}</td>
  </tr>
  <tr>
    <td style="padding:16px 22px;color:#91849d;font-size:12px;font-weight:700;line-height:18px;text-transform:uppercase;letter-spacing:0.8px;">Formule</td>
    <td align="right" style="padding:16px 22px;color:#d5b7ff;font-size:14px;font-weight:800;line-height:20px;">${escapeHtml(input.planName)}</td>
  </tr>
</table>
${emailPrimaryButton("Ouvrir la demande", input.openRequestUrl)}`;
  const html = violetEmailLayout("Nouvelle demande", body);
  const text = `Nouvelle demande commerçant\n\nCommerce : ${input.businessName}\nE-mail : ${input.email}\nFormule : ${input.planName}\n\nOuvrir la demande : ${input.openRequestUrl}`;
  return { subject, html, text };
}
