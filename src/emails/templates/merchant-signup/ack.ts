import { escapeHtml } from "@/emails/components/escape-html";
import { violetEmailLayout } from "@/emails/components/email-layout";

export function renderMerchantSignupAckEmail(input: { firstName: string; businessName: string; planName: string }) {
  const subject = "Fideto — accusé de réception de votre demande";
  const body = `<p style="margin:0 0 16px;color:#d8d0e3;line-height:25px;">Bonjour ${escapeHtml(input.firstName)},</p>
<p style="margin:0 0 22px;color:#d8d0e3;line-height:25px;">Nous avons bien reçu votre demande d'accès à Fideto pour <strong style="color:#ffffff;">${escapeHtml(input.businessName)}</strong>.</p>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;margin:0;background-color:#21172d;border:1px solid #3b2b4b;border-radius:16px;">
  <tr>
    <td width="44" valign="top" style="padding:22px 0 22px 22px;">
      <div style="width:32px;height:32px;border-radius:16px;background-color:#7137ff;color:#ffffff;font-size:16px;font-weight:800;line-height:32px;text-align:center;">1</div>
    </td>
    <td style="padding:20px 22px 20px 14px;">
      <p style="margin:0 0 4px;color:#ffffff;font-size:15px;font-weight:800;line-height:21px;">Étude de votre dossier</p>
      <p style="margin:0;color:#a89caf;font-size:13px;line-height:20px;">Formule demandée : ${escapeHtml(input.planName)}. Un conseiller vous recontactera rapidement.</p>
    </td>
  </tr>
</table>
<p style="margin:18px 0 0;color:#a89caf;font-size:13px;line-height:20px;">Aucun paiement ne vous sera demandé pendant cette étape.</p>`;
  const html = violetEmailLayout("Demande reçue", body);
  const text = `Bonjour ${input.firstName},\n\nDemande reçue pour ${input.businessName} (${input.planName}).\nUn conseiller étudiera votre dossier et vous recontactera rapidement.\nAucun paiement n'est demandé à cette étape.`;
  return { subject, html, text };
}
