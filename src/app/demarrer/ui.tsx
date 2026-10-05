"use client";

import Link from "next/link";
import { useCallback, useId, useRef, useState } from "react";
import {
  merchantSignupApplicationFromFormData,
  type MerchantSignupFieldErrors,
} from "@/lib/merchant-signup-application-input";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  KeyRoundIcon,
  LockKeyholeIcon,
  ShieldCheckIcon,
} from "@/components/landing/icons";
import { SignupCodeInputs } from "./signup-code-inputs";

const BUSINESS_ACTIVITIES = [
  "Commerce de proximité",
  "Restaurant ou café",
  "Beauté et bien-être",
  "Mode et accessoires",
  "Services à la personne",
  "Autre",
] as const;

type PlanSummary = {
  id: string;
  name: string;
  monthlyLabel: string;
  setupLabel: string | null;
  firstMonthIncluded: boolean;
};

type Panel = "form" | "code" | "success";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <span className="fd-field-error" role="alert">
      {message}
    </span>
  );
}

function inputClass(invalid: boolean) {
  return invalid ? "fd-input fd-input-invalid" : "fd-input";
}

export function MerchantSignupForm({ plan }: { plan: PlanSummary }) {
  const [panel, setPanel] = useState<Panel>("form");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<MerchantSignupFieldErrors>({});
  const [emailWarning, setEmailWarning] = useState<string | null>(null);
  const submitLock = useRef(false);
  const [codeDigits, setCodeDigits] = useState(["", "", "", "", "", ""]);
  const [codeEmail, setCodeEmail] = useState("");
  const formErrorId = useId();
  const codeErrorId = useId();

  const showForm = () => {
    setPanel("form");
    setError(null);
    setFieldErrors({});
  };

  const showCode = () => {
    setPanel("code");
    setError(null);
  };

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitLock.current || pending) return;
    submitLock.current = true;
    setPending(true);
    setError(null);
    setFieldErrors({});
    setEmailWarning(null);
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = merchantSignupApplicationFromFormData(data, plan.id);
    try {
      const response = await fetch("/api/public/merchant-signup/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json()) as {
        error?: string;
        fieldErrors?: MerchantSignupFieldErrors;
        emailWarning?: string;
      };
      if (!response.ok) {
        setError(body.error ?? "Envoi impossible. Vérifiez les champs et réessayez.");
        setFieldErrors(body.fieldErrors ?? {});
        return;
      }
      if (body.emailWarning) setEmailWarning(body.emailWarning);
      setPanel("success");
    } catch {
      setError("Erreur réseau. Vérifiez votre connexion et réessayez.");
    } finally {
      setPending(false);
      submitLock.current = false;
    }
  };

  const submitCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    const code = codeDigits.join("");
    if (code.length !== 6) {
      setError("Saisissez les six chiffres de votre code.");
      setPending(false);
      return;
    }
    try {
      const response = await fetch("/api/public/merchant-signup/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: codeEmail, code }),
      });
      const body = (await response.json()) as { error?: string; nextUrl?: string };
      if (!response.ok) {
        setError(body.error ?? "Code invalide ou expiré.");
        return;
      }
      window.location.assign(body.nextUrl ?? "https://app.fideto.fr/app/compte-commercant");
    } catch {
      setError("Erreur réseau. Réessayez dans un instant.");
    } finally {
      setPending(false);
    }
  };

  const onCodeDigitsChange = useCallback((next: string[]) => setCodeDigits(next), []);

  return (
    <div className="fd-layout">
      <section className="fd-intro" aria-label="Présentation du parcours bêta">
        <span className="fd-beta-badge">
          <span className="fd-beta-dot" aria-hidden />
          Accès bêta
        </span>
        <h1>Construisons votre fidélité.</h1>
        <p className="fd-lead">
          Présentez-nous votre commerce. Un conseiller Fideto étudie votre demande et vous accompagne personnellement pour lancer votre programme.
        </p>

        <div className="fd-plan" aria-label="Formule sélectionnée">
          <div className="fd-plan-top">
            <div>
              <span className="fd-plan-label">Formule choisie</span>
              <strong className="fd-plan-name">{plan.name}</strong>
            </div>
            <div>
              <div className="fd-plan-price">
                {plan.monthlyLabel}
                <small>TTC / mois</small>
              </div>
              {plan.setupLabel ? (
                <p className="fd-plan-setup">
                  {plan.setupLabel} TTC à la commande
                  {plan.firstMonthIncluded ? " · 1er mois inclus" : ""}
                </p>
              ) : null}
            </div>
          </div>
          <div className="fd-free">
            <ShieldCheckIcon aria-hidden />
            <span>Demande gratuite, sans engagement et sans paiement aujourd&apos;hui.</span>
          </div>
        </div>

        <div className="fd-steps" aria-label="Étapes de l'inscription">
          <div className="fd-step">
            <span className="fd-step-num">1</span>
            <div>
              <strong>Votre demande</strong>
              <span>Quelques informations sur votre commerce.</span>
            </div>
          </div>
          <div className="fd-step">
            <span className="fd-step-num">2</span>
            <div>
              <strong>Un échange humain</strong>
              <span>Un conseiller vous répond rapidement.</span>
            </div>
          </div>
          <div className="fd-step">
            <span className="fd-step-num">3</span>
            <div>
              <strong>Votre lancement</strong>
              <span>Vous recevez votre code et finalisez l&apos;inscription.</span>
            </div>
          </div>
        </div>
      </section>

      <div className="fd-main-column">
        <section
          className="fd-form-card fd-success-card"
          hidden={panel !== "success"}
          aria-live="polite"
          aria-label="Confirmation d'envoi"
        >
          <h2>Demande envoyée</h2>
          <p>
            Merci ! Un conseiller Fideto étudiera votre demande et vous contactera rapidement. Vous recevrez un accusé de réception par e-mail.
            Aucun paiement n&apos;a été déclenché.
          </p>
          {emailWarning ? (
            <p className="fd-alert" role="status">{emailWarning}</p>
          ) : null}
          <Link href="/tarifs" className="fd-success-link">Retour aux tarifs</Link>
        </section>

        <section
          className="fd-form-card"
          hidden={panel !== "form"}
          aria-label="Demande d'accès Fideto"
        >
          <div className="fd-form-head">
            <div>
              <h2>Parlons de votre commerce</h2>
              <p>Les champs marqués d&apos;un * sont obligatoires.</p>
            </div>
            <span className="fd-secure">
              <LockKeyholeIcon aria-hidden />
              Données protégées
            </span>
          </div>

          <form onSubmit={(e) => void submitForm(e)} noValidate>
            {error ? (
              <div className="fd-alert" id={formErrorId} role="alert">
                {error}
              </div>
            ) : null}

            <div className="fd-section">
              <div className="fd-section-title">Vos coordonnées</div>
              <div className="fd-grid">
                <label>
                  <span className="fd-label">Prénom <span className="fd-required">*</span></span>
                  <input className={inputClass(Boolean(fieldErrors.firstName))} name="firstName" type="text" required autoComplete="given-name" aria-invalid={Boolean(fieldErrors.firstName)} />
                  <FieldError message={fieldErrors.firstName} />
                </label>
                <label>
                  <span className="fd-label">Nom <span className="fd-required">*</span></span>
                  <input className={inputClass(Boolean(fieldErrors.lastName))} name="lastName" type="text" required autoComplete="family-name" aria-invalid={Boolean(fieldErrors.lastName)} />
                  <FieldError message={fieldErrors.lastName} />
                </label>
                <label className="fd-field-wide">
                  <span className="fd-label">E-mail professionnel <span className="fd-required">*</span></span>
                  <input
                    className={inputClass(Boolean(fieldErrors.email))}
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="vous@votrecommerce.fr"
                    aria-invalid={Boolean(fieldErrors.email)}
                  />
                  <FieldError message={fieldErrors.email} />
                </label>
                <label>
                  <span className="fd-label">Téléphone portable <span className="fd-required">*</span></span>
                  <input className={inputClass(Boolean(fieldErrors.mobilePhone))} name="mobilePhone" type="tel" required autoComplete="tel" aria-invalid={Boolean(fieldErrors.mobilePhone)} />
                  <FieldError message={fieldErrors.mobilePhone} />
                </label>
                <label>
                  <span className="fd-label">Téléphone fixe</span>
                  <input className={inputClass(Boolean(fieldErrors.landlinePhone))} name="landlinePhone" type="tel" autoComplete="tel" aria-invalid={Boolean(fieldErrors.landlinePhone)} />
                  <FieldError message={fieldErrors.landlinePhone} />
                </label>
              </div>
            </div>

            <div className="fd-section">
              <div className="fd-section-title">Votre commerce</div>
              <div className="fd-grid">
                <label>
                  <span className="fd-label">Nom du commerce <span className="fd-required">*</span></span>
                  <input className={inputClass(Boolean(fieldErrors.businessName))} name="businessName" type="text" required autoComplete="organization" aria-invalid={Boolean(fieldErrors.businessName)} />
                  <FieldError message={fieldErrors.businessName} />
                </label>
                <label>
                  <span className="fd-label">Activité <span className="fd-required">*</span></span>
                  <select className={fieldErrors.businessActivity ? "fd-select fd-input-invalid" : "fd-select"} name="businessActivity" required defaultValue="" aria-invalid={Boolean(fieldErrors.businessActivity)}>
                    <option value="" disabled>Sélectionner une activité</option>
                    {BUSINESS_ACTIVITIES.map((activity) => (
                      <option key={activity} value={activity}>{activity}</option>
                    ))}
                  </select>
                  <FieldError message={fieldErrors.businessActivity} />
                </label>
                <label className="fd-field-wide">
                  <span className="fd-label">Adresse <span className="fd-required">*</span></span>
                  <input className={inputClass(Boolean(fieldErrors.addressLine1))} name="addressLine1" type="text" required autoComplete="street-address" aria-invalid={Boolean(fieldErrors.addressLine1)} />
                  <FieldError message={fieldErrors.addressLine1} />
                </label>
                <label>
                  <span className="fd-label">Code postal <span className="fd-required">*</span></span>
                  <input className={inputClass(Boolean(fieldErrors.postalCode))} name="postalCode" type="text" inputMode="numeric" required autoComplete="postal-code" aria-invalid={Boolean(fieldErrors.postalCode)} />
                  <FieldError message={fieldErrors.postalCode} />
                </label>
                <label>
                  <span className="fd-label">Ville <span className="fd-required">*</span></span>
                  <input className={inputClass(Boolean(fieldErrors.city))} name="city" type="text" required autoComplete="address-level2" aria-invalid={Boolean(fieldErrors.city)} />
                  <FieldError message={fieldErrors.city} />
                </label>
                <label>
                  <span className="fd-label">Site internet</span>
                  <input className={inputClass(Boolean(fieldErrors.website))} name="website" type="text" inputMode="url" placeholder="https://votre-site.fr" aria-invalid={Boolean(fieldErrors.website)} />
                  <FieldError message={fieldErrors.website} />
                </label>
                <label>
                  <span className="fd-label">SIRET</span>
                  <input className={inputClass(Boolean(fieldErrors.siret))} name="siret" type="text" inputMode="numeric" aria-invalid={Boolean(fieldErrors.siret)} />
                  <FieldError message={fieldErrors.siret} />
                </label>
                <label className="fd-field-wide">
                  <span className="fd-label">Un besoin particulier ?</span>
                  <textarea
                    className="fd-textarea"
                    name="message"
                    placeholder="Parlez-nous de votre commerce ou de votre projet…"
                  />
                </label>
              </div>
            </div>

            <label className="fd-consent">
              <input name="contactConsent" type="checkbox" required aria-invalid={Boolean(fieldErrors.contactConsent)} />
              <span>
                J&apos;accepte d&apos;être contacté par Fideto au sujet de cette demande. Aucun message marketing sans accord distinct.{" "}
                <Link href="/confidentialite">Politique de confidentialité</Link>
              </span>
            </label>
            <FieldError message={fieldErrors.contactConsent} />

            <div className="fd-actions">
              <button className="fd-primary" type="submit" disabled={pending} aria-busy={pending}>
                <span className="fd-btn-content">
                  {pending ? "Envoi en cours…" : "Envoyer ma demande"}
                  {!pending ? <ArrowRightIcon aria-hidden /> : null}
                </span>
              </button>
              <button className="fd-secondary" type="button" onClick={showCode} disabled={pending}>
                J&apos;ai déjà un code
              </button>
            </div>
            <p className="fd-fineprint">Réponse personnalisée · Aucun paiement à cette étape</p>
          </form>
        </section>

        <section
          className="fd-form-card fd-code-card"
          hidden={panel !== "code"}
          aria-label="Validation du code d'inscription"
        >
          <button className="fd-back" type="button" onClick={showForm}>
            <span className="fd-btn-content">
              <ArrowLeftIcon aria-hidden />
              Retour à la demande
            </span>
          </button>
          <div className="fd-code-icon" aria-hidden>
            <KeyRoundIcon />
          </div>
          <h2>Votre accès est prêt ?</h2>
          <p className="fd-code-copy">
            Saisissez le code reçu après l&apos;acceptation de votre demande. Vous ne l&apos;avez pas encore ? Remplissez le formulaire ou écrivez à{" "}
            <a href="mailto:contact@fideto.fr">contact@fideto.fr</a>.
          </p>

          <form onSubmit={(e) => void submitCode(e)}>
            {error ? (
              <div className="fd-alert" id={codeErrorId} role="alert">
                {error}
              </div>
            ) : null}
            <label>
              <span className="fd-label">E-mail utilisé dans la demande</span>
              <input
                className="fd-input"
                type="email"
                required
                autoComplete="email"
                placeholder="vous@votrecommerce.fr"
                value={codeEmail}
                onChange={(e) => setCodeEmail(e.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? codeErrorId : undefined}
              />
            </label>
            <div className="fd-section">
              <span className="fd-label">Code à 6 chiffres</span>
              <SignupCodeInputs digits={codeDigits} onChange={onCodeDigitsChange} disabled={pending} />
            </div>
            <div className="fd-actions">
              <button className="fd-primary" type="submit" disabled={pending} aria-busy={pending}>
                <span className="fd-btn-content">
                  {pending ? "Validation…" : "Continuer mon inscription"}
                  {!pending ? <ArrowRightIcon aria-hidden /> : null}
                </span>
              </button>
            </div>
            <p className="fd-fineprint">Le paiement intervient seulement après la création de votre compte.</p>
          </form>
        </section>
      </div>
    </div>
  );
}
