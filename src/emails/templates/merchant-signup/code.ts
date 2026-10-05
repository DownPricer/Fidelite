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
  const body = `<p style="margin:0 0 16px;color:#d8d0e3;line-height:25px;">Bonjour ${escapeHtml(input.firstName)},</p>
<p style="margin:0 0 22px;color:#d8d0e3;line-height:25px;">Votre demande d'accès a été acceptée pour la formule <strong style="color:#ffffff;">${escapeHtml(input.planName)}</strong>. Utilisez le code ci-dessous pour finaliser votre inscription.</p>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;margin:0 0 18px;background-color:#241533;border:1px solid #6f3fb1;border-radius:16px;">
  <tr>
    <td align="center" style="padding:24px 18px;">
      <p style="margin:0 0 8px;color:#a98bbf;font-size:10px;font-weight:800;line-height:14px;letter-spacing:1.4px;text-transform:uppercase;">Code d'inscription</p>
      <p style="margin:0;color:#ffffff;font-family:Consolas,Monaco,'Courier New',monospace;font-size:34px;font-weight:800;line-height:42px;letter-spacing:8px;word-break:break-all;">${escapeHtml(input.code)}</p>
    </td>
  </tr>
</table>
<p style="margin:0;color:#a89caf;font-size:13px;line-height:20px;text-align:center;">Expire le <strong style="color:#d8c8e5;">${escapeHtml(input.expiryLabel)}</strong> · Code à usage unique</p>
${emailPrimaryButton("Saisir mon code", input.entryUrl)}
<p style="margin:16px 0 0;color:#8f829b;font-size:12px;line-height:18px;text-align:center;">Ne transmettez jamais ce code à une autre personne.</p>`;
  const html = violetEmailLayout("Votre code d'inscription", body);
  const text = `Bonjour ${input.firstName},\n\nVotre demande a été acceptée.\nCode : ${input.code}\nFormule : ${input.planName}\nExpire le ${input.expiryLabel}\n\nFinaliser mon inscription : ${input.entryUrl}\n\nNe transmettez jamais ce code à une autre personne.`;
  return { subject, html, text };
}
