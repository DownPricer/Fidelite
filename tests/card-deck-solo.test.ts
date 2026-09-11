import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("CardDeck — carte Fife Life unique", () => {
  it("n'utilise plus de lien vers la fiche identité", () => {
    const source = readFileSync("src/components/fife-life/card-deck.tsx", "utf8");
    expect(source).not.toMatch(/deck\.length === 1 && cards\.length === 0/);
    expect(source).not.toContain('href="/carte/identite"');
    expect(source).toContain("onEnlargeCard");
  });
});
