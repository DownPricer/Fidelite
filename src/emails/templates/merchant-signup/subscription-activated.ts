import { emailPrimaryButton } from "@/emails/components/email-button";
import { escapeHtml } from "@/emails/components/escape-html";
import { violetEmailLayout } from "@/emails/components/email-layout";

export function renderMerchantSubscriptionActivatedEmail(input: {
  firstName: string;
  merchantName: string;
  planName: string;
  monthlyLabel: string;
  appUrl: string;
}) {
  const subject = "Fideto — abonnement activé";
  const body = `<p style="margin:0 0 16px;color:#d8d0e3;line-height:25px;">Bonjour ${escapeHtml(input.firstName)},</p>
<p style="margin:0 0 22px;color:#d8d0e3;line-height:25px;">Bonne nouvelle, le paiement de votre abonnement Fideto est confirmé. Votre espace commerçant est maintenant actif.</p>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;margin:0 0 22px;background-color:#21172d;border:1px solid #3b2b4b;border-radius:16px;">
  <tr>
    <td style="padding:22px 24px;">
      <span style="display:inline-block;margin:0 0 16px;padding:5px 10px;border-radius:999px;background-color:#372052;color:#d5b7ff;font-size:10px;font-weight:800;line-height:14px;letter-spacing:1.2px;text-transform:uppercase;">Abonnement actif</span>
      <p style="margin:0 0 7px;color:#ffffff;font-size:18px;font-weight:800;line-height:24px;">${escapeHtml(input.merchantName)}</p>
      <p style="margin:0;color:#a89caf;font-size:14px;line-height:22px;">Formule <strong style="color:#e9ddf5;">${escapeHtml(input.planName)}</strong><br>${escapeHtml(input.monthlyLabel)} TTC par mois</p>
    </td>
  </tr>
</table>
${emailPrimaryButton("Accéder à mon espace", input.appUrl)}
<p style="margin:16px 0 0;color:#8f829b;font-size:12px;line-height:18px;text-align:center;">Vous pouvez désormais configurer votre programme de fidélité.</p>`;
  const html = violetEmailLayout("Abonnement activé", body);
  const text = `Bonjour ${input.firstName},\n\nPaiement confirmé pour ${input.merchantName}.\nFormule : ${input.planName}\nTarif : ${input.monthlyLabel} TTC par mois\n\nAccéder à mon espace : ${input.appUrl}`;
  return { subject, html, text };
}
