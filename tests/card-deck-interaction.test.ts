// @vitest-environment happy-dom

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  shouldIgnoreCardExpand,
  shouldProceedWithCardExpand,
} from "../src/lib/card-deck-interaction";

function targetFrom(html: string) {
  const root = document.createElement("div");
  root.innerHTML = html;
  document.body.appendChild(root);
  return root.querySelector("[data-testid='hit']") ?? root.firstElementChild!;
}

describe("card-deck interaction", () => {
  it("ignore le clic sur la zone QR", () => {
    const qr = targetFrom('<div data-no-card-expand="true" data-testid="hit"></div>');
    expect(shouldIgnoreCardExpand(qr)).toBe(true);
  });

  it("autorise le clic sur le corps de la carte", () => {
    const body = targetFrom('<div data-testid="hit"></div>');
    expect(shouldIgnoreCardExpand(body)).toBe(false);
    expect(
      shouldProceedWithCardExpand({ target: body, active: true, suppressNextClick: false }),
    ).toBe(true);
  });

  it("bloque l’ouverture après un swipe", () => {
    const body = targetFrom('<div data-testid="hit"></div>');
    expect(
      shouldProceedWithCardExpand({ target: body, active: true, suppressNextClick: true }),
    ).toBe(false);
  });

  it("ne déclenche pas l’agrandissement carte quand le QR est touché", () => {
    const qr = targetFrom('<div data-no-card-expand="true" data-testid="hit"></div>');
    expect(
      shouldProceedWithCardExpand({ target: qr, active: true, suppressNextClick: false }),
    ).toBe(false);
  });

  it("cadre les cartes PC avec le même ratio et des enfants à 100%", () => {
    const root = process.cwd();
    const component = readFileSync(join(root, "src/components/fife-life/card-deck.tsx"), "utf8");
    const css = readFileSync(join(root, "src/app/globals.css"), "utf8");

    expect(component.match(/deck-card-frame/g)?.length).toBeGreaterThanOrEqual(2);
    expect(css).toContain(".deck-card-frame");
    expect(css).toContain("aspect-ratio: 1.586 / 1");
    expect(css).toContain(".fife-deck-scene .loyalty-card-shell .interactive-card-depth");
    expect(css).toContain(".fife-deck-scene .loyalty-card-shell .loyalty-card");
  });
});
