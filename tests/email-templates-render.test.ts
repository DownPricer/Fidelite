import { describe, expect, it } from "vitest";
import { renderMerchantSignupAckEmail } from "../src/emails/templates/merchant-signup/ack";
import { renderMerchantSignupAdminNotifyEmail } from "../src/emails/templates/merchant-signup/admin-notify";
import { renderMerchantSignupCodeEmail } from "../src/emails/templates/merchant-signup/code";
import { renderMerchantSignupRejectionEmail } from "../src/emails/templates/merchant-signup/rejection";
import { renderMerchantSubscriptionActivatedEmail } from "../src/emails/templates/merchant-signup/subscription-activated";
import { buildCustomerFinalizationEmail, buildEmployeeInvitationEmail, buildCampaignEmail } from "../src/lib/email";

const templates = [
  () =>
    renderMerchantSignupAckEmail({ firstName: "A", businessName: "B", planName: "Fideto" }),
  () =>
    renderMerchantSignupAdminNotifyEmail({
      businessName: "B",
      email: "a@b.fr",
      planName: "Fideto",
      openRequestUrl: "https://admin.fideto.fr/super-admin/demandes-inscription/x",
    }),
  () =>
    renderMerchantSignupCodeEmail({
      firstName: "A",
      code: "123456",
      expiryLabel: "demain",
      planName: "Fideto",
      entryUrl: "https://fideto.fr/demarrer",
    }),
  () => renderMerchantSignupRejectionEmail({ firstName: "A" }),
  () =>
    renderMerchantSubscriptionActivatedEmail({
      firstName: "A",
      merchantName: "B",
      planName: "Fideto",
      monthlyLabel: "19,99 €",
      appUrl: "https://app.fideto.fr/app",
    }),
  () =>
    buildCustomerFinalizationEmail({
      to: "a@b.fr",
      firstName: "A",
      verifyUrl: "https://fideto.fr/v",
      finalizeUrl: "https://fideto.fr/f",
      expiresAt: new Date(),
    }),
  () =>
    buildEmployeeInvitationEmail({
      to: "a@b.fr",
      firstName: "A",
      merchantName: "B",
      invitationUrl: "https://employe.fideto.fr/invitation?token=x",
      expiresAt: new Date(),
    }),
  () =>
    buildCampaignEmail({
      to: "a@b.fr",
      merchantName: "B",
      subject: "Offre spéciale week-end",
      title: "T",
      message: "M",
      reasonLabel: "R",
      unsubscribeUrl: "https://fideto.fr/u",
      preferencesUrl: "https://fideto.fr/p",
    }),
];

describe("templates e-mail — rendu HTML et texte", () => {
  it("produit html et text pour chaque template", () => {
    for (const render of templates) {
      const { subject, html, text } = render();
      expect(subject.length).toBeGreaterThan(3);
      expect(html).toContain("<!DOCTYPE html>");
      expect(text.trim().length).toBeGreaterThan(10);
    }
  });

  it("échappe les entrées utilisateur dans l'accusé bêta", () => {
    const { html } = renderMerchantSignupAckEmail({
      firstName: "<script>",
      businessName: "Commerce & Co",
      planName: "Fideto",
    });
    expect(html).not.toContain("<script>");
    expect(html).toContain("Commerce &amp; Co");
  });
});
