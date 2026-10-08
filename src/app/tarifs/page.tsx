import type { Metadata } from "next";
import Link from "next/link";
import { clientMerchantAppHref } from "@/lib/client-cross-origin-links";
import { publicAppUrl } from "@/lib/hosts";
import { formatEurosFromCents, MERCHANT_PLANS } from "@/lib/merchant-plans";
import { merchantSignupEntryHref } from "@/lib/merchant-signup-routing";
import { PricingFaq } from "./ui";

export const metadata: Metadata = {
  alternates: { canonical: "/tarifs" },
  title: "Fideto — Tarifs pour les commerçants",
  description:
    "Deux formules pour lancer Fideto dans votre commerce : avec votre propre téléphone, ou avec le pack matériel complet.",
};

const FIDETO_MONTHLY = formatEurosFromCents(MERCHANT_PLANS.fideto.monthlyPriceCents);
const PACK_SETUP = formatEurosFromCents(MERCHANT_PLANS["fideto-phone"].setupPriceCents ?? 0);

export default async function TarifsPage() {
  const merchantAppEntryHref = clientMerchantAppHref("/app");

  return (
    <div className="pr-scene">
      <header className="pr-head">
        <div className="pr-wrap pr-head-inner">
          <Link href="/" className="pr-brand">
            <span className="pr-brand-mark">FL</span>Fideto
          </Link>
          <nav className="pr-nav" aria-label="Navigation publique">
            <Link href="/#fonctionnement">Comment ça marche</Link>
            <Link href="/tarifs" className="pr-active" aria-current="page">
              Tarifs
            </Link>
            <a href="#questions">Questions</a>
          </nav>
          <div className="pr-head-actions">
            <a href={publicAppUrl("/app/connexion")} className="pr-ghost-link">
              Se connecter
            </a>
            <a href={merchantAppEntryHref} className="pr-btn pr-btn-primary">
              Je suis commerçant
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="pr-hero">
          <div className="pr-eyebrow">FIDETO POUR LES COMMERÇANTS</div>
          <h1>
            La fidélité simplement,
            <br />
            avec le bon équipement.
          </h1>
          <p>Choisissez votre formule de départ. L&apos;abonnement Fideto reste ensuite à {FIDETO_MONTHLY} TTC par mois.</p>
          <div className="pr-promise">
            <i /> Des prix lisibles avant votre inscription
          </div>
        </section>

        <section className="pr-wrap pr-pricing" id="tarifs" aria-label="Offres Fideto">
          <article className="pr-plan">
            <div className="pr-plan-name">FIDETO</div>
            <h2>Avec votre badge</h2>
            <p className="pr-plan-intro">
              La formule essentielle pour lancer votre programme de fidélité avec votre propre téléphone.
            </p>
            <div className="pr-price-block">
              <div className="pr-main-price">
                <strong>{FIDETO_MONTHLY}</strong>
                <span>TTC / mois</span>
              </div>
              <div className="pr-after">
                Facturation mensuelle selon les <Link href="/conditions" className="pr-link-like">conditions de l&apos;offre</Link>.
              </div>
            </div>
            <div className="pr-gift">
              <span>✦</span> Badge Fideto offert
            </div>
            <div className="pr-features-title">Inclus dans votre abonnement</div>
            <ul className="pr-features">
              <li>Carte de fidélité numérique Fideto</li>
              <li>Ajout de la carte dans Google Wallet</li>
              <li>Suivi des passages et des avantages</li>
              <li>Fichier clients et espace commerçant</li>
              <li>Accès aux outils de communication Fideto</li>
            </ul>
            <div className="pr-plan-actions">
              <Link href={merchantSignupEntryHref("fideto")} className="pr-btn pr-btn-primary pr-btn-full">
                Démarrer avec Fideto →
              </Link>
              <p className="pr-conditions">
                En continuant, vous pourrez consulter les <Link href="/conditions">conditions contractuelles</Link>.
              </p>
            </div>
          </article>

          <article className="pr-plan pr-plan-featured">
            <span className="pr-ribbon">PRÊT À L&apos;EMPLOI</span>
            <div className="pr-plan-name">FIDETO + TÉLÉPHONE</div>
            <h2>Le pack complet</h2>
            <p className="pr-plan-intro">
              Le service Fideto avec un téléphone préparé pour votre commerce et sa scanette.
            </p>
            <div className="pr-price-block">
              <div className="pr-start-price">
                <strong>{PACK_SETUP}</strong>
                <div className="pr-start-copy">
                  <b>TTC à la commande</b>
                  <span>Pack matériel</span>
                </div>
              </div>
              <div className="pr-after">
                <b>Premier mois Fideto inclus</b>, puis {FIDETO_MONTHLY} TTC / mois à partir du deuxième mois.
              </div>
            </div>
            <div className="pr-gift">
              <span>✦</span> Scanette Fideto offerte
            </div>
            <div className="pr-features-title">Le pack comprend</div>
            <ul className="pr-features">
              <li>Toutes les fonctionnalités de Fideto</li>
              <li>Téléphone destiné à l&apos;utilisation de Fideto</li>
              <li>Configuration initiale du matériel</li>
              <li>Scanette Fideto offerte</li>
              <li>Premier mois d&apos;abonnement inclus</li>
            </ul>
            <div className="pr-plan-actions">
              <Link href={merchantSignupEntryHref("fideto-phone")} className="pr-btn pr-btn-light pr-btn-full">
                Choisir le pack complet →
              </Link>
              <p className="pr-conditions">
                Le détail du matériel et de la livraison figure dans les <Link href="/conditions">conditions de l&apos;offre</Link>.
              </p>
            </div>
          </article>
        </section>

        <section className="pr-wrap pr-same-service">
          <div>
            <strong>Le même service Fideto dans les deux formules</strong>
            <p>Vous choisissez simplement l&apos;équipement avec lequel vous souhaitez démarrer.</p>
          </div>
          <div className="pr-same-points">
            <span>Gestion des clients</span>
            <span>Passages et récompenses</span>
            <span>Carte numérique</span>
          </div>
        </section>

        <section className="pr-wrap pr-details">
          <div className="pr-section-head">
            <div className="pr-eyebrow">COMPARER</div>
            <h2>Quelle formule vous convient ?</h2>
            <p>Les différences portent sur l&apos;équipement fourni au démarrage.</p>
          </div>
          <div className="pr-compare" role="table" aria-label="Comparaison des formules">
            <div className="pr-row pr-row-head" role="row">
              <div className="pr-label" role="columnheader">Formule</div>
              <div className="pr-value" role="columnheader">Fideto</div>
              <div className="pr-value" role="columnheader">Fideto + téléphone</div>
            </div>
            <div className="pr-row" role="row">
              <div className="pr-label" role="rowheader">Abonnement Fideto</div>
              <div className="pr-value">{FIDETO_MONTHLY} TTC / mois</div>
              <div className="pr-value">{FIDETO_MONTHLY} TTC / mois</div>
            </div>
            <div className="pr-row" role="row">
              <div className="pr-label" role="rowheader">Badge Fideto</div>
              <div className="pr-value pr-yes">Offert</div>
              <div className="pr-value pr-muted">—</div>
            </div>
            <div className="pr-row" role="row">
              <div className="pr-label" role="rowheader">Téléphone préparé</div>
              <div className="pr-value pr-muted">—</div>
              <div className="pr-value pr-yes">Inclus dans le pack</div>
            </div>
            <div className="pr-row" role="row">
              <div className="pr-label" role="rowheader">Scanette Fideto</div>
              <div className="pr-value pr-muted">—</div>
              <div className="pr-value pr-yes">Offerte</div>
            </div>
            <div className="pr-row" role="row">
              <div className="pr-label" role="rowheader">Premier mois inclus</div>
              <div className="pr-value pr-muted">—</div>
              <div className="pr-value pr-yes">Oui</div>
            </div>
            <div className="pr-row" role="row">
              <div className="pr-label" role="rowheader">Montant à la commande</div>
              <div className="pr-value">{FIDETO_MONTHLY} TTC</div>
              <div className="pr-value">{PACK_SETUP} TTC</div>
            </div>
          </div>
        </section>

        <section className="pr-wrap pr-faq" id="questions">
          <div className="pr-faq-grid">
            <div>
              <div className="pr-eyebrow">QUESTIONS</div>
              <h2>Avant de commencer</h2>
              <p className="pr-faq-copy">
                Les détails contractuels définitifs seront accessibles avant la validation de la commande.
              </p>
            </div>
            <PricingFaq />
          </div>
        </section>

        <section className="pr-wrap pr-cta">
          <div>
            <h2>Prêt à lancer Fideto dans votre commerce ?</h2>
            <p>Choisissez votre formule et commencez la création de votre espace commerçant.</p>
          </div>
          <a href="#tarifs" className="pr-btn pr-btn-light">
            Démarrer mon abonnement →
          </a>
        </section>
      </main>

      <footer className="pr-footer">
        <div className="pr-wrap">
          <span>© {new Date().getFullYear()} Fideto</span>
          <div className="pr-legal">
            <Link href="/conditions">Conditions des offres</Link>
            <Link href="/cgv">Conditions générales de vente</Link>
            <Link href="/confidentialite">Confidentialité</Link>
            <Link href="/mentions-legales">Mentions légales</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
