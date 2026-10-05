# Inventaire des e-mails Fideto

Dernière mise à jour : refonte des URL publiques et extraction des templates inscription bêta.

## Origines des liens (production)

| Espace | Variable | Défaut |
|--------|----------|--------|
| Client | `CUSTOMER_ORIGIN` | `https://fideto.fr` |
| Commerçant | `APP_ORIGIN` | `https://app.fideto.fr` |
| Super-admin | `ADMIN_ORIGIN` | `https://admin.fideto.fr` |
| Employé | `EMPLOYEE_ORIGIN` / `EMPLOYEE_APP_URL` | `https://employe.fideto.fr` |

Construction centralisée : `src/lib/hosts.ts` (`buildPublicUrl`, `publicCustomerUrl`, `publicAppUrl`, `publicAdminUrl`, `superAdminSignupRequestUrl`).

Aperçus locaux (données fictives, aucun envoi) : `npm run emails:preview` → dossier `emails-preview-out/`.

---

## Comptes clients

| Nom | Déclencheur | Destinataire | Sujet | Canal | Template | Déclencheur code | Variables | Liens | Statut |
|-----|-------------|--------------|-------|-------|----------|------------------|-----------|-------|--------|
| Finalisation compte | Inscription e-mail, Google OAuth nouveau compte | Client | Finalisez votre compte Fideto | Resend / SMTP | `src/lib/email.ts` → `buildCustomerFinalizationEmail` | `customer-onboarding.sendCustomerFinalizationInvite`, `auth/register`, `google-auth` | prénom, verifyUrl, finalizeUrl, expiresAt | fideto.fr (vérif + finalisation) | Actif |
| Rappel finalisation | Relance manuelle API | Client | Rappel — finalisez votre compte Fideto | Resend / SMTP | `src/lib/email.ts` (inline) | `customer-onboarding`, `auth/resend-finalization` | prénom, finalizeUrl | fideto.fr/finalisation | Actif |
| Reprise de compte | Demande recovery | Client | Reprendre votre compte Fideto | Resend / SMTP | `src/lib/email.ts` (inline) | `customer-onboarding` recovery | prénom, recoveryUrl | Lien token recovery | Actif |

*SMS finalisation (Twilio, hors e-mail) : `src/lib/sms.ts`, `api/customer/auth/phone/send`.*

---

## Comptes commerçants

| Nom | Déclencheur | Destinataire | Sujet | Canal | Template | Déclencheur code | Variables | Liens | Statut |
|-----|-------------|--------------|-------|-------|----------|------------------|-----------|-------|--------|
| Abonnement activé | Webhook Stripe checkout réussi | Commerçant | Fideto — abonnement activé | Resend / SMTP | `src/emails/templates/merchant-signup/subscription-activated.ts` | `api/stripe/webhook` | prénom, commerce, formule, prix | app.fideto.fr/app | Actif |

---

## Inscription bêta

| Nom | Déclencheur | Destinataire | Sujet | Canal | Template | Déclencheur code | Variables | Liens | Statut |
|-----|-------------|--------------|-------|-------|----------|------------------|-----------|-------|--------|
| Accusé demande | POST `/api/public/merchant-signup/apply` | Candidat | Fideto — accusé de réception… | Resend / SMTP | `src/emails/templates/merchant-signup/ack.ts` | `merchant-signup-service` | prénom, commerce, formule | — | Actif |
| Alerte super-admin | Même apply | Super-admins actifs | Fideto — nouvelle demande… | Resend / SMTP | `src/emails/templates/merchant-signup/admin-notify.ts` | `merchant-signup-emails.sendMerchantSignupAdminNotifyEmail` | commerce, e-mail, formule, **openRequestUrl** | **admin.fideto.fr** fiche demande | Actif (URL corrigée) |
| Code d'inscription | Acceptation super-admin | Candidat | Fideto — votre code… | Resend / SMTP | `src/emails/templates/merchant-signup/code.ts` | `merchant-signup-service` | code, expiration, formule | fideto.fr/demarrer | Actif |
| Refus | Rejet super-admin | Candidat | Fideto — suite à votre demande… | Resend / SMTP | `src/emails/templates/merchant-signup/rejection.ts` | `merchant-signup-service` | prénom, motif | contact@fideto.fr | Actif |

Fiche super-admin : `/super-admin/demandes-inscription/[id]` (`src/app/super-admin/demandes-inscription/[id]/page.tsx`).

---

## Employés et invitations

| Nom | Déclencheur | Destinataire | Sujet | Canal | Template | Déclencheur code | Variables | Liens | Statut |
|-----|-------------|--------------|-------|-------|----------|------------------|-----------|-------|--------|
| Invitation employé | Création / renvoi invitation | Employé | {commerce} — Activez votre accès employé | Resend / SMTP | `src/lib/email.ts` → `buildEmployeeInvitationEmail` | `api/merchant/employees`, `[id]/route` | prénom, commerce, message, invitationUrl, expiration | employe.fideto.fr/invitation | Actif |

---

## Campagnes et visuels

| Nom | Déclencheur | Destinataire | Sujet | Canal | Template | Déclencheur code | Variables | Liens | Statut |
|-----|-------------|--------------|-------|-------|----------|------------------|-----------|-------|--------|
| Campagne marketing | Worker campagnes / notifications staff | Clients opt-in | Personnalisé commerçant | Resend / SMTP | `src/lib/email.ts` → `buildCampaignEmail` | `campaign-worker.ts`, `staff-notification-delivery.ts` | commerce, visuel, CTA, désinscription | fideto.fr préférences / désinscription | Actif |

*Notifications push (Web Push) : `src/lib/push.ts` — hors périmètre e-mail.*

---

## Paiements, factures et abonnements

| Nom | Déclencheur | Destinataire | Sujet | Canal | Template | Déclencheur code | Statut |
|-----|-------------|--------------|-------|-------|----------|------------------|--------|
| Abonnement activé | Voir « Comptes commerçants » | — | — | — | — | Stripe webhook | Actif |

*Factures Stripe : portail commerçant in-app, pas d'e-mail transactionnel dédié dans le code actuel.*

---

## Support

| Nom | Déclencheur | Destinataire | Sujet | Canal | Template | Déclencheur code | Statut |
|-----|-------------|--------------|-------|-------|----------|------------------|--------|
| Formulaire contact public | POST `/api/public/contact` | `SUPPORT_EMAIL` | Fideto — message de {nom} | Resend / SMTP | `src/lib/support-contact.ts` (inline) | `support-contact.sendPublicContactEmail` | Actif |

---

## Administration

| Nom | Déclencheur | Destinataire | Sujet | Canal | Template | Statut |
|-----|-------------|--------------|-------|-------|----------|--------|
| Nouvelle demande bêta | Voir inscription bêta | Super-admins | — | — | `admin-notify.ts` | Actif |

---

## Fichiers sources par template (redesign)

| Slug aperçu | Fichier |
|-------------|---------|
| merchant-signup/ack | `src/emails/templates/merchant-signup/ack.ts` |
| merchant-signup/admin-notify | `src/emails/templates/merchant-signup/admin-notify.ts` |
| merchant-signup/code | `src/emails/templates/merchant-signup/code.ts` |
| merchant-signup/rejection | `src/emails/templates/merchant-signup/rejection.ts` |
| merchant-signup/subscription-activated | `src/emails/templates/merchant-signup/subscription-activated.ts` |
| accounts/customer-finalization | `src/lib/email.ts` (`buildCustomerFinalizationEmail`) |
| team/employee-invitation | `src/lib/email.ts` (`buildEmployeeInvitationEmail`) |
| campaigns/campaign-message | `src/lib/email.ts` (`buildCampaignEmail`) |

Composants partagés : `src/emails/components/email-layout.ts`, `email-button.ts`, `escape-html.ts`.  
Transport unifié (inscription bêta) : `src/emails/transport/send-email.ts`.

---

## Cause du lien « a.fiduto.fr » (corrigé)

Le bouton **Ouvrir la demande** utilisait `publicAppUrl(...)` (`APP_ORIGIN`) au lieu de l’origine super-admin. Si `APP_ORIGIN` est mal saisi en production (ex. faute **fiduto**), le lien hérite de ce domaine erroné. La fiche admin vit sur **`ADMIN_ORIGIN`** (`https://admin.fideto.fr`).

**URL corrigée (exemple)** : `https://admin.fideto.fr/super-admin/demandes-inscription/{requestId}`
