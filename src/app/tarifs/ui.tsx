"use client";

import { useState } from "react";

const QUESTIONS = [
  {
    q: "Quelle est la différence entre les deux formules ?",
    a: "Les fonctionnalités Fideto sont les mêmes. La seconde formule ajoute un téléphone préparé et une scanette pour démarrer avec le matériel prévu.",
  },
  {
    q: "Quand commence l'abonnement mensuel ?",
    a: "Avec le pack téléphone, le premier mois est inclus et la facturation mensuelle commence au deuxième mois. Le détail exact figurera dans les conditions de l'offre.",
  },
  {
    q: "Où consulter les conditions et le contrat ?",
    a: "Les conditions, les informations sur le matériel et le contrat seront accessibles avant la commande. Un exemplaire téléchargeable sera également prévu.",
  },
] as const;

export function PricingFaq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="pr-questions">
      {QUESTIONS.map((item, i) => (
        <div key={item.q} className={open === i ? "pr-question pr-question-open" : "pr-question"}>
          <button type="button" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
            <span>{item.q}</span>
            <span aria-hidden="true">＋</span>
          </button>
          {open === i ? <div className="pr-answer">{item.a}</div> : null}
        </div>
      ))}
    </div>
  );
}
