import { escapeHtml } from "@/emails/components/escape-html";
import { violetEmailLayout } from "@/emails/components/email-layout";

export function renderMerchantSignupRejectionEmail(input: { firstName: string; reason?: string | null }) {
  const extra = input.reason?.trim()
    ? `<p style="color:#cbd5e1;line-height:1.6;">${escapeHtml(input.reason.trim())}</p>`
    : "";
  const subject = "Fideto — suite à votre demande d'accès";
  const body = `<p style="color:#cbd5e1;line-height:1.6;">Bonjour ${escapeHtml(input.firstName)},</p>
<p style="color:#cbd5e1;line-height:1.6;">Après étude de votre demande, nous ne sommes pas en mesure de vous donner accès à Fideto pour le moment.</p>${extra}
<p style="color:#cbd5e1;line-height:1.6;">Pour toute question, contactez-nous à <a href="mailto:contact@fideto.fr" style="color:#c4b5fd;">contact@fideto.fr</a>.</p>`;
  const html = violetEmailLayout("Demande non retenue", body);
  const text = `Bonjour ${input.firstName},\n\nVotre demande n'a pas été retenue.\ncontact@fideto.fr`;
  return { subject, html, text };
}
