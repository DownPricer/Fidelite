// @vitest-environment happy-dom

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
});
