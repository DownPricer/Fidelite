import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { renderMerchantSignupAckEmail } from "../src/emails/templates/merchant-signup/ack";
import { renderMerchantSignupAdminNotifyEmail } from "../src/emails/templates/merchant-signup/admin-notify";
import { renderMerchantSignupCodeEmail } from "../src/emails/templates/merchant-signup/code";
import { renderMerchantSignupRejectionEmail } from "../src/emails/templates/merchant-signup/rejection";
import { renderMerchantSubscriptionActivatedEmail } from "../src/emails/templates/merchant-signup/subscription-activated";
import {
  buildCampaignEmail,
  buildCustomerFinalizationEmail,
  buildEmployeeInvitationEmail,
} from "../src/lib/email";

const outDir = join(process.cwd(), "emails-preview-out");

type PreviewItem = { slug: string; subject: string; html: string; text: string };

const samples: PreviewItem[] = [
  {
    slug: "merchant-signup/ack",
    ...renderMerchantSignupAckEmail({
      firstName: "Camille",
      businessName: "Café Nova",
      planName: "Fideto",
    }),
  },
  {
    slug: "merchant-signup/admin-notify",
    ...renderMerchantSignupAdminNotifyEmail({
      businessName: "Café Nova",
      email: "pro@exemple.fr",
      planName: "Fideto",
      openRequestUrl: "https://admin.fideto.fr/super-admin/demandes-inscription/req_demo_01",
    }),
  },
  {
    slug: "merchant-signup/code",
    ...renderMerchantSignupCodeEmail({
      firstName: "Camille",
      code: "482910",
      expiryLabel: "20 avril 2026 à 10:00",
      planName: "Fideto",
      entryUrl: "https://fideto.fr/demarrer",
    }),
  },
  {
    slug: "merchant-signup/rejection",
    ...renderMerchantSignupRejectionEmail({ firstName: "Camille", reason: "Nous n'ouvrons pas encore ce secteur." }),
  },
  {
    slug: "merchant-signup/subscription-activated",
    ...renderMerchantSubscriptionActivatedEmail({
      firstName: "Camille",
      merchantName: "Café Nova",
      planName: "Fideto",
      monthlyLabel: "19,99 €",
      appUrl: "https://app.fideto.fr/app",
    }),
  },
  {
    slug: "accounts/customer-finalization",
    ...buildCustomerFinalizationEmail({
      to: "client@exemple.fr",
      firstName: "Léa",
      verifyUrl: "https://fideto.fr/api/customer/auth/verify-email?token=demo",
      finalizeUrl: "https://fideto.fr/finalisation",
      expiresAt: new Date("2026-04-20T10:00:00Z"),
    }),
  },
  {
    slug: "team/employee-invitation",
    ...buildEmployeeInvitationEmail({
      to: "employe@exemple.fr",
      firstName: "Marc",
      merchantName: "Café Nova",
      invitationUrl: "https://employe.fideto.fr/invitation?token=demo",
      expiresAt: new Date("2026-04-20T10:00:00Z"),
      message: "Bienvenue dans l'équipe !",
    }),
  },
  {
    slug: "campaigns/campaign-message",
    ...buildCampaignEmail({
      to: "client@exemple.fr",
      merchantName: "Café Nova",
      subject: "Offre spéciale",
      title: "Double points ce week-end",
      message: "Présentez votre QR en caisse.",
      reasonLabel: "Vous recevez ce message car vous êtes client Fideto de ce commerce.",
      unsubscribeUrl: "https://fideto.fr/desinscription?token=demo",
      preferencesUrl: "https://fideto.fr/compte/parametres",
    }),
  },
];

mkdirSync(outDir, { recursive: true });
const index: string[] = ["# Aperçus e-mail Fideto (données fictives)\n"];

for (const item of samples) {
  const htmlPath = join(outDir, `${item.slug}.html`);
  const textPath = join(outDir, `${item.slug}.txt`);
  mkdirSync(dirname(htmlPath), { recursive: true });
  writeFileSync(htmlPath, item.html, "utf8");
  writeFileSync(textPath, item.text, "utf8");
  index.push(`- **${item.subject}** → \`${item.slug}.html\``);
}

writeFileSync(join(outDir, "INDEX.md"), index.join("\n"), "utf8");
console.log(`Aperçus générés dans ${outDir} (${samples.length} e-mails).`);
