import { readFileSync } from "fs";
import { join } from "path";
import { describe, expect, it } from "vitest";

/**
 * Régression 1.1 — défilement des statistiques.
 *
 * Un test de layout réel (scrollHeight/getBoundingClientRect) n'a de sens que dans un
 * moteur de rendu complet ; ce dépôt teste ce type de composant avec happy-dom, qui ne
 * fait pas de mise en page. On verrouille donc ici, au niveau des sources, les pièges
 * connus qui bloquent le défilement dans un shell d'app mobile (overflow:hidden ambiant,
 * 100vh non dynamique, nav basse et clearance désynchronisées) — vérifiés manuellement en
 * navigateur (375×812 à 1440×900, jeux de données volumineux : 80 employés, 60 cohortes,
 * 60 clients) au moment de ce correctif : le dernier élément de chaque onglet restait
 * visible au-dessus de la nav basse.
 */

const globalsCss = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");
const layoutClient = readFileSync(join(process.cwd(), "src/app/app/layout-client.tsx"), "utf8");
const appNav = readFileSync(join(process.cwd(), "src/components/app-nav.tsx"), "utf8");
const statistiquesPanel = readFileSync(
  join(process.cwd(), "src/app/app/statistiques/statistiques-panel.tsx"),
  "utf8",
);

function cssRuleBody(css: string, selector: string): string {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) throw new Error(`Selector not found in CSS: ${selector}`);
  const end = css.indexOf("}", start);
  return css.slice(start, end + 1);
}

describe("statistiques — shell mobile sans piège de défilement", () => {
  it("le shell marchand (.merchant-page-shell) n'a pas d'overflow bloquant ni de hauteur figée", () => {
    const rule = cssRuleBody(globalsCss, ".merchant-page-shell");
    expect(rule).not.toMatch(/overflow:\s*hidden/);
    expect(rule).not.toMatch(/height:\s*\d/);
  });

  it("aucune règle globale ne verrouille html/body en overflow:hidden ou position:fixed hors media wallet", () => {
    // Seul .wallet-shell (carte client plein écran) peut verrouiller le scroll body ; jamais le shell marchand.
    const bodyRules = [...globalsCss.matchAll(/(?:^|\n)((?:html,\s*)?body(?:\s*:has\([^)]*\))?)\s*\{([^}]*)\}/g)];
    for (const [, selector, body] of bodyRules) {
      if (/wallet-shell/.test(selector)) continue;
      expect(body, `règle "${selector.trim()}" ne doit pas figer le scroll body`).not.toMatch(
        /position:\s*fixed/,
      );
    }
  });

  it("n'utilise jamais 100vh brut (seulement 100dvh, insensible à la barre d'adresse mobile)", () => {
    expect(globalsCss).not.toMatch(/[^d]100vh/);
  });

  it("la nav basse mobile et le padding de clearance du contenu basculent au même breakpoint (md)", () => {
    expect(appNav).toMatch(/merchant-bottom-nav\s+md:hidden/);
    expect(layoutClient).toMatch(/pb-\[calc\([^\]]*\)\]\s+md:pb-0/);
  });

  it("le comparateur (dernier bloc de l'onglet Vue d'ensemble) n'est pas dans un conteneur à hauteur/overflow fixes", () => {
    // Le comparateur doit rester dans le flux normal (space-y-4), jamais dans un
    // wrapper overflow-y-auto à hauteur fixe qui couperait son propre scroll interne.
    const overviewTab = statistiquesPanel.slice(
      statistiquesPanel.indexOf("function OverviewTab"),
      statistiquesPanel.indexOf("function FrequentationTab"),
    );
    expect(overviewTab).not.toMatch(/overflow-y-(auto|scroll)/);
    expect(overviewTab).not.toMatch(/max-h-/);
  });
});
