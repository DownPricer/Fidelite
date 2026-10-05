import { escapeHtml } from "@/emails/components/escape-html";
import { violetEmailLayout } from "@/emails/components/email-layout";

export function renderMerchantSignupAckEmail(input: { firstName: string; businessName: string; planName: string }) {
  const subject = "Fideto — accusé de réception de votre demande";
  const body = `<p style="color:#cbd5e1;line-height:1.6;">Bonjour ${escapeHtml(input.firstName)},</p>
<p style="color:#cbd5e1;line-height:1.6;">Nous avons bien reçu votre demande d'accès à Fideto pour <strong style="color:#f8fafc;">${escapeHtml(input.businessName)}</strong> (formule ${escapeHtml(input.planName)}).</p>
<p style="color:#cbd5e1;line-height:1.6;">Un conseiller étudiera votre dossier et vous recontactera rapidement. Aucun paiement n'est demandé à cette étape.</p>`;
  const html = violetEmailLayout("Demande reçue", body);
  const text = `Bonjour ${input.firstName},\n\nDemande reçue pour ${input.businessName} (${input.planName}).\nUn conseiller vous recontactera.`;
  return { subject, html, text };
}
