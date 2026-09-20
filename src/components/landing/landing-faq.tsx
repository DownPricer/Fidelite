"use client";

import { useState } from "react";
import { PlusIcon } from "@/components/landing/icons";

type FaqItem = {
  question: string;
  answer: string;
};

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Fidelo est-il une carte de fidélité unique ?",
    answer:
      "Oui. Votre espace Fidelo rassemble les cartes des commerces participants, tandis que chaque commerce conserve son propre programme et ses propres avantages.",
  },
  {
    question: "Comment fonctionne le QR code ?",
    answer:
      "Vous présentez votre QR personnel. Le commerçant le scanne pour retrouver votre carte et effectuer l'action adaptée depuis sa caisse.",
  },
  {
    question: "Puis-je ajouter ma carte à Google Wallet ?",
    answer: "Oui, lorsque le commerce active cette possibilité. Votre carte reste accessible facilement depuis votre téléphone.",
  },
  {
    question: "Fidelo convient-il aux petits commerces ?",
    answer:
      "Oui. L'interface est pensée pour lancer rapidement un programme simple, puis l'adapter au rythme du commerce.",
  },
  {
    question: "Comment supprimer mon compte ?",
    answer: "Depuis les paramètres de votre espace client, vous pouvez demander la suppression de votre compte à tout moment.",
  },
  {
    question: "Comment contacter l'assistance ?",
    answer: "Écrivez-nous à support@fidelo.app, notre équipe vous répond rapidement.",
  },
];

export function LandingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="grid max-w-[850px] gap-2.5">
      {FAQ_ITEMS.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;
        return (
          <div key={item.question} className="overflow-hidden rounded-[18px] border border-[var(--fh-border)] bg-[var(--fh-surface)]">
            <h3 className="m-0">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex min-h-16 w-full items-center justify-between gap-3.5 px-5 text-left text-[15px] font-extrabold text-[var(--fh-text)]"
              >
                {item.question}
                <PlusIcon
                  className={`h-[18px] w-[18px] shrink-0 text-[var(--fh-purple)] transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="px-5 pb-5 text-[15px] leading-relaxed text-[var(--fh-muted)]"
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
