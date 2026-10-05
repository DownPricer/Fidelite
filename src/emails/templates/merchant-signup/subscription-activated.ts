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
  const body = `<p style="color:#cbd5e1;line-height:1.6;">Bonjour ${escapeHtml(input.firstName)},</p>
<p style="color:#cbd5e1;line-height:1.6;">Le paiement de votre abonnement Fideto pour <strong style="color:#f8fafc;">${escapeHtml(input.merchantName)}</strong> est confirmé (formule ${escapeHtml(input.planName)}, ${escapeHtml(input.monthlyLabel)} TTC / mois).</p>
${emailPrimaryButton("Accéder à mon espace", input.appUrl)}`;
  const html = violetEmailLayout("Abonnement activé", body);
  const text = `Bonjour ${input.firstName},\n\nPaiement confirmé pour ${input.merchantName} (${input.planName}).\n${input.appUrl}`;
  return { subject, html, text };
}
