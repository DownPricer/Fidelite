import { escapeHtml } from "@/emails/components/escape-html";
import { violetEmailLayout } from "@/emails/components/email-layout";

export function renderMerchantSignupRejectionEmail(input: { firstName: string; reason?: string | null }) {
  const extra = input.reason?.trim()
    ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;margin:20px 0;background-color:#21172d;border:1px solid #3b2b4b;border-radius:16px;">
  <tr>
    <td style="padding:20px 22px;">
      <p style="margin:0 0 6px;color:#a98bbf;font-size:10px;font-weight:800;line-height:14px;letter-spacing:1.2px;text-transform:uppercase;">Précision concernant votre demande</p>
      <p style="margin:0;color:#d8d0e3;font-size:14px;line-height:22px;">${escapeHtml(input.reason.trim())}</p>
    </td>
  </tr>
</table>`
    : "";
  const subject = "Fideto — suite à votre demande d'accès";
  const body = `<p style="margin:0 0 16px;color:#d8d0e3;line-height:25px;">Bonjour ${escapeHtml(input.firstName)},</p>
<p style="margin:0;color:#d8d0e3;line-height:25px;">Après étude de votre demande, nous ne sommes pas en mesure de vous donner accès à Fideto pour le moment.</p>${extra}
<p style="margin:20px 0 0;color:#a89caf;font-size:14px;line-height:22px;">Une question ? Écrivez-nous à <a href="mailto:contact@fideto.fr" style="color:#c69cff;font-weight:700;text-decoration:underline;">contact@fideto.fr</a>.</p>`;
  const html = violetEmailLayout("Demande non retenue", body);
  const reason = input.reason?.trim() ? `\n\nPrécision : ${input.reason.trim()}` : "";
  const text = `Bonjour ${input.firstName},\n\nAprès étude, votre demande n'a pas été retenue pour le moment.${reason}\n\nUne question ? contact@fideto.fr`;
  return { subject, html, text };
}
