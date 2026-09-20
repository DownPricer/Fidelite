"use client";

import { useState } from "react";

type FaqCategory = "Client" | "Commerçant" | "Général";

type FaqItem = {
  question: string;
  answer: string;
  category: FaqCategory;
};

const FAQ_ITEMS: FaqItem[] = [
  {
    category: "Général",
    question: "Fidelo est-il une carte de fidélité unique ?",
    answer:
      "Fidelo réunit toutes vos cartes de fidélité dans un seul espace numérique. Vous n'avez plus besoin de conserver une carte papier par commerce.",
  },
  {
    category: "Client",
    question: "Comment fonctionne le QR personnel ?",
    answer:
      "Chaque client dispose d'un QR unique. Il suffit de le présenter en caisse pour que le commerçant mette à jour vos points ou vos passages, quel que soit le commerce.",
  },
  {
    category: "Client",
    question: "Puis-je utiliser Google Wallet ?",
    answer:
      "Oui, lorsque la carte d'un commerçant est compatible, vous pouvez l'ajouter à Google Wallet et la retrouver directement depuis votre téléphone.",
  },
  {
    category: "Client",
    question: "Comment rejoindre un commerce ?",
    answer:
      "Scannez le QR code affiché en caisse ou ouvrez le lien Fidelo partagé par le commerçant pour ajouter sa carte à votre espace en quelques secondes.",
  },
  {
    category: "Commerçant",
    question: "Comment créer un programme ?",
    answer:
      "Depuis l'espace commerçant, vous configurez votre programme, personnalisez votre carte et définissez vos avantages en quelques étapes.",
  },
  {
    category: "Commerçant",
    question: "Puis-je choisir entre points et passages ?",
    answer:
      "Oui, votre programme peut fonctionner en points cumulés ou en passages comptabilisés, selon ce qui correspond le mieux à votre activité.",
  },
  {
    category: "Commerçant",
    question: "Mes employés peuvent-ils utiliser la caisse ?",
    answer:
      "Oui, vous pouvez inviter vos employés et leur donner accès à une caisse simple pour scanner les clients et valider leur fidélité.",
  },
  {
    category: "Général",
    question: "Comment sont protégées mes données ?",
    answer:
      "Fidelo utilise uniquement les données nécessaires au fonctionnement du service. Consultez notre politique de confidentialité pour le détail des traitements.",
  },
  {
    category: "Client",
    question: "Comment supprimer mon compte ?",
    answer:
      "Depuis les paramètres de votre espace client, vous pouvez demander la suppression de votre compte à tout moment.",
  },
  {
    category: "Général",
    question: "Comment contacter l'assistance ?",
    answer: "Écrivez-nous à support@fidelo.app, notre équipe vous répond rapidement.",
  },
];

const CATEGORY_STYLES: Record<FaqCategory, string> = {
  Client:
    "border-[light-dark(rgba(122,69,242,0.24),rgba(190,164,255,0.28))] text-[light-dark(#6a36e0,#c4b5ff)]",
  Commerçant:
    "border-[light-dark(rgba(201,63,214,0.26),rgba(231,116,255,0.3))] text-[light-dark(#a8189a,#f0a8ff)]",
  Général: "border-[light-dark(rgba(122,69,242,0.14),rgba(255,255,255,0.16))] text-[var(--muted-strong)]",
};

export function LandingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {FAQ_ITEMS.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;
        return (
          <div key={item.question} className="glass-panel overflow-hidden">
            <h3 className="m-0">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
              >
                <span className="flex flex-1 items-center gap-3">
                  <span
                    className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] ${CATEGORY_STYLES[item.category]}`}
                  >
                    {item.category}
                  </span>
                  <span className="text-sm font-bold text-[var(--ink)] sm:text-base">{item.question}</span>
                </span>
                <span
                  aria-hidden
                  className={`shrink-0 text-lg text-[var(--violet-bright)] transition-transform ${isOpen ? "rotate-45" : ""}`}
                >
                  +
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="px-5 pb-5 text-sm leading-relaxed text-[var(--muted-strong)] sm:px-6"
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
